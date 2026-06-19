import type { Attributes, CreateOptions, CreationAttributes, FindOptions, Model, ModelStatic } from "sequelize";
export declare class BaseRepository<M extends Model> {
    protected model: ModelStatic<M>;
    constructor(model: ModelStatic<M>);
    findAll(options?: FindOptions): Promise<M[]>;
    findById(id: number, options?: Omit<FindOptions, 'where'>): Promise<M | null>;
    findOne(options?: FindOptions): Promise<M | null>;
    create(data: CreationAttributes<M>, options?: CreateOptions): Promise<M>;
    update(id: number, data: Partial<Attributes<M>>): Promise<M | null>;
    destroy(id: number): Promise<boolean>;
    restore(id: number): Promise<boolean>;
}
//# sourceMappingURL=base.repository.d.ts.map