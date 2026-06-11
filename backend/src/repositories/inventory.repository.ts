import { Op } from 'sequelize';
import models from '../models/index.js';
import { BaseRepository } from './base.repository.js';

class InventoryRepository extends BaseRepository<any> {
    constructor() {
        super(models.InventoryLevel as any);
    }

    async findOrCreateInventory(
        variant_id: number,
        facility_id: number,
        transaction?: any
    ) {
        return this.model.findOrCreate({
            where: {
                variant_id,
                facility_id
            },
            defaults: {
                variant_id,
                facility_id,
                quantity_on_hand: 0
            },
            transaction,
            lock: transaction?.LOCK?.UPDATE
        });
    }

    async getLevelsByFacility(facilityId: number) {
        return this.findAll({
            where: {
                facility_id: facilityId
            },
            include: [
                {
                    model: models.ProductVariant,
                    as: 'variant',
                    include: [
                        {
                            model: models.Product,
                            as: 'product'
                        }
                    ]
                }
            ]
        });
    }

    async getLowStock(threshold: number) {
        return this.findAll({
            where: {
                quantity_on_hand: {
                    [Op.lt]: threshold
                }
            },
            order: [['quantity_on_hand', 'ASC']],
            include: [
                {
                    model: models.ProductVariant,
                    as: 'variant'
                }
            ]
        });
    }

    async checkStock(
        variant_id: number,
        facility_id: number
    ) {
        return this.findOne({
            where: {
                variant_id,
                facility_id
            }
        });
    }

    async getMovements(filters: any) {
        const {
            variant_id,
            facility_id,
            reason,
            limit = 20,
            offset = 0
        } = filters;

        const where: any = {};

        if (variant_id) where.variant_id = variant_id;
        if (facility_id) where.facility_id = facility_id;
        if (reason) where.reason = reason;

        return models.InventoryMovement.findAndCountAll({
            where,
            limit: Number(limit),
            offset: Number(offset),
            order: [['created_at', 'DESC']],
            include: [
                {
                    model: models.ProductVariant,
                    as: 'variant',
                    include: [
                        {
                            model: models.Product,
                            as: 'product'
                        }
                    ]
                }
            ]
        });
    }
}

export const inventoryRepository = new InventoryRepository();