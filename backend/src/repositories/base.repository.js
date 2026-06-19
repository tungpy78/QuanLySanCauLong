export class BaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async findAll(options) {
        return await this.model.findAll(options);
    }
    async findById(id, options) {
        return await this.model.findByPk(id, options);
    }
    async findOne(options) {
        return await this.model.findOne(options);
    }
    async create(data, options) {
        return await this.model.create(data, options);
    }
    async update(id, data) {
        const record = await this.findById(id);
        if (!record)
            return null;
        return await record.update(data);
    }
    async destroy(id) {
        const record = await this.findById(id);
        if (!record)
            return false;
        await record.destroy();
        return true;
    }
    async restore(id) {
        const record = await this.model.findOne({
            where: { id },
            paranoid: false
        });
        if (!record)
            return false;
        await record.restore();
        return true;
    }
}
//# sourceMappingURL=base.repository.js.map