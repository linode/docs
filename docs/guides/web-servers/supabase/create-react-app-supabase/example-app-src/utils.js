// Import the module for client creation from the Supabase SDK.
import { createClient } from '@supabase/supabase-js'

// Set variables for your Supabase connection. Replace supabaseUrl with the
// API address for your instance, and replace supabaseAnonKey with the anon
// key for your instance.
const supabaseUrl = 'http://192.0.2.0:8000';
const supabaseAnonKey = 'example-supabase-anon-key';

console.log(supabaseUrl);
console.log(supabaseAnonKey);

// Create the Supabase client.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

