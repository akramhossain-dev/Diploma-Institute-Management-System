'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDepartments } from '@/hooks/public/useDepartments';
import { useAdmissionSubmit } from '@/hooks/public/useAdmission';
import {
  personalInfoSchema as step1Schema,
  academicInfoSchema as step2Schema,
  AdmissionFormInput,
} from '@/types/admission.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AdmissionStep } from './AdmissionStep';
import { AdmissionSummary } from './AdmissionSummary';
import { FileUploader } from '../upload/FileUploader';
import { LucideIcon } from '../shared/navigation/LucideIcon';
import { Card, CardContent } from '@/components/ui/card';

export function AdmissionForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<AdmissionFormInput>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [trackingId, setTrackingId] = useState<string | null>(null);

  const { data: departments = [], isLoading: deptsLoading } = useDepartments();
  const submissionMutation = useAdmissionSubmit();

  const steps = [
    { title: 'Personal Info', description: 'Address & Contact' },
    { title: 'Academic Profile', description: 'SSC & Technology' },
    { title: 'Upload Documents', description: 'Transcripts & Photos' },
    { title: 'Summary & Submit', description: 'Review details' },
  ];

  const step1Form = useForm<any>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      fullName: formData.fullName || '',
      dateOfBirth: formData.dateOfBirth || '',
      gender: formData.gender || undefined,
      phone: formData.phone || '',
      email: formData.email || '',
      address: formData.address || '',
    },
  });

  const step2Form = useForm<any>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      sscRoll: formData.sscRoll || '',
      sscBoard: formData.sscBoard || '',
      sscYear: formData.sscYear || '',
      sscGpa: formData.sscGpa || '',
      previousInstitute: formData.previousInstitute || '',
      departmentCode: formData.departmentCode || '',
    },
  });

  const handleStep1Submit = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(2);
  };

  const handleStep2Submit = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(3);
  };

  const handleStep3Submit = () => {
    // Validate that document URLs are present in state
    if (!formData.photoUrl) {
      setErrorMsg('Please upload a profile photo before proceeding.');
      return;
    }
    if (!formData.documentsUrls || formData.documentsUrls.length === 0) {
      setErrorMsg('Please upload at least one copy of your academic certificate.');
      return;
    }
    setErrorMsg(null);
    setStep(4);
  };

  const handleFinalSubmit = async () => {
    setErrorMsg(null);
    try {
      const response = await submissionMutation.mutateAsync(formData as any);
      setTrackingId(response.trackingId);
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission failed. Please verify credentials and try again.');
    }
  };

  if (trackingId) {
    return (
      <Card className="border shadow-md max-w-xl mx-auto text-center py-10 animate-in zoom-in-95 duration-300">
        <CardContent className="space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
            <LucideIcon name="CheckCircle" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Application Submitted Successfully</h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Your admission application is registered. Please save your tracking identifier to check approval states.
          </p>

          <div className="bg-muted p-4 rounded-lg border font-mono font-bold text-lg select-all">
            {trackingId}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
            <Button onClick={() => window.location.reload()} variant="outline">
              Apply Again
            </Button>
            <Button onClick={() => (window.location.href = `/admission/status?trackingId=${trackingId}`)}>
              Check Status
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <AdmissionStep steps={steps} currentStep={step} />

      <Card className="border shadow-md">
        <CardContent className="pt-6">
          {errorMsg && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-md text-sm font-semibold mb-4 flex items-center gap-2">
              <LucideIcon name="AlertTriangle" size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {}
          {step === 1 && (
            <form onSubmit={step1Form.handleSubmit(handleStep1Submit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Full Name</label>
                  <Input placeholder="John Doe" error={step1Form.formState.errors.fullName?.message as string} {...step1Form.register('fullName')} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Date of Birth</label>
                  <Input type="date" error={step1Form.formState.errors.dateOfBirth?.message as string} {...step1Form.register('dateOfBirth')} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Gender</label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                    {...step1Form.register('gender')}
                  >
                    <option value="">Select gender...</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {step1Form.formState.errors.gender && (
                    <span className="text-xs text-destructive">{step1Form.formState.errors.gender.message as string}</span>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Phone Number</label>
                  <Input placeholder="+8801700000000" error={step1Form.formState.errors.phone?.message as string} {...step1Form.register('phone')} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Email Address</label>
                <Input type="email" placeholder="john.doe@example.com" error={step1Form.formState.errors.email?.message as string} {...step1Form.register('email')} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Permanent Address</label>
                <Input placeholder="123 Street Name, Dhaka" error={step1Form.formState.errors.address?.message as string} {...step1Form.register('address')} />
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit">Next Step</Button>
              </div>
            </form>
          )}

          {}
          {step === 2 && (
            <form onSubmit={step2Form.handleSubmit(handleStep2Submit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold">SSC Roll Number</label>
                  <Input placeholder="Enter roll" error={step2Form.formState.errors.sscRoll?.message as string} {...step2Form.register('sscRoll')} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Education Board</label>
                  <Input placeholder="e.g. Dhaka Board" error={step2Form.formState.errors.sscBoard?.message as string} {...step2Form.register('sscBoard')} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Passing Year</label>
                  <Input placeholder="e.g. 2024" error={step2Form.formState.errors.sscYear?.message as string} {...step2Form.register('sscYear')} />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-sm font-semibold">SSC GPA</label>
                  <Input type="number" step="0.01" placeholder="e.g. 4.50" error={step2Form.formState.errors.sscGpa?.message as string} {...step2Form.register('sscGpa')} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Previous School / Institute</label>
                <Input placeholder="Enter high school name" error={step2Form.formState.errors.previousInstitute?.message as string} {...step2Form.register('previousInstitute')} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Desired Diploma Technology</label>
                <select
                  disabled={deptsLoading}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                  {...step2Form.register('departmentCode')}
                >
                  <option value="">Select department program...</option>
                  {departments.map((d) => (
                    <option key={d.code} value={d.code}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                </select>
                {step2Form.formState.errors.departmentCode && (
                  <span className="text-xs text-destructive">{step2Form.formState.errors.departmentCode.message as string}</span>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="submit">Next Step</Button>
              </div>
            </form>
          )}

          {}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold block">Applicant Profile Photo</label>
                {formData.photoUrl ? (
                  <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-md">
                    <LucideIcon name="CheckCircle" className="text-emerald-500" />
                    <span className="text-sm font-semibold text-emerald-800">Photo Uploaded</span>
                    <Button variant="ghost" size="sm" className="ml-auto text-xs" onClick={() => setFormData(prev => ({ ...prev, photoUrl: undefined }))}>
                      Replace
                    </Button>
                  </div>
                ) : (
                  <FileUploader
                    label="Upload profile photo (JPG/PNG)"
                    allowedTypes={['image/jpeg', 'image/png']}
                    onUploadSuccess={(url) => setFormData(prev => ({ ...prev, photoUrl: url }))}
                  />
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold block">SSC Certificate / Transcript PDF copy</label>
                {formData.documentsUrls && formData.documentsUrls.length > 0 ? (
                  <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-md">
                    <LucideIcon name="CheckCircle" className="text-emerald-500" />
                    <span className="text-sm font-semibold text-emerald-800">{formData.documentsUrls.length} File(s) Uploaded</span>
                    <Button variant="ghost" size="sm" className="ml-auto text-xs" onClick={() => setFormData(prev => ({ ...prev, documentsUrls: undefined }))}>
                      Replace
                    </Button>
                  </div>
                ) : (
                  <FileUploader
                    label="Upload SSC Transcript/Certificate PDF"
                    allowedTypes={['application/pdf']}
                    onUploadSuccess={(url) => setFormData(prev => ({ ...prev, documentsUrls: [url] }))}
                  />
                )}
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button type="button" onClick={handleStep3Submit}>
                  Next Step
                </Button>
              </div>
            </div>
          )}

          {}
          {step === 4 && (
            <div className="space-y-6">
              <AdmissionSummary data={formData} />

              <div className="flex justify-between pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setStep(3)} disabled={submissionMutation.isPending}>
                  Back
                </Button>
                <Button type="button" onClick={handleFinalSubmit} isLoading={submissionMutation.isPending}>
                  Submit Application
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
export default AdmissionForm;
