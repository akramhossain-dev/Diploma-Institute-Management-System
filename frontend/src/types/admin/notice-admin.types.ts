import { z } from 'zod';
import { NoticeInfo } from '@/services/public/notice.service';

export interface AdminNotice extends NoticeInfo {
  status: 'published' | 'draft';
  targetAudience: 'all' | 'students' | 'teachers' | 'accountants';
  createdAt: string;
}

export const noticeFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long'),
  content: z.string().min(10, 'Content details must be at least 10 characters long'),
  category: z.enum(['general', 'admission', 'exam', 'holiday']),
  targetAudience: z.enum(['all', 'students', 'teachers', 'accountants']),
  status: z.enum(['published', 'draft']),
  attachmentUrl: z.string().optional(),
});

export type NoticeFormInput = z.infer<typeof noticeFormSchema>;
export type CreateNoticeInput = NoticeFormInput;
export type UpdateNoticeInput = Partial<NoticeFormInput>;
export default AdminNotice;
