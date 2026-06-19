import { BaseRepository } from "./base.repository.js";
declare class FacilityRepository extends BaseRepository<any> {
    constructor();
    findByNameExcludingId(name: string, excludeId?: number): Promise<any>;
    getTrash(): Promise<any[]>;
}
export declare const facilityRepository: FacilityRepository;
export {};
//# sourceMappingURL=facility.repository.d.ts.map