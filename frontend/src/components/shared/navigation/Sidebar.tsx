'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUiStore } from '@/store/ui/uiStore';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types/shared/ui.types';
import { LucideIcon } from './LucideIcon';
import { Button } from '@/components/ui/button';
import { useAdminAuthStore } from '@/store/auth/adminAuthStore';
import { useStudentAuthStore } from '@/store/auth/studentAuthStore';
import { useTeacherAuthStore } from '@/store/auth/teacherAuthStore';
import { useAccountantAuthStore } from '@/store/auth/accountantAuthStore';
import { adminAuthService } from '@/services/auth/admin-auth.service';
import { studentAuthService } from '@/services/auth/student-auth.service';
import { teacherAuthService } from '@/services/auth/teacher-auth.service';
import { accountantAuthService } from '@/services/auth/accountant-auth.service';

interface SidebarProps {
  title: string;
  items: NavItem[];
  entityType: 'admin' | 'student' | 'teacher' | 'accountant';
  profileName: string;
  profileRole: string;
}

// Entity accent colours — soft blue palette for ALL roles (unified white theme)
const entityBadgeMap: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  admin:      { bg: 'bg-[#DBEAFE]', text: 'text-[#1D4ED8]', dot: 'bg-[#1D4ED8]', label: 'Admin Panel' },
  teacher:    { bg: 'bg-[#EDE9FE]', text: 'text-[#6D28D9]', dot: 'bg-[#6D28D9]', label: 'Faculty Panel' },
  student:    { bg: 'bg-[#D1FAE5]', text: 'text-[#059669]', dot: 'bg-[#059669]', label: 'Student Panel' },
  accountant: { bg: 'bg-[#FEF3C7]', text: 'text-[#B45309]', dot: 'bg-[#B45309]', label: 'Accounts Panel' },
};

const entityAvatarMap: Record<string, string> = {
  admin:      'bg-[#DBEAFE] text-[#1D4ED8]',
  teacher:    'bg-[#EDE9FE] text-[#6D28D9]',
  student:    'bg-[#D1FAE5] text-[#059669]',
  accountant: 'bg-[#FEF3C7] text-[#B45309]',
};

export function Sidebar({ title, items, entityType, profileName, profileRole }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const sidebarOpen = useUiStore((state) => state.sidebarOpen);
  const mobileMenuOpen = useUiStore((state) => state.mobileMenuOpen);
  const setMobileMenuOpen = useUiStore((state) => state.setMobileMenuOpen);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);

  const handleLogout = async () => {
    try {
      if (entityType === 'admin') {
        await adminAuthService.logout();
        useAdminAuthStore.getState().clearSession();
      } else if (entityType === 'student') {
        await studentAuthService.logout();
        useStudentAuthStore.getState().clearSession();
      } else if (entityType === 'teacher') {
        await teacherAuthService.logout();
        useTeacherAuthStore.getState().clearSession();
      } else if (entityType === 'accountant') {
        await accountantAuthService.logout();
        useAccountantAuthStore.getState().clearSession();
      }
    } catch (e) {
      console.warn('Logout request failed, clearing local session anyway', e);
      if (entityType === 'admin') useAdminAuthStore.getState().clearSession();
      else if (entityType === 'student') useStudentAuthStore.getState().clearSession();
      else if (entityType === 'teacher') useTeacherAuthStore.getState().clearSession();
      else if (entityType === 'accountant') useAccountantAuthStore.getState().clearSession();
    }
    router.push(`/login/${entityType}`);
  };

  const [expandedItems, setExpandedItems] = React.useState<Record<string, boolean>>({});

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const badge = entityBadgeMap[entityType] ?? entityBadgeMap.admin;
  const avatarClass = entityAvatarMap[entityType] ?? entityAvatarMap.admin;

  const renderNavItem = (item: NavItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = !!expandedItems[item.label];
    const isChildActive = hasChildren && item.children?.some(child => pathname.startsWith(child.route));
    const isActive = pathname === item.route || pathname.startsWith(item.route + '/') || isChildActive;

    return (
      <div key={item.label} className={cn('space-y-0.5', depth > 0 && 'ml-3')}>
        {hasChildren ? (
          <div>
            <button
              onClick={() => toggleExpand(item.label)}
              className={cn(
                'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-[#DBEAFE] text-[#1D4ED8]'
                  : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1D4ED8]'
              )}
            >
              <div className="flex items-center gap-3">
                {item.icon && (
                  <LucideIcon
                    name={item.icon}
                    size={16}
                    className={isActive ? 'text-[#1D4ED8]' : 'text-[#94A3B8]'}
                  />
                )}
                <span className="text-[13px] tracking-[-0.01em]">{item.label}</span>
              </div>
              <LucideIcon
                name={isExpanded ? 'ChevronDown' : 'ChevronRight'}
                size={13}
                className={isActive ? 'text-[#1D4ED8]' : 'text-[#CBD5E1]'}
              />
            </button>
            {isExpanded && (
              <div className="mt-0.5 ml-4 pl-3 border-l border-[#E2E8F0] space-y-0.5">
                {item.children?.map(child => renderNavItem(child, depth + 1))}
              </div>
            )}
          </div>
        ) : (
          <Link
            href={item.route}
            onClick={() => setMobileMenuOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150',
              'border-l-2',
              isActive
                ? 'bg-[#DBEAFE] text-[#1D4ED8] border-l-[#1D4ED8]'
                : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1D4ED8] border-l-transparent hover:border-l-[#BFDBFE]'
            )}
          >
            {item.icon && (
              <LucideIcon
                name={item.icon}
                size={16}
                className={isActive ? 'text-[#1D4ED8]' : 'text-[#94A3B8] group-hover:text-[#1D4ED8]'}
              />
            )}
            <span className="tracking-[-0.01em]">{item.label}</span>
          </Link>
        )}
      </div>
    );
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white border-r border-[#E2E8F0]">

      {/* Brand Header */}
      <div className="flex h-14 items-center justify-between px-4 border-b border-[#E2E8F0]">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1D4ED8] shadow-[0_0_12px_rgba(29,78,216,0.20)] transition-shadow group-hover:shadow-[0_0_16px_rgba(29,78,216,0.35)]">
            <span className="text-[12px] font-black text-white tracking-tight">M</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-bold text-[#0F172A] tracking-tight leading-none">MRIST</span>
            <span className="text-[10px] text-[#94A3B8] leading-none mt-0.5">Institute Portal</span>
          </div>
        </Link>
        <Button
          variant="ghost"
          size="icon-sm"
          className="hidden lg:flex text-[#94A3B8] hover:text-[#334155] hover:bg-[#F1F5F9]"
          onClick={toggleSidebar}
        >
          <LucideIcon name="ChevronsLeft" size={16} />
        </Button>
      </div>

      {/* Entity Panel Badge */}
      <div className="px-4 py-3 border-b border-[#E2E8F0]">
        <span className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide',
          badge.bg, badge.text
        )}>
          <span className={cn('h-1.5 w-1.5 rounded-full', badge.dot)} />
          {badge.label}
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5 scrollbar-thin scrollbar-thumb-[#E2E8F0] scrollbar-track-transparent">
        {items.map((item) => renderNavItem(item))}
      </div>

      {/* Footer — Profile + Actions */}
      <div className="border-t border-[#E2E8F0] p-3 space-y-1">
        {/* Profile Block */}
        <div className="flex items-center gap-3 rounded-xl p-3 bg-[#F8FAFC] border border-[#E2E8F0]">
          <div className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold shadow-sm',
            avatarClass
          )}>
            {profileName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-[#0F172A] truncate leading-tight">{profileName}</p>
            <p className="text-[11px] text-[#94A3B8] truncate">{profileRole}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-[#64748B] hover:bg-[#FEE2E2] hover:text-[#DC2626] transition-all duration-150"
        >
          <LucideIcon name="LogOut" size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] lg:hidden animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out lg:hidden',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:block shrink-0 h-screen sticky top-0 transition-all duration-300 ease-in-out overflow-hidden',
          sidebarOpen ? 'w-64' : 'w-0'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
export default Sidebar;
