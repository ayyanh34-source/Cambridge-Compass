import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eboeonqtxjfztlwyrlfi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVib2VvbnF0eGpmenRsd3lybGZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NTI2MTIsImV4cCI6MjA2NTQyODYxMn0.YOUR_ACTUAL_ANON_KEY_HERE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)