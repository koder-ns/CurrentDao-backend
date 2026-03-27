import { WalletStatus } from '../entities/multisig-wallet.entity';
import { TransactionType, SignatureStatus } from '../entities/signature.entity';
export declare class CreateMultisigWalletDto {
    name: string;
    description: string;
    signers: string[];
    threshold: number;
    recoveryThreshold?: number;
    metadata?: Record<string, any>;
}
export declare class SignTransactionDto {
    transactionHash: string;
    signature: string;
    transactionType: TransactionType;
    transactionData: Record<string, any>;
    amount?: string;
    recipient?: string;
    auditData?: {
        ipAddress?: string;
        userAgent?: string;
        deviceId?: string;
        location?: string;
    };
}
export declare class RevokeSignatureDto {
    transactionHash: string;
    reason: string;
}
export declare class InitiateRecoveryDto {
    walletId: string;
    reason: string;
    newThreshold?: number;
    newSigners?: string[];
}
export declare class ExecuteTransactionDto {
    transactionHash: string;
    executionData?: Record<string, any>;
}
export declare class UpdateWalletDto {
    name?: string;
    description?: string;
    signers?: string[];
    threshold?: string;
    status?: WalletStatus;
    metadata?: Record<string, any>;
}
export declare class MultisigWalletResponseDto {
    id: string;
    address: string;
    name: string;
    description: string;
    creatorId: string;
    signers: string[];
    threshold: number;
    status: WalletStatus;
    nonce: number;
    metadata?: Record<string, any>;
    recoveryThreshold?: number;
    recoveryInitiatedAt?: Date;
    recoveryInitiatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    lastTransactionAt?: Date;
    transactionCount: number;
    isRecoveryMode: boolean;
    requiredSignatures: number;
}
export declare class SignatureResponseDto {
    id: string;
    walletId: string;
    transactionHash: string;
    signerId: string;
    status: SignatureStatus;
    transactionType: TransactionType;
    transactionData: Record<string, any>;
    amount?: string;
    recipient?: string;
    expiresAt: Date;
    signedAt?: Date;
    revokedAt?: Date;
    executedAt?: Date;
    executionTxHash?: string;
    auditData?: {
        ipAddress?: string;
        userAgent?: string;
        deviceId?: string;
        location?: string;
    };
    revocationReason?: string;
    createdAt: Date;
    processedAt?: Date;
    isExpired: boolean;
    isValid: boolean;
    canRevoke: boolean;
    timeToExpiry: number;
}
export declare class TransactionStatusDto {
    transactionHash: string;
    walletId: string;
    totalSigners: number;
    requiredSignatures: number;
    collectedSignatures: number;
    signatures: SignatureResponseDto[];
    status: 'pending' | 'ready' | 'executed' | 'expired' | 'failed';
    canExecute: boolean;
    timeToExpiry: number;
}
export declare class RecoveryStatusDto {
    walletId: string;
    status: WalletStatus;
    recoveryProgress: number;
    requiredRecoverySignatures: number;
    collectedRecoverySignatures: number;
    recoveryInitiatedBy: string;
    recoveryInitiatedAt: Date;
    completedAt?: Date;
    recoverySignatures?: SignatureResponseDto[];
}
export declare class MultisigQueryDto {
    walletId?: string;
    status?: WalletStatus;
    signerId?: string;
    transactionType?: TransactionType;
    signatureStatus?: SignatureStatus;
    fromDate?: string;
    toDate?: string;
    limit?: number;
    offset?: number;
}
