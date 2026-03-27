import { Repository } from 'typeorm';
import { MultisigWallet } from '../entities/multisig-wallet.entity';
import { Signature } from '../entities/signature.entity';
export interface SignatureWorkflowEvent {
    type: 'signature_collected' | 'signature_revoked' | 'signature_expired' | 'threshold_reached';
    wallet: MultisigWallet;
    signature?: Signature;
    signatures?: Signature[];
    timestamp: Date;
}
export declare class SignatureCollectionWorkflow {
    private readonly signatureRepository;
    private readonly logger;
    constructor(signatureRepository: Repository<Signature>);
    processSignature(wallet: MultisigWallet, signature: Signature): Promise<void>;
    processRevocation(wallet: MultisigWallet, signature: Signature): Promise<void>;
    processExpiry(wallet: MultisigWallet, signature: Signature): Promise<void>;
    getSignaturesForTransaction(transactionHash: string): Promise<Signature[]>;
    getTransactionProgress(transactionHash: string): Promise<{
        totalSigners: number;
        requiredSignatures: number;
        collectedSignatures: number;
        pendingSignatures: number;
        expiredSignatures: number;
        revokedSignatures: number;
        isReady: boolean;
        timeToExpiry: number;
    }>;
    private validateSignature;
    private handleThresholdReached;
    private notifySigners;
    private notifySignersOfRevocation;
    private notifySignersOfExpiry;
    private notifyThresholdReached;
    private sendNotificationsToSigners;
    private auditLog;
}
