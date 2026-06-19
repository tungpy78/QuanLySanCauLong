import models from '../models/index.js';
import sequelize from '../config/database.js';

const backfillCashPayments = async (): Promise<void> => {
  let createdCount = 0;
  let skippedCount = 0;

  try {
    console.log('--- BẮT ĐẦU CHẠY SCRIPT BACKFILL DOANH THU TIỀN MẶT ---');

    // 1. Tìm toàn bộ cash booking đã thanh toán (payment_status = paid)
    const paidCashBookings = await models.Booking.findAll({
      where: {
        payment_status: 'paid',
        payment_method: 'cash',
      },
    });

    console.log(`Tìm thấy ${paidCashBookings.length} booking thanh toán bằng tiền mặt đã paid.`);

    for (const booking of paidCashBookings) {
      // 2. Kiểm tra xem đã tồn tại payment record tương ứng chưa
      const existingPayment = await models.Payment.findOne({
        where: {
          booking_id: booking.id,
          status: 'paid',
        },
      });

      if (!existingPayment) {
        // 3. Tạo payment record cash fallback paid_at
        const paidAtDate = booking.updated_at || booking.created_at || new Date();
        await models.Payment.create({
          booking_id: booking.id,
          provider: 'cash',
          status: 'paid',
          amount_cents: booking.total_cents,
          paid_at: new Date(paidAtDate),
        });

        createdCount++;
        console.log(`[ĐÃ TẠO] Tạo payment cho Booking #${booking.id} - Số tiền: ${booking.total_cents} đ`);
      } else {
        skippedCount++;
      }
    }

    console.log('--- KẾT THÚC CHẠY SCRIPT BACKFILL ---');
    console.log(`Tổng số bản ghi đã tạo mới: ${createdCount}`);
    console.log(`Tổng số bản ghi đã bỏ qua (đã có payment): ${skippedCount}`);
  } catch (error) {
    console.error('Đã xảy ra lỗi trong quá trình backfill:', error);
  } finally {
    // Đóng kết nối database
    await sequelize.close();
    console.log('Đã đóng kết nối CSDL.');
  }
};

// Chạy script
backfillCashPayments();
