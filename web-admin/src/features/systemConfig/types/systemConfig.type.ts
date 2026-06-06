export interface SystemConfig {
  id: number;
  key: string;
  value: string;
  description: string | null;
  data_type: 'number' | 'string' | 'boolean';
  created_at?: string;
  updated_at?: string;
}

// Payload khi tạo mới (Đầy đủ)
export interface CreateSystemConfigPayload {
  key: string;
  value: string;
  description?: string;
  data_type: 'number' | 'string' | 'boolean';
}

// Payload khi cập nhật (Chỉ được sửa value và mô tả)
export interface UpdateSystemConfigPayload {
  value: string;
  description?: string;
}