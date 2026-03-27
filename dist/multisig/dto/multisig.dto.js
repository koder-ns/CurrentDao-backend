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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultisigQueryDto = exports.RecoveryStatusDto = exports.TransactionStatusDto = exports.SignatureResponseDto = exports.MultisigWalletResponseDto = exports.UpdateWalletDto = exports.ExecuteTransactionDto = exports.InitiateRecoveryDto = exports.RevokeSignatureDto = exports.SignTransactionDto = exports.CreateMultisigWalletDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const multisig_wallet_entity_1 = require("../entities/multisig-wallet.entity");
const signature_entity_1 = require("../entities/signature.entity");
class CreateMultisigWalletDto {
    name;
    description;
    signers;
    threshold;
    recoveryThreshold;
    metadata;
}
exports.CreateMultisigWalletDto = CreateMultisigWalletDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 100),
    __metadata("design:type", String)
], CreateMultisigWalletDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(10, 500),
    __metadata("design:type", String)
], CreateMultisigWalletDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateMultisigWalletDto.prototype, "signers", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(2),
    (0, class_validator_1.Max)(15),
    __metadata("design:type", Number)
], CreateMultisigWalletDto.prototype, "threshold", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(2),
    (0, class_validator_1.Max)(15),
    __metadata("design:type", Number)
], CreateMultisigWalletDto.prototype, "recoveryThreshold", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsJSON)(),
    __metadata("design:type", Object)
], CreateMultisigWalletDto.prototype, "metadata", void 0);
class SignTransactionDto {
    transactionHash;
    signature;
    transactionType;
    transactionData;
    amount;
    recipient;
    auditData;
}
exports.SignTransactionDto = SignTransactionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignTransactionDto.prototype, "transactionHash", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignTransactionDto.prototype, "signature", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(signature_entity_1.TransactionType),
    __metadata("design:type", String)
], SignTransactionDto.prototype, "transactionType", void 0);
__decorate([
    (0, class_validator_1.IsJSON)(),
    __metadata("design:type", Object)
], SignTransactionDto.prototype, "transactionData", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", String)
], SignTransactionDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignTransactionDto.prototype, "recipient", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsJSON)(),
    __metadata("design:type", Object)
], SignTransactionDto.prototype, "auditData", void 0);
class RevokeSignatureDto {
    transactionHash;
    reason;
}
exports.RevokeSignatureDto = RevokeSignatureDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RevokeSignatureDto.prototype, "transactionHash", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(5, 200),
    __metadata("design:type", String)
], RevokeSignatureDto.prototype, "reason", void 0);
class InitiateRecoveryDto {
    walletId;
    reason;
    newThreshold;
    newSigners;
}
exports.InitiateRecoveryDto = InitiateRecoveryDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InitiateRecoveryDto.prototype, "walletId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(5, 200),
    __metadata("design:type", String)
], InitiateRecoveryDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(2),
    (0, class_validator_1.Max)(15),
    __metadata("design:type", Number)
], InitiateRecoveryDto.prototype, "newThreshold", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], InitiateRecoveryDto.prototype, "newSigners", void 0);
class ExecuteTransactionDto {
    transactionHash;
    executionData;
}
exports.ExecuteTransactionDto = ExecuteTransactionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExecuteTransactionDto.prototype, "transactionHash", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsJSON)(),
    __metadata("design:type", Object)
], ExecuteTransactionDto.prototype, "executionData", void 0);
class UpdateWalletDto {
    name;
    description;
    signers;
    threshold;
    status;
    metadata;
}
exports.UpdateWalletDto = UpdateWalletDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 100),
    __metadata("design:type", String)
], UpdateWalletDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(10, 500),
    __metadata("design:type", String)
], UpdateWalletDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateWalletDto.prototype, "signers", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(2),
    (0, class_validator_1.Max)(15),
    __metadata("design:type", String)
], UpdateWalletDto.prototype, "threshold", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(multisig_wallet_entity_1.WalletStatus),
    __metadata("design:type", String)
], UpdateWalletDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsJSON)(),
    __metadata("design:type", Object)
], UpdateWalletDto.prototype, "metadata", void 0);
class MultisigWalletResponseDto {
    id;
    address;
    name;
    description;
    creatorId;
    signers;
    threshold;
    status;
    nonce;
    metadata;
    recoveryThreshold;
    recoveryInitiatedAt;
    recoveryInitiatedBy;
    createdAt;
    updatedAt;
    lastTransactionAt;
    transactionCount;
    isRecoveryMode;
    requiredSignatures;
}
exports.MultisigWalletResponseDto = MultisigWalletResponseDto;
class SignatureResponseDto {
    id;
    walletId;
    transactionHash;
    signerId;
    status;
    transactionType;
    transactionData;
    amount;
    recipient;
    expiresAt;
    signedAt;
    revokedAt;
    executedAt;
    executionTxHash;
    auditData;
    revocationReason;
    createdAt;
    processedAt;
    isExpired;
    isValid;
    canRevoke;
    timeToExpiry;
}
exports.SignatureResponseDto = SignatureResponseDto;
class TransactionStatusDto {
    transactionHash;
    walletId;
    totalSigners;
    requiredSignatures;
    collectedSignatures;
    signatures;
    status;
    canExecute;
    timeToExpiry;
}
exports.TransactionStatusDto = TransactionStatusDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TransactionStatusDto.prototype, "transactionHash", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TransactionStatusDto.prototype, "walletId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TransactionStatusDto.prototype, "totalSigners", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TransactionStatusDto.prototype, "requiredSignatures", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TransactionStatusDto.prototype, "collectedSignatures", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SignatureResponseDto),
    __metadata("design:type", Array)
], TransactionStatusDto.prototype, "signatures", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TransactionStatusDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Boolean)
], TransactionStatusDto.prototype, "canExecute", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TransactionStatusDto.prototype, "timeToExpiry", void 0);
class RecoveryStatusDto {
    walletId;
    status;
    recoveryProgress;
    requiredRecoverySignatures;
    collectedRecoverySignatures;
    recoveryInitiatedBy;
    recoveryInitiatedAt;
    completedAt;
    recoverySignatures;
}
exports.RecoveryStatusDto = RecoveryStatusDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecoveryStatusDto.prototype, "walletId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(multisig_wallet_entity_1.WalletStatus),
    __metadata("design:type", String)
], RecoveryStatusDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RecoveryStatusDto.prototype, "recoveryProgress", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RecoveryStatusDto.prototype, "requiredRecoverySignatures", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RecoveryStatusDto.prototype, "collectedRecoverySignatures", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecoveryStatusDto.prototype, "recoveryInitiatedBy", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Date)
], RecoveryStatusDto.prototype, "recoveryInitiatedAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Date)
], RecoveryStatusDto.prototype, "completedAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SignatureResponseDto),
    __metadata("design:type", Array)
], RecoveryStatusDto.prototype, "recoverySignatures", void 0);
class MultisigQueryDto {
    walletId;
    status;
    signerId;
    transactionType;
    signatureStatus;
    fromDate;
    toDate;
    limit = 10;
    offset = 0;
}
exports.MultisigQueryDto = MultisigQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MultisigQueryDto.prototype, "walletId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(multisig_wallet_entity_1.WalletStatus),
    __metadata("design:type", String)
], MultisigQueryDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MultisigQueryDto.prototype, "signerId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(signature_entity_1.TransactionType),
    __metadata("design:type", String)
], MultisigQueryDto.prototype, "transactionType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(signature_entity_1.SignatureStatus),
    __metadata("design:type", String)
], MultisigQueryDto.prototype, "signatureStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MultisigQueryDto.prototype, "fromDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MultisigQueryDto.prototype, "toDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], MultisigQueryDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], MultisigQueryDto.prototype, "offset", void 0);
//# sourceMappingURL=multisig.dto.js.map