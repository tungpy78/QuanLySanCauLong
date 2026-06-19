import type { CreateCourtInput, UpdateCourtInput } from "../validations/court.validation.js";
export declare class CourtService {
    static getAllCourts(): Promise<any[]>;
    static getAllCourtsByAdmin(): Promise<any[]>;
    static getCourtById(id: number): Promise<any>;
    static getCourtByIdByAdmin(id: number): Promise<any>;
    static createCourt(data: CreateCourtInput): Promise<any>;
    static updateCourt(id: number, data: UpdateCourtInput): Promise<any>;
    static deleteCourt(id: number): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=court.service.d.ts.map