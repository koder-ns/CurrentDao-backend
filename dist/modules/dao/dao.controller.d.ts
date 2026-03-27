import { DaoService } from './dao.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
export declare class DaoController {
    private readonly daoService;
    constructor(daoService: DaoService);
    findAll(): Promise<import("./entities/proposal.entity").Proposal[]>;
    findOne(id: string): Promise<import("./entities/proposal.entity").Proposal | null>;
    create(createProposalDto: CreateProposalDto): Promise<import("./entities/proposal.entity").Proposal>;
    vote(id: string, voteDto: {
        userId: string;
        support: boolean;
    }): Promise<import("./entities/proposal.entity").Proposal | null>;
    finalize(id: string): Promise<import("./entities/proposal.entity").Proposal | null>;
    getActiveProposals(): Promise<import("./entities/proposal.entity").Proposal[]>;
}
