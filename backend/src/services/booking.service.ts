import { Op } from 'sequelize';
import models from '../models/index.js';
import type { CreateBookingByHotlineInput, CreateBookingInput, UpdateBookingStatusInput } from '../validations/booking.validation.js';
import dayjs from 'dayjs';
import sequelize from '../config/database.js';
import ApiError from '../utils/ErrorClass.js';
import { BOOKING_STATUS_TRANSITIONS, PAYMENT_STATUS_TRANSITIONS } from '../constants/booking.constant.js';
import { PricingService } from './pricing.service.js';
import { VNPayUtils } from '../utils/vnpay.js';
import { bookingSlotRepository } from '../repositories/bookingSlot.repository.js';
import { courtRepository } from '../repositories/court.repository.js';
import { facilityRepository } from '../repositories/facility.repository.js';
import { priceConfigRepository } from '../repositories/priceConfig.repository.js';
import { StandardPricingStrategy } from '../patterns/strategies/pricing/standard-pricing.strategy.js';
import { PricingContext } from '../patterns/strategies/pricing/pricing.context.js';
import { bookingRepository } from '../repositories/booking.repository.js';
import { userRepository } from '../repositories/user.repository.js';

export class BookingService {
    static async getAvailableCourts(startDateTime: Date, endDateTime: Date, courtType?: string) {
        
        const bookedSlots = await bookingSlotRepository.findAll({
            where: {
                [Op.and]: [
                    { start_at: { [Op.lt]: endDateTime } },
                    { end_at: { [Op.gt]: startDateTime } }
                ]
            },
            attributes: ['court_id'],
            raw: true
        });

        const bookedCourtIds = bookedSlots.map(slot => slot.court_id);

        const whereCondition: any = {
            id: { [Op.notIn]: bookedCourtIds },
            is_active: true
        };
        
        if (courtType) {
            whereCondition.court_type = courtType;
        }

        
       const availableCourts = await courtRepository.findAllWithFacility(whereCondition);

        
        // 3. Tính giá cho từng sân khả dụng
        const results = await Promise.all(availableCourts.map(async (court) => {
            try {
                const totalPrice = await PricingService.calculateTotalPrice(
                    court.facility_id,
                    court.court_type,
                    startDateTime,
                    endDateTime
                );

                return {
                    ...court.toJSON(),
                    total_price: totalPrice,
                    price_per_hour: totalPrice / (dayjs(endDateTime).diff(dayjs(startDateTime), 'minute') / 60)
                };
            } catch (error) {
                // Nếu không có giá cho khung giờ này, coi như sân không khả dụng
                return null;
            }
        }));

        const validResults = results.filter(court => court !== null);

        if (validResults.length === 0) {
            throw new ApiError('Không tìm thấy cấu hình giá cho khung giờ bạn chọn tại cơ sở này!', 400);
        }

        return validResults;
    }

    static async getDailyBookedSlots(facilityId: number, date: string, courtType: string) {
        const facility = await facilityRepository.findById(facilityId);
        if (!facility) {
            throw new ApiError('Cơ sở không tồn tại', 404);
        }
        
        const START_HOUR = parseInt(facility.open_time.split(':')[0]);
        const END_HOUR = parseInt(facility.close_time.split(':')[0]);

        const courts = await courtRepository.findAll({
            where: { facility_id: facilityId, court_type: courtType, is_active: true },
            attributes: ['id', 'name', 'court_type', 'facility_id'],
            raw: true
        });

        if (courts.length === 0) return { courts: [], slotsByCourtId: {} };

        // 3. Lấy tất cả các slot đã đặt
        const startOfDay = dayjs(date).startOf('day').toDate();
        const endOfDay = dayjs(date).endOf('day').toDate();

        const bookedSlots = await bookingSlotRepository.findAll({
            where: {
                court_id: { [Op.in]: courts.map(c => c.id) },
                [Op.and]: [
                    { start_at: { [Op.gte]: startOfDay } },
                    { start_at: { [Op.lte]: endOfDay } }
                ]
            },
            include: [{
                model: models.Booking,
                as: 'booking',
                where: { status: { [Op.ne]: 'cancelled' } },
                attributes: []
            }],
            attributes: ['court_id', 'start_at', 'end_at', 'booking_id', 'price_cents'],
            raw: true
        });
        
        const priceConfigs = await priceConfigRepository.findAll({
            where: { facility_id: facilityId, court_type: courtType },
            raw: true
        });
        const slotsByCourtId: Record<number, any[]> = {};

        courts.forEach(court => {
            const courtSlots = [];
            for (let h = START_HOUR; h < END_HOUR; h++) {
                const slotStart = dayjs(date).hour(h).minute(0).second(0);
                const slotEnd = dayjs(date).hour(h + 1).minute(0).second(0);

                const isBooked = bookedSlots.some(bs => {
                    return bs.court_id === court.id &&
                        dayjs(bs.start_at).isBefore(slotEnd) &&
                        dayjs(bs.end_at).isAfter(slotStart);
                });

                const strategy = new StandardPricingStrategy();
                const pricingContext = new PricingContext(strategy);

                // Tính giá cho khung giờ này
                const { totalPrice } = pricingContext.executeCalculation(
                    priceConfigs, 
                    slotStart.toDate(), 
                    slotEnd.toDate()
                );

                courtSlots.push({
                    start: slotStart.format('HH:mm'),
                    end: slotEnd.format('HH:mm'),
                    available: !isBooked,
                    price_cents: Math.ceil(totalPrice)
                });
            }
            slotsByCourtId[court.id] = courtSlots;
        });

        const rawSlots = bookedSlots.map(slot => ({
            booking_id: slot.booking_id, 
            price_cents: slot.price_cents,
            court_id: slot.court_id,
            start_time: dayjs(slot.start_at).format('HH:mm'),
            end_time: dayjs(slot.end_at).format('HH:mm')
        }));

        return {
            courts,
            slotsByCourtId,
            rawBookedSlots: rawSlots
        };
    }

    static async createBooking(userId:number, data: CreateBookingInput) {
        const startDateTime = dayjs(`${data.date} ${data.start_time}`, 'YYYY-MM-DD HH:mm').toDate();
        const endDateTime = dayjs(`${data.date} ${data.end_time}`, 'YYYY-MM-DD HH:mm').toDate();

        const court = await courtRepository.findOne({
            where: { id: data.court_id, is_active: true }
        });

        if (!court) {
            throw new ApiError('Sân không tồn tại hoặc đang bảo trì!', 404);
        }
        
        if (court.facility_id !== data.facility_id) {
            throw new ApiError('Sân này không thuộc cơ sở bạn đã chọn!', 400);
        }

        const calculatedPrice = await PricingService.calculateTotalPrice(
            data.facility_id, 
            court.court_type,
            startDateTime, 
            endDateTime,
            userId
        );

        const t = await sequelize.transaction();
        try {
            const conflictingSlot = await bookingSlotRepository.findOne({
                where: {
                    court_id: data.court_id,
                    [Op.and]: [
                        {start_at: { [Op.lt]: endDateTime }},
                        {end_at: { [Op.gt]: startDateTime }}
                    ]
                },
                include: [{
                    model: models.Booking,
                    as: 'booking',
                    where: { status: { [Op.ne]: 'cancelled' } },
                    attributes: ['id', 'status']
                }],
                transaction: t,
                lock: t.LOCK.UPDATE
            });
            if(conflictingSlot) {
                throw new ApiError('Rất tiếc, sân này vừa có người đặt mất rồi. Vui lòng chọn sân khác!', 400);
            }

            const MIN_DURATION_MINUTES = 60;
            const previousBooking = await bookingSlotRepository.findOne({
                where: {
                    court_id: data.court_id,
                    end_at: { [Op.lte]: startDateTime }
                },
                include: [{
                    model: models.Booking,
                    as: 'booking',
                    where: { status: { [Op.ne]: 'cancelled' } },
                    attributes: ['id']
                }],
                order: [['end_at', 'DESC']],
                transaction: t
            });

            if(previousBooking) {
                const gapBefore = dayjs(startDateTime).diff(dayjs(previousBooking.end_at), 'minute');
                
                if(gapBefore > 0 && gapBefore < MIN_DURATION_MINUTES ) {
                    throw new ApiError (
                        `Không thể đặt! Sẽ tạo ra khoảng trống ${gapBefore} phút (từ ${dayjs(previousBooking.end_at).format('HH:mm')} đến ${dayjs(startDateTime).format('HH:mm')}) không đủ để người khác thuê.`,
                        400
                    );
                }
            }

            const nextBooking = await bookingSlotRepository.findOne({
                where: {
                    court_id: data.court_id,
                    start_at: { [Op.gte]: endDateTime }
                },
                include: [{
                    model: models.Booking,
                    as: 'booking',
                    where: { status: { [Op.ne]: 'cancelled' } },
                    attributes: ['id']
                }],
                order: [['start_at', 'ASC']],
                transaction: t
            });

            if(nextBooking) {
                const gapAfter = dayjs(nextBooking.start_at).diff(dayjs(endDateTime), 'minute');
                
                if(gapAfter > 0 && gapAfter < MIN_DURATION_MINUTES) {
                    throw new ApiError(
                        `Không thể đặt! Sẽ tạo ra khoảng trống ${gapAfter} phút (từ ${dayjs(endDateTime).format('HH:mm')} đến ${dayjs(nextBooking.start_at).format('HH:mm')}) không đủ để người khác thuê.`,
                        400
                    );
                }
            }

            const newBooking = await bookingRepository.create({
                user_id: userId,
                facility_id: data.facility_id,
                total_cents: calculatedPrice,
                payment_method: data.payment_method || 'cash',
            }, { transaction: t });

            await bookingSlotRepository.create({
                booking_id: newBooking.id,
                court_id: data.court_id,
                start_at: startDateTime,
                end_at: endDateTime,
                price_cents: calculatedPrice
            }, { transaction: t })

            await t.commit();
            
            return newBooking;
            
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    static async getMyBookings(userId: number) {
        return await bookingRepository.findAllWithDetails({ user_id: userId });
    }

    static async getAllBookings(facilityId?: number) {
        const whereCondition: any = {};

        if(facilityId) {
            whereCondition.facility_id = facilityId;
        }

        return await bookingRepository.findAllWithDetails(whereCondition);
    }

    static async getByBookingId(bookingId: number) {
        const booking = await bookingRepository.findByIdWithDetails(bookingId);
        if (!booking) throw new ApiError('Không tìm thấy thông tin đơn đặt sân này!', 404);
        return booking;
    }

    static async updateBookingStatus(id: number, data: UpdateBookingStatusInput) {
        const booking = await bookingRepository.findById(id);
        if(!booking) throw new ApiError('Không tìm thấy lịch đặt này', 404);

        if(data.status && data.status != booking.status) {
            const validNextStates = BOOKING_STATUS_TRANSITIONS[booking.status] || [];

            if (!validNextStates.includes(data.status)) {
                throw new ApiError(`Không thể chuyển trạng thái từ '${booking.status}' sang '${data.status}'`, 400);
            }
        }

        if (data.payment_status && data.payment_status !== booking.payment_status) {
            const validNextPaymentStates = PAYMENT_STATUS_TRANSITIONS[booking.payment_status] || [];

            if (!validNextPaymentStates.includes(data.payment_status)) {
                throw new ApiError(`Không thể chuyển trạng thái thanh toán từ '${booking.payment_status}' sang '${data.payment_status}'`, 400);
            }
        }

        await booking.update(data as any);

        return booking;
    }
    static async validateBookingTimes(date: string, startTime: string, endTime: string) {
        const startDateTime = dayjs(`${date} ${startTime}`, 'YYYY-MM-DD HH:mm');
        const endDateTime = dayjs(`${date} ${endTime}`, 'YYYY-MM-DD HH:mm');

        if (!startDateTime.isValid() || !endDateTime.isValid()) {
            throw new ApiError('Thời gian không hợp lệ', 400);
        }
        if (startDateTime.isBefore(dayjs())) {
            throw new ApiError('Không thể đặt sân ở thời điểm trong quá khứ', 400);
        }
        if (endDateTime.isBefore(startDateTime) || endDateTime.isSame(startDateTime)) {
            throw new ApiError('Giờ kết thúc phải sau giờ bắt đầu', 400);
        }

        return { startDateTime, endDateTime };
    }

    static async createBookingByHotline(data: CreateBookingByHotlineInput) { 
        
        const { customer_phone, customer_name, membership_type, ...bookingData } = data;

        let user = await userRepository.findCustomerByPhone(customer_phone);
        const isNewUser = !user;

        if (!user) {
            const nameToSave = customer_name || 'Khách vãng lai';
            
            user = await (await import('./user.service.js')).UserService.createGuestUser(
                customer_phone, 
                nameToSave, 
                membership_type 
            );
        }

        const payloadToService = {
            ...bookingData,
            status: 'confirmed' as const,
            payment_method: 'cash' as const,
        };

        const result = await this.createBooking(user.id, payloadToService);

        return {
            booking: result,
            user,
            message: isNewUser 
                ? 'Đã tạo tài khoản mới và đặt sân hộ khách thành công' 
                : 'Đã đặt sân hộ khách thành công'
        };
    }

    static async generateVNPayUrl(bookingId: number, ipAddr: string) {
        // 1. Tìm đơn hàng
        const booking = await bookingRepository.findById(bookingId);
        
        if (!booking) {
            throw new ApiError('Không tìm thấy đơn đặt sân', 404);
        }
        
        if (booking.payment_status === 'paid') {
            throw new ApiError('Đơn này đã được thanh toán rồi!', 400);
        }

        // 2. Tạo link VNPay (Dùng tiện ích cũ của app Mobile)
        const paymentUrl = VNPayUtils.createPaymentUrl({
            amount: booking.total_cents,
            // Thêm random string để chống trùng orderId của VNPay nếu khách quét mã nhiều lần
            orderId: booking.id.toString() + '_' + Date.now().toString().slice(-6),
            orderInfo: `Thanh toan don dat san ${booking.id}`,
            ipAddr: ipAddr || '127.0.0.1'
        });

        return { paymentUrl };
    }
}