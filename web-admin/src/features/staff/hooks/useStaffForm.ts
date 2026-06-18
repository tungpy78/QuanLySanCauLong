import { useState, useEffect } from 'react';
import { Form, message } from 'antd';
import { StaffService } from '../services/staff.service';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '../../../types/api.type';
import type { CreateStaffPayload, Staff } from '../types/staff.types';

interface UseStaffFormProps {
  open: boolean;
  onSuccess: () => void;
  onClose: () => void;
  initialData?: Staff | null; // Truyền vào nếu là form Edit
}

export const useStaffForm = ({ open, onSuccess, onClose, initialData }: UseStaffFormProps) => {
  const [form] = Form.useForm<CreateStaffPayload>();
  const [loading, setLoading] = useState(false);

  // Reset form khi đóng/mở hoặc điền data nếu là Edit
  useEffect(() => {
    if (open) {
      if (initialData) {
        // Form Edit
        form.setFieldsValue({
          first_name: initialData.full_name.split(' ')[1],
          last_name: initialData.full_name.split(' ')[0],
          email: initialData.email,
          phone: initialData.phone,
          // Không set password khi edit trừ khi backend yêu cầu
        });
      } else {
        // Form Add New
        form.resetFields();
      }
    }
  }, [open, initialData, form]);

  const handleSubmit = async (values: CreateStaffPayload) => {
    try {
      setLoading(true);

      if (initialData) {
        // LÔJIC EDIT (Nếu bạn có API edit, thay vào đây)
        // await StaffService.updateStaff(initialData.id, values);
        message.success('Cập nhật nhân viên thành công!');
      } else {
        // LÔJIC ADD NEW
        const { last_name, first_name, ...rest } = values;
        const payload = {
          ...rest,
          full_name: `${last_name} ${first_name}`.trim(),
        };
        await StaffService.createStaff(payload as any);
        message.success('Tạo nhân viên thành công!');
      }

      form.resetFields();
      onSuccess(); // Gọi callback để refresh danh sách bên ngoài
      onClose();   // Đóng modal
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>;
      message.error(err.response?.data?.message || err.message || 'Lỗi khi xử lý thông tin nhân viên');
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    handleSubmit
  };
};