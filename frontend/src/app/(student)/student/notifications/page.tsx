'use client';

import React from 'react';
import Link from 'next/link';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { useStudentNotifications } from '@/hooks/student/useStudentNotifications';
import { TableSkeleton } from '@/components/shared/feedback/Skeletons';
import { ErrorState } from '@/components/shared/feedback/ErrorState';
import { EmptyState } from '@/components/shared/feedback/EmptyState';
import { StatusBadge } from '@/components/shared/feedback/StatusBadge';
import { ActionToolbar } from '@/components/shared/layout/ActionToolbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { LucideIcon } from '@/components/shared/navigation/LucideIcon';

export default function StudentNotificationsPage() {
  const {
    notifications,
    unreadCount,
    isLoading,
    isError,
    refetch,
    markAsRead,
    markAllAsRead,
  } = useStudentNotifications();

  const [statusFilter, setStatusFilter] = React.useState<'all' | 'unread' | 'read'>('all');
  const [showConfirmReadAll, setShowConfirmReadAll] = React.useState(false);

  if (isLoading) {
    return (
      <PageContainer>
        <SectionHeader title="My Notifications" description="Loading portal alerts..." />
        <TableSkeleton rows={4} />
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer>
        <SectionHeader title="My Notifications" description="Student alerts inbox." />
        <ErrorState message="Failed to fetch student notifications. Please verify network connectivity." onRetry={refetch} />
      </PageContainer>
    );
  }

  const filteredNotifications = notifications.filter((item) => {
    if (statusFilter === 'unread') return !item.read;
    if (statusFilter === 'read') return item.read;
    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <LucideIcon name="CheckCircle" className="text-emerald-500" size={20} />;
      case 'warning':
        return <LucideIcon name="AlertTriangle" className="text-amber-500" size={20} />;
      case 'error':
        return <LucideIcon name="AlertCircle" className="text-rose-500" size={20} />;
      default:
        return <LucideIcon name="Info" className="text-sky-500" size={20} />;
    }
  };

  const getBgClass = (type: string, read: boolean) => {
    if (read) return 'bg-card/40 border-muted opacity-80';
    switch (type) {
      case 'success':
        return 'bg-emerald-500/5 border-emerald-500/10 hover:bg-emerald-500/10';
      case 'warning':
        return 'bg-amber-500/5 border-amber-500/10 hover:bg-amber-500/10';
      case 'error':
        return 'bg-rose-500/5 border-rose-500/10 hover:bg-rose-500/10';
      default:
        return 'bg-sky-500/5 border-sky-500/10 hover:bg-sky-500/10';
    }
  };

  return (
    <PageContainer>
      <SectionHeader
        title="My Notifications"
        description="View personalized student notifications including course schedules, grade changes, outstanding fees, and notices."
        action={
          unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfirmReadAll(true)}
              className="text-primary hover:bg-primary/10 hover:text-primary transition-all font-semibold"
            >
              <LucideIcon name="CheckCheck" size={16} className="mr-2" />
              Mark All Read
            </Button>
          )
        }
      />

      <ActionToolbar
        filterContent={
          <div className="flex gap-1.5 border rounded-lg p-0.5 bg-muted/20">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setStatusFilter('all')}
              className="text-xs h-8 px-3 py-1 font-bold"
            >
              All ({notifications.length})
            </Button>
            <Button
              variant={statusFilter === 'unread' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setStatusFilter('unread')}
              className="text-xs h-8 px-3 py-1 font-bold"
            >
              Unread ({notifications.filter((n) => !n.read).length})
            </Button>
            <Button
              variant={statusFilter === 'read' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setStatusFilter('read')}
              className="text-xs h-8 px-3 py-1 font-bold"
            >
              Read ({notifications.filter((n) => n.read).length})
            </Button>
          </div>
        }
      />

      {filteredNotifications.length === 0 ? (
        <EmptyState
          title="No Notifications Found"
          description={
            statusFilter === 'unread'
              ? 'Excellent! You have read all notifications in your student portal.'
              : 'You do not have any notices in your student alert center.'
          }
          icon={<LucideIcon name="Inbox" size={32} />}
        />
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((not) => (
            <Card
              key={not._id}
              className={`border shadow-xs transition-all duration-300 rounded-xl overflow-hidden ${getBgClass(
                not.type,
                not.read
              )}`}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-background shadow-xs shrink-0">
                    {getNotificationIcon(not.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2 justify-between">
                      <h3 className="text-sm font-bold text-foreground leading-snug">
                        {not.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={not.read ? 'read' : 'unread'} />
                        <span className="text-[10px] text-muted-foreground font-semibold">
                          {new Date(not.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-4xl">
                      {not.message}
                    </p>
                    <div className="pt-2 flex items-center gap-3">
                      {not.targetLink && (
                        <Link href={not.targetLink}>
                          <Button variant="link" className="p-0 text-xs font-bold text-primary flex items-center gap-1">
                            Go to module
                            <LucideIcon name="ArrowUpRight" size={14} />
                          </Button>
                        </Link>
                      )}
                      {!not.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(not._id)}
                          className="text-xs h-7 text-muted-foreground hover:text-foreground font-bold"
                        >
                          <LucideIcon name="Check" size={14} className="mr-1" />
                          Mark read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={showConfirmReadAll}
        onOpenChange={setShowConfirmReadAll}
        title="Mark All Notifications as Read"
        description="Are you sure you want to dismiss all pending portal alerts? This action cannot be undone."
        onConfirm={async () => {
          await markAllAsRead();
        }}
      />
    </PageContainer>
  );
}
