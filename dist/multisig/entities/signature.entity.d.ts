import { MultisigWallet } from './multisig-wallet.entity';
export declare enum SignatureStatus {
    PENDING = "pending",
    COLLECTED = "collected",
    EXPIRED = "expired",
    REVOKED = "revoked",
    EXECUTED = "executed"
}
export declare enum TransactionType {
    TRANSFER = "transfer",
    CONTRACT_CALL = "contract_call",
    DAO_VOTE = "dao_vote",
    ENERGY_TRADE = "energy_trade",
    EMERGENCY_RECOVERY = "emergency_recovery"
}
export declare class Signature {
    id: string;
    walletId: string;
    wallet: MultisigWallet;
    transactionHash: string;
    signerId: string;
    signature: string;
    status: SignatureStatus;
    transactionType: TransactionType;
    transactionData: Record<string, any>;
    amount: string;
    recipient: string;
    expiresAt: Date;
    signedAt: Date;
    revokedAt: Date;
    executedAt: Date;
    executionTxHash: string;
    auditData: {
        ipAddress?: string;
        userAgent?: string;
        deviceId?: string;
        location?: string;
    };
    revocationReason: string;
    createdAt: Date;
    processedAt: Date;
    get isExpired(): boolean;
    get isValid(): boolean;
    get canRevoke(): boolean;
    get timeToExpiry(): number;
}
