export declare class AuthService {
    static login(data: any, allowedRoles: string[]): Promise<{
        user: {
            id: number;
            full_name: string | null;
            email: string;
            phone: string | null;
            avatar_url: string | null;
            role: "admin" | "staff" | "customer";
            membership_type: "standard" | "student" | "vip";
            loyalty_points: number;
            is_active: boolean;
            created_at?: Date;
            updated_at?: Date;
            deleted_at?: Date;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    static refreshAccessToken(clientRefreshToken: string): Promise<{
        newAccessToken: string;
        newRefreshToken: string;
    }>;
    static logout(clientRefreshToken: string): Promise<void>;
}
//# sourceMappingURL=auth.service.d.ts.map