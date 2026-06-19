import { Model, type Optional } from 'sequelize';
export interface BookingSlotAttributes {
    id: number;
    booking_id: number;
    court_id: number;
    start_at: Date;
    end_at: Date;
    price_cents: number;
    created_at?: Date;
    updated_at?: Date;
}
export interface BookingSlotCreationAttributes extends Optional<BookingSlotAttributes, 'id'> {
}
declare class BookingSlot extends Model<BookingSlotAttributes, BookingSlotCreationAttributes> implements BookingSlotAttributes {
    id: number;
    booking_id: number;
    court_id: number;
    start_at: Date;
    end_at: Date;
    price_cents: number;
    readonly created_at: Date;
    readonly updated_at: Date;
}
export default BookingSlot;
//# sourceMappingURL=booking_slot.model.d.ts.map