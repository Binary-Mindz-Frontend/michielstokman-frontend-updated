import { LucideIcon } from 'lucide-react';
import { IconType } from 'react-icons/lib';
import { superAdminRoutes } from './superAdminRoutes';
import { userRoutes } from './userRoutes';

// ===============> Super Admin dashboard <==================
// http://localhost:3000/dashboard/super-admin/overview

// ===============> User dashboard <==================
// http://localhost:3000/dashboard/user/overview

export interface SidebarItem {
  title: string;
  url: string;
  icon?: LucideIcon | IconType;
}

export interface ISidebarSection {
  title?: string;
  url?: string;
  icon?: LucideIcon | IconType;
  items?: SidebarItem[];
}

export interface ISidebarConfig {
  user: ISidebarSection[];
  'super-admin': ISidebarSection[];
}

export const sidebarConfig: ISidebarConfig = {
  user: userRoutes,
  'super-admin': superAdminRoutes,
};
