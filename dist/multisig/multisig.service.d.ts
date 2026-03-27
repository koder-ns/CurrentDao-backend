import { Repository, DataSource } from 'typeorm';
import { MultisigWallet } from './entities/multisig-wallet.entity';
import { Signature } from './entities/signature.entity';
import { CreateMultisigWalletDto, SignTransactionDto, RevokeSignatureDto, ExecuteTransactionDto, MultisigQueryDto } from './dto/multisig.dto';
import { SignatureCollectionWorkflow } from './workflows/signature-collection.workflow';
import { RecoveryService } from './recovery/recovery.service';
export declare class MultisigService {
    private readonly walletRepository;
    private readonly signatureRepository;
    private readonly signatureCollectionWorkflow;
    private readonly recoveryService;
    private readonly dataSource;
    private readonly logger;
    private readonly SIGNATURE_EXPIRY_HOURS;
    constructor(walletRepository: Repository<MultisigWallet>, signatureRepository: Repository<Signature>, signatureCollectionWorkflow: SignatureCollectionWorkflow, recoveryService: RecoveryService, dataSource: DataSource);
    createWallet(createWalletDto: CreateMultisigWalletDto, creatorId: string): Promise<MultisigWallet>;
    getWallet(walletId: string): Promise<MultisigWallet>;
    getWalletByAddress(address: string): Promise<MultisigWallet>;
    signTransaction(signTransactionDto: SignTransactionDto, signerId: string): Promise<Signature>;
    revokeSignature(revokeDto: RevokeSignatureDto, signerId: string): Promise<Signature>;
    executeTransaction(executeDto: ExecuteTransactionDto, executorId: string): Promise<Signature>;
    getTransactionStatus(transactionHash: string): Promise<any>;
    queryMultisigData(queryDto: MultisigQueryDto): Promise<{
        wallets: MultisigWallet[];
        signatures: Signature[];
    }>;
    cleanupExpiredSignatures(): Promise<void>;
    private validateWalletCreation;
    private generateMultisigAddress;
    private executeMultisigTransaction;
}
