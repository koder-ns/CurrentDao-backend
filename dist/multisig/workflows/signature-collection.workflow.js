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
var SignatureCollectionWorkflow_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignatureCollectionWorkflow = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const multisig_wallet_entity_1 = require("../entities/multisig-wallet.entity");
const signature_entity_1 = require("../entities/signature.entity");
let SignatureCollectionWorkflow = SignatureCollectionWorkflow_1 = class SignatureCollectionWorkflow {
    signatureRepository;
    logger = new common_1.Logger(SignatureCollectionWorkflow_1.name);
    constructor(signatureRepository) {
        this.signatureRepository = signatureRepository;
    }
    async processSignature(wallet, signature) {
        const startTime = Date.now();
        try {
            await this.validateSignature(wallet, signature);
            signature.status = signature_entity_1.SignatureStatus.COLLECTED;
            await this.signatureRepository.save(signature);
            const allSignatures = await this.getSignaturesForTransaction(signature.transactionHash);
            const collectedSignatures = allSignatures.filter(s => s.status === signature_entity_1.SignatureStatus.COLLECTED);
            await this.auditLog({
                eventType: 'signature_collected',
                walletId: wallet.id,
                transactionHash: signature.transactionHash,
                signerId: signature.signerId,
                signatureCount: collectedSignatures.length,
                requiredSignatures: wallet.requiredSignatures,
                timestamp: new Date(),
            });
            await this.notifySigners(wallet, signature, collectedSignatures);
            if (wallet.canExecute(collectedSignatures.length)) {
                await this.handleThresholdReached(wallet, signature.transactionHash, collectedSignatures);
            }
            const processingTime = Date.now() - startTime;
            this.logger.log(`Signature processed in ${processingTime}ms for transaction ${signature.transactionHash}`);
        }
        catch (error) {
            this.logger.error(`Failed to process signature for transaction ${signature.transactionHash}:`, error);
            throw error;
        }
    }
    async processRevocation(wallet, signature) {
        try {
            const allSignatures = await this.getSignaturesForTransaction(signature.transactionHash);
            const activeSignatures = allSignatures.filter(s => s.status === signature_entity_1.SignatureStatus.COLLECTED);
            await this.auditLog({
                eventType: 'signature_revoked',
                walletId: wallet.id,
                transactionHash: signature.transactionHash,
                signerId: signature.signerId,
                revocationReason: signature.revocationReason,
                remainingSignatures: activeSignatures.length,
                requiredSignatures: wallet.requiredSignatures,
                timestamp: new Date(),
            });
            await this.notifySignersOfRevocation(wallet, signature, activeSignatures);
            this.logger.log(`Signature revoked for transaction ${signature.transactionHash} by signer ${signature.signerId}`);
        }
        catch (error) {
            this.logger.error(`Failed to process signature revocation for transaction ${signature.transactionHash}:`, error);
            throw error;
        }
    }
    async processExpiry(wallet, signature) {
        try {
            const allSignatures = await this.getSignaturesForTransaction(signature.transactionHash);
            const activeSignatures = allSignatures.filter(s => s.status === signature_entity_1.SignatureStatus.COLLECTED);
            await this.auditLog({
                eventType: 'signature_expired',
                walletId: wallet.id,
                transactionHash: signature.transactionHash,
                signerId: signature.signerId,
                expiredAt: signature.expiresAt,
                remainingSignatures: activeSignatures.length,
                requiredSignatures: wallet.requiredSignatures,
                timestamp: new Date(),
            });
            await this.notifySignersOfExpiry(wallet, signature, activeSignatures);
            this.logger.log(`Signature expired for transaction ${signature.transactionHash} from signer ${signature.signerId}`);
        }
        catch (error) {
            this.logger.error(`Failed to process signature expiry for transaction ${signature.transactionHash}:`, error);
            throw error;
        }
    }
    async getSignaturesForTransaction(transactionHash) {
        return this.signatureRepository.find({
            where: { transactionHash },
            order: { createdAt: 'ASC' },
        });
    }
    async getTransactionProgress(transactionHash) {
        const signatures = await this.getSignaturesForTransaction(transactionHash);
        if (signatures.length === 0) {
            throw new Error('No signatures found for transaction');
        }
        const wallet = signatures[0].wallet || (await this.signatureRepository.findOne({
            where: { transactionHash },
            relations: ['wallet']
        })).wallet;
        const collected = signatures.filter(s => s.status === signature_entity_1.SignatureStatus.COLLECTED).length;
        const pending = signatures.filter(s => s.status === signature_entity_1.SignatureStatus.PENDING && !s.isExpired).length;
        const expired = signatures.filter(s => s.status === signature_entity_1.SignatureStatus.EXPIRED || s.isExpired).length;
        const revoked = signatures.filter(s => s.status === signature_entity_1.SignatureStatus.REVOKED).length;
        const timeToExpiry = Math.max(...signatures.map(s => s.timeToExpiry));
        return {
            totalSigners: wallet.signers.length,
            requiredSignatures: wallet.requiredSignatures,
            collectedSignatures: collected,
            pendingSignatures: pending,
            expiredSignatures: expired,
            revokedSignatures: revoked,
            isReady: wallet.canExecute(collected),
            timeToExpiry,
        };
    }
    async validateSignature(wallet, signature) {
        if (wallet.status === multisig_wallet_entity_1.WalletStatus.LOCKED || wallet.status === multisig_wallet_entity_1.WalletStatus.TERMINATED) {
            throw new Error('Wallet is not available for transactions');
        }
        if (signature.isExpired) {
            throw new Error('Signature has expired');
        }
        const existingSignature = await this.signatureRepository.findOne({
            where: {
                transactionHash: signature.transactionHash,
                signerId: signature.signerId,
                status: [signature_entity_1.SignatureStatus.COLLECTED, signature_entity_1.SignatureStatus.EXECUTED],
            },
        });
        if (existingSignature) {
            throw new Error('Duplicate signature detected');
        }
    }
    async handleThresholdReached(wallet, transactionHash, signatures) {
        try {
            await this.auditLog({
                eventType: 'threshold_reached',
                walletId: wallet.id,
                transactionHash,
                signerIds: signatures.map(s => s.signerId),
                signatureCount: signatures.length,
                requiredSignatures: wallet.requiredSignatures,
                timestamp: new Date(),
            });
            await this.notifyThresholdReached(wallet, transactionHash, signatures);
            this.logger.log(`Threshold reached for transaction ${transactionHash} with ${signatures.length} signatures`);
        }
        catch (error) {
            this.logger.error(`Failed to handle threshold reached for transaction ${transactionHash}:`, error);
        }
    }
    async notifySigners(wallet, signature, collectedSignatures) {
        const notificationData = {
            type: 'signature_collected',
            walletId: wallet.id,
            walletName: wallet.name,
            transactionHash: signature.transactionHash,
            signerId: signature.signerId,
            collectedCount: collectedSignatures.length,
            requiredCount: wallet.requiredSignatures,
            isReady: wallet.canExecute(collectedSignatures.length),
            expiresAt: signature.expiresAt,
        };
        await this.sendNotificationsToSigners(wallet.signers, notificationData);
    }
    async notifySignersOfRevocation(wallet, signature, activeSignatures) {
        const notificationData = {
            type: 'signature_revoked',
            walletId: wallet.id,
            walletName: wallet.name,
            transactionHash: signature.transactionHash,
            signerId: signature.signerId,
            revocationReason: signature.revocationReason,
            remainingSignatures: activeSignatures.length,
            requiredSignatures: wallet.requiredSignatures,
        };
        await this.sendNotificationsToSigners(wallet.signers, notificationData);
    }
    async notifySignersOfExpiry(wallet, signature, activeSignatures) {
        const notificationData = {
            type: 'signature_expired',
            walletId: wallet.id,
            walletName: wallet.name,
            transactionHash: signature.transactionHash,
            signerId: signature.signerId,
            expiredAt: signature.expiresAt,
            remainingSignatures: activeSignatures.length,
            requiredSignatures: wallet.requiredSignatures,
        };
        await this.sendNotificationsToSigners(wallet.signers, notificationData);
    }
    async notifyThresholdReached(wallet, transactionHash, signatures) {
        const notificationData = {
            type: 'threshold_reached',
            walletId: wallet.id,
            walletName: wallet.name,
            transactionHash,
            signerIds: signatures.map(s => s.signerId),
            signatureCount: signatures.length,
            requiredSignatures: wallet.requiredSignatures,
            canExecute: true,
        };
        await this.sendNotificationsToSigners(wallet.signers, notificationData);
    }
    async sendNotificationsToSigners(signers, data) {
        console.log('Sending notifications to signers:', data);
    }
    async auditLog(data) {
        console.log('Audit log:', data);
    }
};
exports.SignatureCollectionWorkflow = SignatureCollectionWorkflow;
exports.SignatureCollectionWorkflow = SignatureCollectionWorkflow = SignatureCollectionWorkflow_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(signature_entity_1.Signature)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SignatureCollectionWorkflow);
//# sourceMappingURL=signature-collection.workflow.js.map