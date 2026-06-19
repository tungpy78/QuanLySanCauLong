import type { CreateFacilityInput, updateFacilityInput } from "../validations/facility.validation.js";
export declare class FacilityService {
    static getAllFacilities(): Promise<any[]>;
    static getAllFacilitiesForAdmin(): Promise<any[]>;
    static getFacilityById(id: number): Promise<any>;
    static getFacilityByIdForAdmin(id: number): Promise<any>;
    static getFacilityWithCourts(id: number): Promise<any>;
    static createFacility(data: CreateFacilityInput): Promise<any>;
    static updateFacility(id: number, data: updateFacilityInput): Promise<any>;
    static deleteFacility(id: number): Promise<{
        message: string;
    }>;
    static restoreFacility(id: number): Promise<{
        message: string;
    }>;
    static getDeletedFacilities(): Promise<any[]>;
}
//# sourceMappingURL=facility.service.d.ts.map