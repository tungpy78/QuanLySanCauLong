import type { CreatePriceConfigInput, UpdatePriceConfigInput } from "../validations/priceConfig.validation.js";
export declare class PriceConfigService {
    static getAllConfigs(facilityId?: number): Promise<any[]>;
    private static checkTimeOverlap;
    static createConfig(data: CreatePriceConfigInput): Promise<any>;
    static updateConfig(id: number, data: UpdatePriceConfigInput): Promise<any>;
    static deleteConfig(id: number): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=priceConfig.service.d.ts.map