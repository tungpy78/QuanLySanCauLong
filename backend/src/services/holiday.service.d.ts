export declare class HolidayService {
    static getAllHolidays(): Promise<any[]>;
    static createHoliday(data: {
        name: string;
        holiday_date: string;
        surcharge_percent: number;
    }): Promise<any>;
    static updateHoliday(id: number, data: any): Promise<any>;
    static deleteHoliday(id: number): Promise<boolean>;
}
//# sourceMappingURL=holiday.service.d.ts.map