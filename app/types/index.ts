import type { ReactNode } from "react";

// ============================================
// Re-export React Types
// ============================================

/**
 * Re-export ReactNode for convenience
 * Represents all of the things React can render.
 * ReactElement only represents JSX, ReactNode represents everything that can be rendered.
 * @see https://react-typecript-cheatsheet.netlify.app/docs/types/react-node
 */
export type { ReactNode };
export type { ReactNode as ReactNodeType };

// ============================================
// Layout Types
// ============================================

/** Common props for all layout components */
export interface LayoutProps {
  children: ReactNode;
}

/** Root layout props */
export interface RootLayoutProps extends LayoutProps {
  // Additional props can be added here
}

// ============================================
// User Types
// ============================================

/** User data from localStorage */
export interface UserData {
  name?: string;
  email?: string;
  role: "admin" | "employee";
}

/** Prop for user-aware components */
export interface UserAwareProps {
  userName: string;
}

// ============================================
// Navigation Types
// ============================================

/** Navigation link structure */
export interface NavLink {
  href: string;
  label: string;
  icon?: ReactNode;
}

/** Sidebar component props */
export interface SidebarProps {
  title: string;
  links: NavLink[];
  onLogout: () => void;
}

/** Navbar component props */
export interface NavbarProps {
  title: string;
  userName: string;
}

// ============================================
// Page Props Types
// ============================================

/** Props for page components that don't accept children */
export interface PageProps {
  // Page components in Next.js App Router don't need props
}

/**
 * Example: Typing children
 * @example
 * type Props = { children: ReactNode }
 * const Component = ({ children }: Props) => <div>{children}</div>
 */

// ============================================
// Utility Types
// ============================================

/** Make all properties optional recursively */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/** Make specific properties required */
export type RequireSome<T, K extends keyof T> = T & Required<Pick<T, K>>;
