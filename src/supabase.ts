import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jbfhizrupybnzregbrmm.supabase.co' // Replace with your Project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpiZmhpenJ1cHlibnpyZWdicm1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MDEwMjMsImV4cCI6MjA3MDE3NzAyM30.92mb518HgyJKxHOKlNMy-wauBqzQtoXZrtjAyhhkTtI' // Replace with your API Key

export const supabase = createClient(supabaseUrl, supabaseKey)