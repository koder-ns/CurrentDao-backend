"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var RecoveryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecoveryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const schedule_1 = require("@nestjs/schedule");
const multisig_wallet_entity_1 = require("../entities/multisig-wallet.entity");
const signature_entity_1 = require("../entities/signature.entity");
let RecoveryService = RecoveryService_1 = class RecoveryService {
    walletRepository;
    signatureRepository;
    dataSource;
    logger = new common_1.Logger(RecoveryService_1.name);
    RECOVERY_EXPIRY_HOURS = 72;
    SUPER_MAJORITY_THRESHOLD = 0.67;
    constructor(walletRepository, signatureRepository, dataSource) {
        this.walletRepository = walletRepository;
        this.signatureRepository = signatureRepository;
        this.dataSource = dataSource;
    }
    async initiateRecovery(initiateRecoveryDto, initiatorId) {
        const wallet = await this.walletRepository.findOne({
            where: { id: initiateRecoveryDto.walletId },
            relations: ['signatures'],
        });
        if (!wallet) {
            throw new common_1.NotFoundException('Multisig wallet not found');
        }
        if (!wallet.signers.includes(initiatorId)) {
            throw new common_1.BadRequestException('Initiator is not a signer of this wallet');
        }
        if (wallet.status === multisig_wallet_entity_1.WalletStatus.RECOVERY) {
            throw new common_1.ConflictException('Recovery is already in progress for this wallet');
        }
        if (wallet.status === multisig_wallet_entity_1.WalletStatus.TERMINATED) {
            throw new common_1.BadRequestException('Cannot initiate recovery for terminated wallet');
        }
        this.validateRecoveryRequest(wallet, initiateRecoveryDto);
        const recoveryTransactionHash = await this.generateRecoveryTransactionHash(wallet.id);
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + this.RECOVERY_EXPIRY_HOURS);
        await this.dataSource.transaction(async (manager) => {
            wallet.status = multisig_wallet_entity_1.WalletStatus.RECOVERY;
            wallet.recoveryInitiatedAt = new Date();
            wallet.recoveryInitiatedBy = initiatorId;
            if (initiateRecoveryDto.newThreshold) {
                wallet.recoveryThreshold = initiateRecoveryDto.newThreshold;
            }
            await manager.save(wallet);
            const recoverySignature = manager.create(signature_entity_1.Signature, {
                walletId: wallet.id,
                transactionHash: recoveryTransactionHash,
                signerId: initiatorId,
                signature: await this.generateRecoverySignature(initiatorId, recoveryTransactionHash),
                status: signature_entity_1.SignatureStatus.COLLECTED,
                transactionType: signature_entity_1.TransactionType.EMERGENCY_RECOVERY,
                transactionData: {
                    recoveryType: 'initiation',
                    reason: initiateRecoveryDto.reason,
                    newSigners: initiateRecoveryDto.newSigners,
                    newThreshold: initiateRecoveryDto.newThreshold,
                },
                expiresAt,
                signedAt: new Date(),
                auditData: {
                    ipAddress: '127.0.0.1',
                    userAgent: 'recovery-service',
                    deviceId: 'system',
                    location: 'system',
                },
            });
            await manager.save(recoverySignature);
        });
        const recoveryRequest = await this.buildRecoveryRequest(wallet, recoveryTransactionHash);
        await this.notifySignersOfRecoveryInitiation(wallet, recoveryRequest);
        await this.auditRecoveryInitiation(wallet, recoveryRequest, initiatorId);
        this.logger.log(`Recovery initiated for wallet ${wallet.id} by ${initiatorId}`);
        return recoveryRequest;
    }
    async signRecovery(walletId, transactionHash, signerId) {
        const wallet = await this.walletRepository.findOne({
            where: { id: walletId },
        });
        if (!wallet || wallet.status !== multisig_wallet_entity_1.WalletStatus.RECOVERY) {
            throw new common_1.BadRequestException('Wallet is not in recovery mode');
        }
        if (!wallet.signers.includes(signerId)) {
            throw new common_1.BadRequestException('Signer is not authorized for this wallet');
        }
        const existingSignature = await this.signatureRepository.findOne({
            where: {
                transactionHash,
                signerId,
                status: signature_entity_1.SignatureStatus.COLLECTED,
            },
        });
        if (existingSignature) {
            throw new common_1.ConflictException('Recovery signature already exists');
        }
        const recoverySignatures = await this.signatureRepository.find({
            where: {
                walletId,
                transactionHash,
                transactionType: signature_entity_1.TransactionType.EMERGENCY_RECOVERY,
                status: signature_entity_1.SignatureStatus.COLLECTED,
            },
        });
        const requiredSignatures = Math.ceil(wallet.signers.length * this.SUPER_MAJORITY_THRESHOLD);
        if (recoverySignatures.length >= requiredSignatures) {
            throw new common_1.BadRequestException('Sufficient recovery signatures already collected');
        }
        const signature = this.signatureRepository.create({
            walletId,
            transactionHash,
            signerId,
            signature: await this.generateRecoverySignature(signerId, transactionHash),
            status: signature_entity_1.SignatureStatus.COLLECTED,
            transactionType: signature_entity_1.TransactionType.EMERGENCY_RECOVERY,
            transactionData: {
                recoveryType: 'approval',
                walletId,
            },
            expiresAt: new Date(wallet.recoveryInitiatedAt.getTime() + (this.RECOVERY_EXPIRY_HOURS * 60 * 60 * 1000)),
            signedAt: new Date(),
        });
        const savedSignature = await this.signatureRepository.save(signature);
        if (recoverySignatures.length + 1 >= requiredSignatures) {
            await this.executeRecovery(wallet, transactionHash);
        }
        else {
            await this.notifyRecoveryProgress(wallet, transactionHash, recoverySignatures.length + 1, requiredSignatures);
        }
        await this.auditRecoverySignature(wallet, savedSignature);
        this.logger.log(`Recovery signature added for wallet ${walletId} by ${signerId}`);
        return savedSignature;
    }
    async getRecoveryStatus(walletId) {
        const wallet = await this.walletRepository.findOne({
            where: { id: walletId },
        });
        if (!wallet) {
            throw new common_1.NotFoundException('Multisig wallet not found');
        }
        if (wallet.status !== multisig_wallet_entity_1.WalletStatus.RECOVERY) {
            throw new common_1.BadRequestException('Wallet is not in recovery mode');
        }
        const recoverySignatures = await this.signatureRepository.find({
            where: {
                walletId,
                transactionType: signature_entity_1.TransactionType.EMERGENCY_RECOVERY,
                status: signature_entity_1.SignatureStatus.COLLECTED,
            },
            order: { signedAt: 'ASC' },
        });
        return await this.buildRecoveryRequest(wallet, recoverySignatures[0]?.transactionHash);
    }
    async cancelRecovery(walletId, cancellerId, reason) {
        const wallet = await this.walletRepository.findOne({
            where: { id: walletId },
        });
        if (!wallet) {
            throw new common_1.NotFoundException('Multisig wallet not found');
        }
        if (wallet.status !== multisig_wallet_entity_1.WalletStatus.RECOVERY) {
            throw new common_1.BadRequestException('Wallet is not in recovery mode');
        }
        if (!wallet.signers.includes(cancellerId)) {
            throw new common_1.BadRequestException('Canceller is not authorized for this wallet');
        }
        await this.dataSource.transaction(async (manager) => {
            wallet.status = multisig_wallet_entity_1.WalletStatus.ACTIVE;
            wallet.recoveryInitiatedAt = null;
            wallet.recoveryInitiatedBy = null;
            await manager.save(wallet);
            await manager.update(signature_entity_1.Signature, {
                walletId,
                transactionType: signature_entity_1.TransactionType.EMERGENCY_RECOVERY,
                status: signature_entity_1.SignatureStatus.PENDING,
            }, {
                status: signature_entity_1.SignatureStatus.REVOKED,
                revokedAt: new Date(),
                revocationReason: `Recovery cancelled: ${reason}`,
            });
        });
        await this.notifyRecoveryCancellation(wallet, reason);
        await this.auditRecoveryCancellation(wallet, cancellerId, reason);
        this.logger.log(`Recovery cancelled for wallet ${walletId} by ${cancellerId}`);
    }
    async cleanupExpiredRecoveries() {
        const expiredRecoveryWallets = await this.walletRepository.find({
            where: {
                status: multisig_wallet_entity_1.WalletStatus.RECOVERY,
                recoveryInitiatedAt: new Date(Date.now() - (this.RECOVERY_EXPIRY_HOURS * 60 * 60 * 1000)),
            },
        });
        for (const wallet of expiredRecoveryWallets) {
            await this.expireRecovery(wallet);
        }
        if (expiredRecoveryWallets.length > 0) {
            this.logger.log(`Cleaned up ${expiredRecoveryWallets.length} expired recovery processes`);
        }
    }
    async executeRecovery(wallet, transactionHash) {
        try {
            const recoverySignatures = await this.signatureRepository.find({
                where: {
                    walletId: wallet.id,
                    transactionHash,
                    transactionType: signature_entity_1.TransactionType.EMERGENCY_RECOVERY,
                    status: signature_entity_1.SignatureStatus.COLLECTED,
                },
            });
            const initiationSignature = recoverySignatures.find(s => s.transactionData?.recoveryType === 'initiation');
            const newSigners = initiationSignature?.transactionData?.newSigners || wallet.signers;
            const newThreshold = initiationSignature?.transactionData?.newThreshold || wallet.threshold;
            await this.updateMultisigAccount(wallet.address, newSigners, newThreshold, recoverySignatures.map(s => s.signature));
            await this.dataSource.transaction(async (manager) => {
                wallet.signers = newSigners;
                wallet.threshold = newThreshold;
                wallet.status = multisig_wallet_entity_1.WalletStatus.ACTIVE;
                wallet.recoveryInitiatedAt = null;
                wallet.recoveryInitiatedBy = null;
                await manager.save(wallet);
                await manager.update(signature_entity_1.Signature, {
                    walletId: wallet.id,
                    transactionHash,
                }, {
                    status: signature_entity_1.SignatureStatus.EXECUTED,
                    executedAt: new Date(),
                });
            });
            await this.notifyRecoveryCompletion(wallet, newSigners, newThreshold);
            await this.auditRecoveryCompletion(wallet, recoverySignatures);
            this.logger.log(`Recovery completed for wallet ${wallet.id}`);
        }
        catch (error) {
            this.logger.error(`Failed to execute recovery for wallet ${wallet.id}:`, error);
            throw new common_1.BadRequestException('Recovery execution failed');
        }
    }
    async expireRecovery(wallet) {
        await this.dataSource.transaction(async (manager) => {
            wallet.status = multisig_wallet_entity_1.WalletStatus.ACTIVE;
            wallet.recoveryInitiatedAt = null;
            wallet.recoveryInitiatedBy = null;
            await manager.save(wallet);
            await manager.update(signature_entity_1.Signature, {
                walletId: wallet.id,
                transactionType: signature_entity_1.TransactionType.EMERGENCY_RECOVERY,
                status: signature_entity_1.SignatureStatus.PENDING,
            }, {
                status: signature_entity_1.SignatureStatus.EXPIRED,
            });
        });
        await this.notifyRecoveryExpiry(wallet);
        await this.auditRecoveryExpiry(wallet);
        this.logger.log(`Recovery expired for wallet ${wallet.id}`);
    }
    async buildRecoveryRequest(wallet, transactionHash) {
        const recoverySignatures = await this.signatureRepository.find({
            where: {
                walletId: wallet.id,
                transactionType: signature_entity_1.TransactionType.EMERGENCY_RECOVERY,
                ...(transactionHash && { transactionHash }),
            },
            order: { signedAt: 'ASC' },
        });
        const initiationSignature = recoverySignatures.find(s => s.transactionData?.recoveryType === 'initiation');
        const requiredSignatures = Math.ceil(wallet.signers.length * this.SUPER_MAJORITY_THRESHOLD);
        const isApproved = recoverySignatures.length >= requiredSignatures;
        let status = 'pending';
        if (wallet.status === multisig_wallet_entity_1.WalletStatus.ACTIVE && recoverySignatures.length > 0) {
            status = 'completed';
        }
        else if (isApproved) {
            status = 'approved';
        }
        else if (initiationSignature?.isExpired) {
            status = 'expired';
        }
        return {
            walletId: wallet.id,
            initiatedBy: wallet.recoveryInitiatedBy || '',
            reason: initiationSignature?.transactionData?.reason || '',
            newThreshold: initiationSignature?.transactionData?.newThreshold,
            newSigners: initiationSignature?.transactionData?.newSigners,
            recoverySignatures,
            initiatedAt: wallet.recoveryInitiatedAt || new Date(),
            expiresAt: wallet.recoveryInitiatedAt ?
                new Date(wallet.recoveryInitiatedAt.getTime() + (this.RECOVERY_EXPIRY_HOURS * 60 * 60 * 1000)) :
                new Date(),
            status,
        };
    }
    validateRecoveryRequest(wallet, dto) {
        if (dto.newSigners && (dto.newSigners.length < 2 || dto.newSigners.length > 15)) {
            throw new common_1.BadRequestException('New signers count must be between 2 and 15');
        }
        if (dto.newThreshold && dto.newSigners) {
            if (dto.newThreshold < 2 || dto.newThreshold > dto.newSigners.length) {
                throw new common_1.BadRequestException('New threshold must be between 2 and new signers count');
            }
        }
        if (dto.newSigners) {
            const uniqueSigners = new Set(dto.newSigners);
            if (uniqueSigners.size !== dto.newSigners.length) {
                throw new common_1.BadRequestException('New signers must be unique');
            }
        }
        const superMajorityRequired = Math.ceil(wallet.signers.length * this.SUPER_MAJORITY_THRESHOLD);
        if (wallet.signers.length < superMajorityRequired) {
            throw new common_1.BadRequestException('Insufficient signers for super-majority recovery');
        }
    }
    async generateRecoveryTransactionHash(walletId) {
        return `recovery_${walletId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    async generateRecoverySignature(signerId, transactionHash) {
        return `recovery_sig_${signerId}_${transactionHash}_${Date.now()}`;
    }
    async auditRecoveryExpiry(wallet) {
        console.log(`Recovery expired for wallet ${wallet.id}`);
    }
    async notifySignersOfRecoveryInitiation(wallet, recoveryRequest) {
        console.log(`Notifying signers of recovery initiation for wallet ${wallet.id}`);
    }
    async notifyRecoveryProgress(wallet, transactionHash, collected, required) {
        console.log(`Notifying recovery progress: ${collected}/${required} for wallet ${wallet.id}`);
    }
    async notifyRecoveryCompletion(wallet, newSigners, newThreshold) {
        console.log(`Notifying recovery completion for wallet ${wallet.id}`);
    }
    async notifyRecoveryCancellation(wallet, reason) {
        console.log(`Notifying recovery cancellation for wallet ${wallet.id}: ${reason}`);
    }
    async updateMultisigAccount(walletAddress, newSigners, newThreshold, signatures) {
        console.log(`Updating multisig account ${walletAddress} with ${newSigners.length} signers and threshold ${newThreshold}`);
    }
    async auditRecoveryInitiation(wallet, recoveryRequest, initiatorId) {
        console.log(`Recovery initiated for wallet ${wallet.id} by ${initiatorId}`);
    }
    async auditRecoverySignature(wallet, signature) {
        console.log(`Recovery signature added for wallet ${wallet.id} by ${signature.signerId}`);
    }
    async auditRecoveryCompletion(wallet, signatures) {
        console.log(`Recovery completed for wallet ${wallet.id} with ${signatures.length} signatures`);
    }
    async auditRecoveryCancellation(wallet, cancellerId, reason) {
        console.log(`Recovery cancelled for wallet ${wallet.id} by ${cancellerId}: ${reason}`);
    }
};
exports.RecoveryService = RecoveryService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RecoveryService.prototype, "cleanupExpiredRecoveries", null);
exports.RecoveryService = RecoveryService = RecoveryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(multisig_wallet_entity_1.MultisigWallet)),
    __param(1, (0, typeorm_1.InjectRepository)(signature_entity_1.Signature)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], RecoveryService);
//# sourceMappingURL=recovery.service.js.map