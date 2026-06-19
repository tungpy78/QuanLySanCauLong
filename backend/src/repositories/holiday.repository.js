import models from '../models/index.js';
import { BaseRepository } from './base.repository.js';
class HolidayRepository extends BaseRepository {
    constructor() {
        super(models.Holiday);
    }
}
export const holidayRepository = new HolidayRepository();
//# sourceMappingURL=holiday.repository.js.map