import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://izqpyjkyyskbxkrkqnfk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6cXB5amt5eXNrYnhrcmtxbmZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NTQ4MzQsImV4cCI6MjA5MTEzMDgzNH0.k5MZ0v6iUzFrz3yMVwmw_R3OMt4ZOg_hiNauzCKgm7g';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
