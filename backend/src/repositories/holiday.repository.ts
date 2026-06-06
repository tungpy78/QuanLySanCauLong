import models from '../models/index.js';
import { BaseRepository } from './base.repository.js';

class HolidayRepository extends BaseRepository<any> {
    constructor() {
        super(models.Holiday as any);
    }
}

export const holidayRepository = new HolidayRepository();