export interface UploadedFile {
  _id: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadDate: string;
  moduleRef?: string;
  url: string;
}
