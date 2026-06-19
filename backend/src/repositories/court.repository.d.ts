import { BaseRepository } from './base.repository.js';
declare class CourtRepository extends BaseRepository<any> {
    constructor();
    findAllWithFacility(whereCondition?: any, orderCondition?: any): Promise<any[]>;
    findByIdWithFacility(id: number, whereCondition?: any): Promise<any>;
    findDuplicateNameInFacility(name: string, facilityId: number, excludeId?: number): Promise<any>;
}
export declare const courtRepository: CourtRepository;
export {};
//# sourceMappingURL=court.repository.d.ts.map