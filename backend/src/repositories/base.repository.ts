import type { Attributes, CreateOptions, CreationAttributes, FindOptions, Model, ModelStatic } from "sequelize";

export class BaseRepository<M extends Model> {
    constructor(protected model: ModelStatic<M>) {}

    async findAll(options?: FindOptions): Promise<M[]> {
        return await this.model.findAll(options);
    }

    async findById(id: number, options?: Omit<FindOptions, 'where'>): Promise<M | null> {
        return await this.model.findByPk(id, options);
    }

    async findOne(options?: FindOptions): Promise<M | null> {
        return await this.model.findOne(options);
    }

    async create(data: CreationAttributes<M>, options?: CreateOptions): Promise<M> {
        return await this.model.create(data, options);
    }

    async update(id: number, data: Partial<Attributes<M>>): Promise<M | null> {
        const record = await this.findById(id);
        if(!record) return null;
        return await record.update(data);
    }

    async destroy(id: number): Promise<boolean> {
        const record = await this.findById(id);
        if(!record) return false;
        await record.destroy();
        return true;
    }

    async restore(id: number): Promise<boolean> {
        const record = await this.model.findOne({
            where: {id} as any,
            paranoid: false
        })
        if(!record) return false;
        await record.restore();
        return true;
    }

}