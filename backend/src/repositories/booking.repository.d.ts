import { BaseRepository } from './base.repository.js';
declare class BookingRepository extends BaseRepository<any> {
    constructor();
    findAllWithDetails(whereCondition?: any): Promise<any[]>;
    findByIdWithDetails(id: number): Promise<any>;
}
export declare const bookingRepository: BookingRepository;
export {};
//# sourceMappingURL=booking.repository.d.ts.map