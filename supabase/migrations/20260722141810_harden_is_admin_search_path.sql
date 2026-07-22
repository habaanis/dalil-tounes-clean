-- Stabilise la résolution de public.admins utilisée par la politique RLS.
alter function public.is_admin() set search_path = public, pg_temp;
