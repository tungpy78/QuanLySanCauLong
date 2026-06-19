import { BaseRepository } from './base.repository.js';
declare class SystemConfigRepository extends BaseRepository<any> {
    constructor();
    findByKey(key: string): Promise<import("../models/system_config.model.js").default | {
        value: string;
    } | null>;
    updateValue(key: string, newValue: string): Promise<boolean>;
}
export declare const systemConfigRepository: SystemConfigRepository;
export {};
//# sourceMappingURL=systemConfig.repository.d.ts.map