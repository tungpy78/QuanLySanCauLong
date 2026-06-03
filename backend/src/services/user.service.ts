import bcrypt from 'bcryptjs';
import models from '../models/index.js';
import { userRepository } from '../repositories/user.repository.js';

export class UserService {
    static async getUserByPhone(phone: string) {
        return await userRepository.findCustomerByPhone(phone);
    }

    static async createGuestUser(phone: string, fullName: string) {

        const randomPassword = Math.random().toString(36).slice(-8);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(randomPassword, salt);

        const dummyEmail = `guest_${phone}@thethaovip.local`; 

        return await userRepository.create({
            email: dummyEmail,
            full_name:fullName,
            phone: phone,
            password_hash: hashedPassword,
            role: 'customer'
        });
    }
}