import type { SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_CONFIG: { url: string; anonKey: string };
export const SUPABASE_URL: string;
export const SUPABASE_ANON_KEY: string;
export const supabase: SupabaseClient;

export function getEtablissementsCount(): Promise<number>;
export function getCountByGovernorate(): Promise<Record<string, number>>;
export function getLatestEtablissements(limit?: number): Promise<Record<string, unknown>[]>;
export function searchEducation(params: { keyword?: string; city?: string; quick?: string | null; pageCategorie?: string | null }): Promise<Record<string, unknown>[]>;
export function searchTeachers(params: { keyword?: string; city?: string }): Promise<Record<string, unknown>[]>;
export function addTeacher(payload: Record<string, unknown>): Promise<{ data?: Record<string, unknown>; error: { message: string } | null }>;
export function searchEtablissements(params: { keyword?: string; city?: string; category?: string }): Promise<Record<string, unknown>[]>;
export function searchHealthEstablishments(params: { keyword?: string; city?: string; type?: string | null }): Promise<Record<string, unknown>[]>;
export function getFeaturedEvents(limit?: number): Promise<Record<string, unknown>[]>;
