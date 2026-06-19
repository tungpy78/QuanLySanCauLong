import { BaseRepository } from './base.repository.js';
declare class PriceConfigRepository extends BaseRepository<any> {
    constructor();
    findAllWithFacility(facilityId?: number): Promise<any[]>;
    findOverlap(facilityId: number, courtType: string, startTime: string, endTime: string, excludeId?: number): Promise<any>;
}
export declare const priceConfigRepository: PriceConfigRepository;
export {};
//# sourceMappingURL=priceConfig.repository.d.ts.map