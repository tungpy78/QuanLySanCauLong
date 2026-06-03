export interface IPriceStrategy {
    calculate(configs: any[], startDateTime: Date, endDateTime: Date): {
        totalPrice: number;
        totalCalculatedMinutes: number
    };
}