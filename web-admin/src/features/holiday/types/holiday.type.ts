export interface Holiday {
  id: number;
  name: string;
  holiday_date: string; // VD: "2026-04-30"
  surcharge_percent: number;
  created_at?: string;
  updated_at?: string;
}

export interface HolidayPayload {
  name: string;
  holiday_date: string;
  surcharge_percent: number;
}