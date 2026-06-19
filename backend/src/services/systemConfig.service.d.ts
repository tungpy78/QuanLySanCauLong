import type { CreateSystemConfigInput, UpdateSystemConfigInput } from '../validations/systemConfig.validation.js';
export declare class SystemConfigService {
    static getAllConfigs(): Promise<any[]>;
    static createConfig(data: CreateSystemConfigInput): Promise<any>;
    static updateConfigById(id: number, data: UpdateSystemConfigInput): Promise<any>;
    static deleteConfig(id: number): Promise<boolean>;
    static updateConfigByKey(key: string, newValue: string): Promise<boolean>;
}
//# sourceMappingURL=systemConfig.service.d.ts.map