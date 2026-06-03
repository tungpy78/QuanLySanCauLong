import models from '../models/index.js';
import { BaseRepository } from './base.repository.js';

class BookingSlotRepository extends BaseRepository<any> {
    constructor() {
        super(models.BookingSlot);
    }
}
export const bookingSlotRepository = new BookingSlotRepository();