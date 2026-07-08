import React from 'react';
import { AdmissionFormInput } from '@/types/admission.schema';

interface AdmissionSummaryProps {
  data: Partial<AdmissionFormInput>;
}

export function AdmissionSummary({ data }: AdmissionSummaryProps) {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="border rounded-lg overflow-hidden bg-card text-card-foreground shadow-xs">
        <div className="bg-muted px-4 py-3 border-b">
          <h3 className="font-bold text-sm text-foreground">Section 1: Personal Information</h3>
        </div>
        <table className="w-full text-sm divide-y">
          <tbody className="divide-y">
            <tr>
              <td className="px-4 py-2.5 font-semibold text-muted-foreground w-1/3">Full Name</td>
              <td className="px-4 py-2.5">{data.fullName || '-'}</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-semibold text-muted-foreground">Date of Birth</td>
              <td className="px-4 py-2.5">{data.dateOfBirth || '-'}</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-semibold text-muted-foreground">Gender</td>
              <td className="px-4 py-2.5 capitalize">{data.gender || '-'}</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-semibold text-muted-foreground">Phone Number</td>
              <td className="px-4 py-2.5">{data.phone || '-'}</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-semibold text-muted-foreground">Email Address</td>
              <td className="px-4 py-2.5">{data.email || '-'}</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-semibold text-muted-foreground">Permanent Address</td>
              <td className="px-4 py-2.5">{data.address || '-'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="border rounded-lg overflow-hidden bg-card text-card-foreground shadow-xs">
        <div className="bg-muted px-4 py-3 border-b">
          <h3 className="font-bold text-sm text-foreground">Section 2: Academic & Program Selection</h3>
        </div>
        <table className="w-full text-sm divide-y">
          <tbody className="divide-y">
            <tr>
              <td className="px-4 py-2.5 font-semibold text-muted-foreground w-1/3">SSC Roll Number</td>
              <td className="px-4 py-2.5">{data.sscRoll || '-'}</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-semibold text-muted-foreground">Education Board</td>
              <td className="px-4 py-2.5">{data.sscBoard || '-'}</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-semibold text-muted-foreground">Passing Year</td>
              <td className="px-4 py-2.5">{data.sscYear || '-'}</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-semibold text-muted-foreground">SSC GPA achieved</td>
              <td className="px-4 py-2.5">{data.sscGpa || '-'}</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-semibold text-muted-foreground">Previous Institute</td>
              <td className="px-4 py-2.5">{data.previousInstitute || '-'}</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-semibold text-muted-foreground">Desired Technology</td>
              <td className="px-4 py-2.5 font-bold text-primary">{data.departmentCode || '-'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="border rounded-lg overflow-hidden bg-card text-card-foreground shadow-xs">
        <div className="bg-muted px-4 py-3 border-b">
          <h3 className="font-bold text-sm text-foreground">Section 3: Documents Verification</h3>
        </div>
        <div className="p-4 space-y-4 text-sm">
          <div className="flex items-center justify-between gap-4 border-b pb-2">
            <span className="font-semibold text-muted-foreground">Applicant Photo</span>
            {data.photoUrl ? (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                Uploaded
              </span>
            ) : (
              <span className="text-destructive font-semibold">Missing</span>
            )}
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="font-semibold text-muted-foreground">Certificates/Transcripts PDF Copy</span>
            {data.documentsUrls && data.documentsUrls.length > 0 ? (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                {data.documentsUrls.length} file(s) attached
              </span>
            ) : (
              <span className="text-destructive font-semibold">Missing</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default AdmissionSummary;
