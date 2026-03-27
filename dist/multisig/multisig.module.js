"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultisigModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const multisig_service_1 = require("./multisig.service");
const multisig_wallet_entity_1 = require("./entities/multisig-wallet.entity");
const signature_entity_1 = require("./entities/signature.entity");
const signature_collection_workflow_1 = require("./workflows/signature-collection.workflow");
const recovery_service_1 = require("./recovery/recovery.service");
let MultisigModule = class MultisigModule {
};
exports.MultisigModule = MultisigModule;
exports.MultisigModule = MultisigModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([multisig_wallet_entity_1.MultisigWallet, signature_entity_1.Signature]),
        ],
        providers: [
            multisig_service_1.MultisigService,
            signature_collection_workflow_1.SignatureCollectionWorkflow,
            recovery_service_1.RecoveryService,
        ],
        exports: [
            multisig_service_1.MultisigService,
            signature_collection_workflow_1.SignatureCollectionWorkflow,
            recovery_service_1.RecoveryService,
        ],
        controllers: [],
    })
], MultisigModule);
//# sourceMappingURL=multisig.module.js.map