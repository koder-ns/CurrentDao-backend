import { Repository, DataSource } from 'typeorm';
import { MultisigWallet } from '../entities/multisig-wallet.entity';
import { Signature } from '../entities/signature.entity';
import { InitiateRecoveryDto } from '../dto/multisig.dto';
export interface RecoveryRequest {
    walletId: string;
    initiatedBy: string;
    reason: string;
    newThreshold?: number;
    newSigners?: string[];
    recoverySignatures: Signature[];
    initiatedAt: Date;
    expiresAt: Date;
    status: 'pending' | 'approved' | 'rejected' | 'expired' | 'completed';
}
export declare class RecoveryService {
    private readonly walletRepository;
    private readonly signatureRepository;
    private readonly dataSource;
    private readonly logger;
    private readonly RECOVERY_EXPIRY_HOURS;
    private readonly SUPER_MAJORITY_THRESHOLD;
    constructor(walletRepository: Repository<MultisigWallet>, signatureRepository: Repository<Signature>, dataSource: DataSource);
    initiateRecovery(initiateRecoveryDto: InitiateRecoveryDto, initiatorId: string): Promise<RecoveryRequest>;
    signRecovery(walletId: string, transactionHash: string, signerId: string): Promise<Signature>;
    getRecoveryStatus(walletId: string): Promise<RecoveryRequest>;
    cancelRecovery(walletId: string, cancellerId: string, reason: string): Promise<void>;
    cleanupExpiredRecoveries(): Promise<void>;
    private executeRecovery;
    private expireRecovery;
    private buildRecoveryRequest;
    private validateRecoveryRequest;
    private generateRecoveryTransactionHash;
    private generateRecoverySignature;
    private auditRecoveryExpiry;
    private notifySignersOfRecoveryInitiation;
    private notifyRecoveryProgress;
    private notifyRecoveryCompletion;
    private notifyRecoveryCancellation;
    private updateMultisigAccount;
    private auditRecoveryInitiation;
    private auditRecoverySignature;
    private auditRecoveryCompletion;
    private auditRecoveryCancellation;
}
