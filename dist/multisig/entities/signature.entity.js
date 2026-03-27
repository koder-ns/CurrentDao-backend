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
exports.Signature = exports.TransactionType = exports.SignatureStatus = void 0;
const typeorm_1 = require("typeorm");
const multisig_wallet_entity_1 = require("./multisig-wallet.entity");
var SignatureStatus;
(function (SignatureStatus) {
    SignatureStatus["PENDING"] = "pending";
    SignatureStatus["COLLECTED"] = "collected";
    SignatureStatus["EXPIRED"] = "expired";
    SignatureStatus["REVOKED"] = "revoked";
    SignatureStatus["EXECUTED"] = "executed";
})(SignatureStatus || (exports.SignatureStatus = SignatureStatus = {}));
var TransactionType;
(function (TransactionType) {
    TransactionType["TRANSFER"] = "transfer";
    TransactionType["CONTRACT_CALL"] = "contract_call";
    TransactionType["DAO_VOTE"] = "dao_vote";
    TransactionType["ENERGY_TRADE"] = "energy_trade";
    TransactionType["EMERGENCY_RECOVERY"] = "emergency_recovery";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
let Signature = class Signature {
    id;
    walletId;
    wallet;
    transactionHash;
    signerId;
    signature;
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
    get isExpired() {
        return new Date() > this.expiresAt;
    }
    get isValid() {
        return this.status === SignatureStatus.PENDING && !this.isExpired;
    }
    get canRevoke() {
        return this.status === SignatureStatus.PENDING && !this.isExpired;
    }
    get timeToExpiry() {
        return this.expiresAt.getTime() - Date.now();
    }
};
exports.Signature = Signature;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Signature.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Signature.prototype, "walletId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => multisig_wallet_entity_1.MultisigWallet, wallet => wallet.signatures, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'walletId' }),
    __metadata("design:type", multisig_wallet_entity_1.MultisigWallet)
], Signature.prototype, "wallet", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Signature.prototype, "transactionHash", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Signature.prototype, "signerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Signature.prototype, "signature", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SignatureStatus,
        default: SignatureStatus.PENDING
    }),
    __metadata("design:type", String)
], Signature.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TransactionType
    }),
    __metadata("design:type", String)
], Signature.prototype, "transactionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json' }),
    __metadata("design:type", Object)
], Signature.prototype, "transactionData", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 36, scale: 18, nullable: true }),
    __metadata("design:type", String)
], Signature.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Signature.prototype, "recipient", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Signature.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Signature.prototype, "signedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Signature.prototype, "revokedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Signature.prototype, "executedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Signature.prototype, "executionTxHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Signature.prototype, "auditData", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Signature.prototype, "revocationReason", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Signature.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Signature.prototype, "processedAt", void 0);
exports.Signature = Signature = __decorate([
    (0, typeorm_1.Entity)('multisig_signatures'),
    (0, typeorm_1.Index)(['walletId', 'transactionHash']),
    (0, typeorm_1.Index)(['signerId']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['expiresAt'])
], Signature);
//# sourceMappingURL=signature.entity.js.map