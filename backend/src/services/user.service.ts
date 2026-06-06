import bcrypt from 'bcryptjs';
import models from '../models/index.js';
import { userRepository } from '../repositories/user.repository.js';
import type { Transaction } from 'sequelize';

export class UserService {
    static async getUserByPhone(phone: string) {
        return await userRepository.findCustomerByPhone(phone);
    }

    static async createGuestUser(phone: string, fullName: string, membershipType: string = 'standard') {

        const randomPassword = Math.random().toString(36).slice(-8);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(randomPassword, salt);

        const dummyEmail = `guest_${phone}@thethaovip.local`; 

        return await userRepository.create({
            email: dummyEmail,
            full_name:fullName,
            phone: phone,
            password_hash: hashedPassword,
            role: 'customer',
            membership_type: membershipType
        });
    }

    static async addPointsAndUpgrade(userId: number, amountPaid: number, t: Transaction) {
        const user = await userRepository.findById(userId, { 
            transaction: t,
            lock: t.LOCK.UPDATE 
        });

        if (!user) return;

        const pointsEarned = Math.floor(amountPaid / 10000);
        
        if (pointsEarned > 0) {
            user.loyalty_points += pointsEarned;

            const VIP_THRESHOLD = 1000;
            
            if (user.loyalty_points >= VIP_THRESHOLD && user.membership_type !== 'vip') {
                user.membership_type = 'vip';
                console.log(`[Hệ thống] Khách hàng ${user.full_name} đã được thăng hạng VIP!`);
            }

            await user.save({ transaction: t });
        }
    }
}