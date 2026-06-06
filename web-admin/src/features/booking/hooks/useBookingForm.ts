import { useState, useEffect } from 'react';
import { Form, message } from 'antd';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { BookingService } from '../services/booking.service';
import { FacilityService } from '../../facility/services/facility.service';
import { useAuthStore } from '../../auth/store/auth.store';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '../../../types/api.type';
import type { BookedSlotDTO, CreateBookingPayload, CourtLite, BookingFormValues } from '../types/booking.types';
import type { Facility } from '../../facility/types/facility.type';

dayjs.extend(isBetween);

interface UseBookingFormProps {
  open: boolean;
  onSuccess: () => void;
  onClose: () => void;
  initialData?: {
    facility_id?: number;
    court_type?: string;
    court_id?: number;
    play_date?: string;
    start_time?: string;
  } | null;
}

export const useBookingForm = ({ open, onSuccess, onClose, initialData }: UseBookingFormProps) => {
  const [form] = Form.useForm<BookingFormValues>();
  
  const [loading, setLoading] = useState(false);
  const [searchingPhone, setSearchingPhone] = useState(false);

  const [isExistingUser, setIsExistingUser] = useState(false);
  
  const [bookedSlots, setBookedSlots] = useState<BookedSlotDTO[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [facilityCourts, setFacilityCourts] = useState<CourtLite[]>([]);
  const [availableCourtTypes, setAvailableCourtTypes] = useState<string[]>([]);
  const [courts, setCourts] = useState<CourtLite[]>([]);

  const { user } = useAuthStore();
  const staffFacilityId = (user as any)?.staff_profile?.facility_id;

  const selectedDate = Form.useWatch('play_date', form);
  const selectedCourtId = Form.useWatch('court_id', form);
  const selectedFacilityId = Form.useWatch('facility_id', form);
  const selectedCourtType = Form.useWatch('court_type', form);

  useEffect(() => {
    if (open) {
      form.resetFields();
      setIsExistingUser(false);

      FacilityService.getAllFacilities()
        .then(res => setFacilities(res.data))
        .catch(err => console.error("Lỗi lấy cơ sở:", err));

      if (initialData) {
         form.setFieldsValue({
            facility_id: initialData.facility_id,
            court_type: initialData.court_type,
            court_id: initialData.court_id,
            play_date: initialData.play_date ? dayjs(initialData.play_date) : undefined,
            start_time: initialData.start_time ? dayjs(initialData.start_time, 'HH:mm') : undefined
         });
      } else if (staffFacilityId) {
        // Nếu không có initialData (bấm nút Tạo đơn ngoài list), thì vẫn set mặc định như cũ
        form.setFieldValue('facility_id', staffFacilityId);
      }
    }
  }, [open, staffFacilityId, form, initialData]);

  useEffect(() => {
    if (selectedFacilityId) {
      form.setFieldsValue({ court_type: undefined, court_id: undefined } as any); 
      
      FacilityService.getCourtsByFacility(selectedFacilityId)
        .then(res => {
          const courtsData = res.data.courts || [];
          setFacilityCourts(courtsData);

          const uniqueTypes = Array.from(new Set(courtsData.map((c: any) => c.court_type))) as string[];
          setAvailableCourtTypes(uniqueTypes);

          if (uniqueTypes.length === 1) {
            form.setFieldValue('court_type', uniqueTypes[0]);
          }
        })
        .catch(err => console.error("Lỗi lấy sân:", err));
    } else {
      setFacilityCourts([]);
      setAvailableCourtTypes([]);
      setCourts([]);
    }
  }, [selectedFacilityId, form]);

  useEffect(() => {
    if (selectedCourtType && facilityCourts.length > 0) {
      form.setFieldValue('court_id', undefined);
      const filteredCourts = facilityCourts.filter(c => c.court_type === selectedCourtType);
      setCourts(filteredCourts);
    } else {
      setCourts([]);
    }
  }, [selectedCourtType, facilityCourts, form]);

  useEffect(() => {
    if (selectedDate && selectedFacilityId && selectedCourtType && open) {
      const fetchBookedSlots = async () => {
        try {
          const dateStr = dayjs(selectedDate).format('YYYY-MM-DD');
          const res = await BookingService.getDailySlots(selectedFacilityId, dateStr, selectedCourtType); 
          
          // --- ADMIN CHỈ LẤY ĐÚNG RAW DATA, BỎ QUA CÁI GRID CỦA APP ---
          if (res.data && res.data.rawBookedSlots) {
            setBookedSlots(res.data.rawBookedSlots);
          } else {
            setBookedSlots([]); 
          }
          
        } catch (error) {
          console.error("Lỗi lấy lịch:", error);
          setBookedSlots([]); 
        }
      };
      fetchBookedSlots();
    }
  }, [selectedDate, selectedFacilityId, selectedCourtType, open]);

  const currentCourtBookedSlots = bookedSlots.filter(slot => slot.court_id === selectedCourtId);

  const handleSearchPhone = async (phoneStr: string) => {
    const phone = phoneStr.trim();
    if (!phone || phone.length < 9) return; 

    try {
      setSearchingPhone(true);
      const res = await BookingService.getUserByPhone(phone);
      if (res.data && res.data.full_name) {
        form.setFieldsValue({
          full_name: res.data.full_name,
          membership_type: res.data.membership_type || 'standard'
        });
        setIsExistingUser(true);
        message.success(`Đã tự động điền thông tin khách: ${res.data.full_name} (${res.data.membership_type})`);
      }else {
        // --- KHÁCH MỚI (Trường hợp API trả về 200 nhưng data rỗng) ---
        form.setFieldsValue({ full_name: '', membership_type: 'standard' });
        setIsExistingUser(false);
        message.info('Khách hàng mới. Vui lòng nhập tên và loại khách!');
      }
    } catch (error: any) {
      form.setFieldsValue({ full_name: '', membership_type: 'standard' });
      setIsExistingUser(false);
      
      if (error.response?.status === 404) {
          message.info('Khách hàng mới. Vui lòng nhập tên và loại khách!');
      } else {
          console.error("Lỗi gọi API tìm SĐT:", error);
      }
    } finally {
      setSearchingPhone(false);
    }
  };

  const checkOverlappingTime = (_: any, value: any) => {
    if (!value || !selectedCourtId || currentCourtBookedSlots.length === 0) return Promise.resolve();
    
    const startTimeVal = form.getFieldValue('start_time');
    const endTimeVal = form.getFieldValue('end_time');
    if (!startTimeVal || !endTimeVal) return Promise.resolve();

    const start = dayjs(startTimeVal).format('HH:mm');
    const end = dayjs(endTimeVal).format('HH:mm');

    const isOverlap = currentCourtBookedSlots.some(slot => {
      return (start < slot.end_time && end > slot.start_time);
    });

    if (isOverlap) return Promise.reject(new Error('Khung giờ này đã bị trùng khách khác!'));
    return Promise.resolve();
  };

  const handleSubmit = async (values: BookingFormValues) => {
    try {
      setLoading(true);
      const payload: CreateBookingPayload = {
        customer_phone: values.phone,
        customer_name: values.full_name,
        membership_type: values.membership_type,
        facility_id: values.facility_id,
        court_id: values.court_id,
        date: values.play_date.format('YYYY-MM-DD'),
        start_time: values.start_time.format('HH:mm'),
        end_time: values.end_time.format('HH:mm'),
        status: 'confirmed' as const,
        payment_method: 'cash' as const
      };
      await BookingService.createBooking(payload);
      message.success('Tạo đơn đặt sân thành công!');
      form.resetFields();
      onSuccess();
      onClose();
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>;
      message.error(err.response?.data?.message || err.message || 'Lỗi khi tạo đơn');
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    searchingPhone,
    isExistingUser,
    facilities,
    availableCourtTypes,
    courts,
    staffFacilityId,
    selectedCourtId,
    selectedDate,
    selectedFacilityId,
    selectedCourtType,
    currentCourtBookedSlots,
    handleSearchPhone,
    checkOverlappingTime,
    handleSubmit
  };
};