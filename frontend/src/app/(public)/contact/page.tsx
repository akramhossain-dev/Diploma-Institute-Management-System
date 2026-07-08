'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LucideIcon } from '@/components/shared/navigation/LucideIcon';
import { useUiStore } from '@/store/ui/uiStore';

export default function ContactPage() {
  const addToast = useUiStore((state) => state.addToast);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    addToast('Message Sent Successfully. Our help desk team will review your query and reply back within 24 hours.', 'success');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <PageContainer>
      <SectionHeader
        title="Contact Our Help Desk"
        description="Have any inquiries? Send us a direct message or visit our campus offices."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info Column */}
        <div className="space-y-4 md:col-span-1">
          <Card className="border shadow-xs">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start space-x-3 text-sm">
                <LucideIcon name="MapPin" className="text-primary mt-0.5 shrink-0" size={18} />
                <div>
                  <span className="font-bold block text-foreground">Campus Address</span>
                  <span className="text-muted-foreground block mt-1">12/A Academic Avenue, Dhaka, Bangladesh</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-sm border-t pt-4">
                <LucideIcon name="Phone" className="text-primary mt-0.5 shrink-0" size={18} />
                <div>
                  <span className="font-bold block text-foreground">Telephone Helpline</span>
                  <span className="text-muted-foreground block mt-1">+8802-99887766</span>
                  <span className="text-xs text-muted-foreground block">Ext: Admissions (101), Accounts (102)</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-sm border-t pt-4">
                <LucideIcon name="Mail" className="text-primary mt-0.5 shrink-0" size={18} />
                <div>
                  <span className="font-bold block text-foreground">Electronic Mail</span>
                  <span className="text-muted-foreground block mt-1">info@ndi.edu.bd</span>
                  <span className="text-xs text-muted-foreground block">For status checks: admission@ndi.edu.bd</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message Form Column */}
        <div className="md:col-span-2">
          <Card className="border shadow-md">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold">Your Name</label>
                    <Input
                      placeholder="Enter name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold">Email Address</label>
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold">Subject</label>
                  <Input
                    placeholder="e.g. Admission inquiry"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold">Message Detail</label>
                  <textarea
                    placeholder="Enter your query details..."
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    required
                    disabled={loading}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" className="w-full sm:w-auto font-semibold" isLoading={loading}>
                    Send Message
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
