import models from '../models/index.js';
import { BaseRepository } from './base.repository.js';
class BookingSlotRepository extends BaseRepository {
    constructor() {
        super(models.BookingSlot);
    }
}
export const bookingSlotRepository = new BookingSlotRepository();
//# sourceMappingURL=bookingSlot.repository.js.map