import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    username: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    bio?: string
    firstname?: string | null
    lastname?: string | null
    cover?: string | null
    city?: string | null
    school?: string | null
    work?: string | null
    website?: string | null
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Post {
    id: number;
    user_id: number;
    description: string;
    image: string | null;
}

export interface Like {
    id: string;
    user_id: number;
    post_id: number
}

export interface Comment {
    id: number
    description: string
    user_id: number
    post_id: number
    user: User
}

export interface PostWithUser extends Post {
    user: User;
}

export interface PostWithUserLike extends PostWithUser {
    likes: Like[];
}

export interface PostWithUserLikeComment extends PostWithUserLike {
    comments: Comment[]
}