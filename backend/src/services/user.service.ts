import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories/user.repository.js';
import type {CreateStaffDto} from '../validations/user.validation.js'
import type { Transaction } from 'sequelize';
import ApiError from '../utils/ErrorClass.js';
import sequelize from "../config/database.js";


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

    static async createStaff(
        staffData: CreateStaffDto
    ) {
        const {
            full_name,
            email,
            phone,
            password,
            role,
            facility_id,
            job_title
        } = staffData;

        const existedUser =
            await userRepository
                .findByEmail(email);

        if (existedUser) {
            throw new ApiError(
                'Email này đã được sử dụng',
                400
            );
        }

        const salt =
            await bcrypt.genSalt(10);

        const password_hash =
            await bcrypt.hash(
                password,
                salt
            );

        const t =
            await sequelize.transaction();

        try {

            const newUser =
                await userRepository
                    .createUser(
                        {
                            full_name,
                            email,
                            phone,

                            password_hash,

                            role:
                                role ||
                                'staff',

                            is_active:
                                true
                        },
                        t
                    );

            await userRepository
                .createProfile(
                    {
                        user_id:
                            newUser.id,

                        facility_id:
                            facility_id ||
                            null,

                        job_title:
                            job_title ||
                            'Bán hàng'
                    },
                    t
                );

            await t.commit();

            const userJson =
                newUser.toJSON();

            const {
                password_hash: _,
                ...safeUser
            } = userJson;

            return safeUser;

        } catch (error) {

            await t.rollback();

            throw error;
        }
    }

    static async getAllUsers() {
        return userRepository.getAllUsers();
    }

    static async toggleUserStatus(
        userId: number
    ) {

        const user =
            await userRepository
                .toggleStatus(
                    userId
                );

        if (!user) {
            throw new ApiError(
                'Không tìm thấy người dùng',
                404
            );
        }

        const userJson =
            user.toJSON();

        const {
            password_hash: _,
            ...safeUser
        } = userJson as any;

        return safeUser;
    }
}