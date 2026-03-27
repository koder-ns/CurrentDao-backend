export type SorobanNetworkName = 'testnet' | 'mainnet';
export interface SorobanNetworkConfig {
    networkPassphrase: string;
    horizonUrl: string;
    sorobanRpcUrl: string;
    friendbotUrl?: string;
}
declare const _default: (() => {
    defaultNetwork: SorobanNetworkName;
    sourceSecretKey: string | undefined;
    sourcePublicKey: string | undefined;
    metadataCacheTtlMs: number;
    eventPollingIntervalMs: number;
    rpcTimeoutMs: number;
    submissionTimeoutMs: number;
    networks: {
        testnet: SorobanNetworkConfig;
        mainnet: SorobanNetworkConfig;
    };
    contracts: {
        token: {
            testnet: string | undefined;
            mainnet: string | undefined;
        };
        escrow: {
            testnet: string | undefined;
            mainnet: string | undefined;
        };
        governance: {
            testnet: string | undefined;
            mainnet: string | undefined;
        };
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    defaultNetwork: SorobanNetworkName;
    sourceSecretKey: string | undefined;
    sourcePublicKey: string | undefined;
    metadataCacheTtlMs: number;
    eventPollingIntervalMs: number;
    rpcTimeoutMs: number;
    submissionTimeoutMs: number;
    networks: {
        testnet: SorobanNetworkConfig;
        mainnet: SorobanNetworkConfig;
    };
    contracts: {
        token: {
            testnet: string | undefined;
            mainnet: string | undefined;
        };
        escrow: {
            testnet: string | undefined;
            mainnet: string | undefined;
        };
        governance: {
            testnet: string | undefined;
            mainnet: string | undefined;
        };
    };
}>;
export default _default;
