import { createClient } from '@supabase/supabase-js'

const supabaseUrl: string = "https://kwbqjjrhayaazdazthsw.supabase.co";
const supabaseAnonKey: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3YnFqanJoYXlhYXpkYXp0aHN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwMDM4OTcsImV4cCI6MjA1NTU3OTg5N30.lIYznzGryh0Qr-KR0A9lHzZEUF1bx_YgphoNUBMgXG8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);