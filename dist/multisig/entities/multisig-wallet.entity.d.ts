import { Signature } from './signature.entity';
export declare enum WalletStatus {
    ACTIVE = "active",
    LOCKED = "locked",
    RECOVERY = "recovery",
    TERMINATED = "terminated"
}
export declare class MultisigWallet {
    id: string;
    address: string;
    name: string;
    description: string;
    creatorId: string;
    signers: string[];
    threshold: number;
    status: WalletStatus;
    nonce: number;
    metadata: Record<string, any>;
    recoveryThreshold: number;
    recoveryInitiatedAt: Date;
    recoveryInitiatedBy: string;
    createdAt: Date;
    updatedAt: Date;
    signatures: Signature[];
    lastTransactionAt: Date;
    transactionCount: number;
    get isRecoveryMode(): boolean;
    get requiredSignatures(): number;
    canExecute(signaturesCollected: number): boolean;
}
