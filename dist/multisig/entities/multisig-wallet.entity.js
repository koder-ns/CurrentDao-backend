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
exports.MultisigWallet = exports.WalletStatus = void 0;
const typeorm_1 = require("typeorm");
const signature_entity_1 = require("./signature.entity");
var WalletStatus;
(function (WalletStatus) {
    WalletStatus["ACTIVE"] = "active";
    WalletStatus["LOCKED"] = "locked";
    WalletStatus["RECOVERY"] = "recovery";
    WalletStatus["TERMINATED"] = "terminated";
})(WalletStatus || (exports.WalletStatus = WalletStatus = {}));
let MultisigWallet = class MultisigWallet {
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
    signatures;
    lastTransactionAt;
    transactionCount;
    get isRecoveryMode() {
        return this.status === WalletStatus.RECOVERY;
    }
    get requiredSignatures() {
        return this.isRecoveryMode && this.recoveryThreshold
            ? this.recoveryThreshold
            : this.threshold;
    }
    canExecute(signaturesCollected) {
        return signaturesCollected >= this.requiredSignatures;
    }
};
exports.MultisigWallet = MultisigWallet;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MultisigWallet.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], MultisigWallet.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MultisigWallet.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MultisigWallet.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MultisigWallet.prototype, "creatorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json' }),
    __metadata("design:type", Array)
], MultisigWallet.prototype, "signers", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MultisigWallet.prototype, "threshold", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: WalletStatus,
        default: WalletStatus.ACTIVE
    }),
    __metadata("design:type", String)
], MultisigWallet.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', default: 0 }),
    __metadata("design:type", Number)
], MultisigWallet.prototype, "nonce", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], MultisigWallet.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], MultisigWallet.prototype, "recoveryThreshold", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], MultisigWallet.prototype, "recoveryInitiatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MultisigWallet.prototype, "recoveryInitiatedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MultisigWallet.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], MultisigWallet.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => signature_entity_1.Signature, signature => signature.wallet),
    __metadata("design:type", Array)
], MultisigWallet.prototype, "signatures", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], MultisigWallet.prototype, "lastTransactionAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], MultisigWallet.prototype, "transactionCount", void 0);
exports.MultisigWallet = MultisigWallet = __decorate([
    (0, typeorm_1.Entity)('multisig_wallets'),
    (0, typeorm_1.Index)(['address']),
    (0, typeorm_1.Index)(['creatorId'])
], MultisigWallet);
//# sourceMappingURL=multisig-wallet.entity.js.map