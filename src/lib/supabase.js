// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5ZnlsdXd2aXFzaG9zanRpZ3d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1MzQzNTEsImV4cCI6MjA1ODExMDM1MX0.GmqrtN6tBMOY4Mcz5OoxPN0cG0CNqE4Wu4j4-8Mm0F0";
const supabaseUrl = "https://hyfyluwviqshosjtigwz.supabase.co";

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
