import type { ReactNode } from "react";

export type LayoutProps = {
  children: ReactNode;
};

export interface LayoutComponentProps {
  className?: string;
}

export interface RootLayoutProps extends LayoutProps {}

export interface User {
  id: number;
  name?: string;
  email?: string;
  role: "admin" | "employee";
}

export interface UserAwareProps {
  userName: string;
}

export interface NavLink {
  href: string;
  label: string;
  icon?: ReactNode;
}

export interface SidebarProps {
  title: string;
  links: NavLink[];
  onLogout: () => void;
}

export interface NavbarProps {
  title: string;
  userName: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  showTranslate?: boolean;
  showLogo?: boolean;
}

export interface PageProps {}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequireSome<T, K extends keyof T> = T & Required<Pick<T, K>>;