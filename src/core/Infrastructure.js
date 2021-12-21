import { createClient } from "@supabase/supabase-js";

const host = process.env.REACT_APP_SUPABASE_API_HOST;
const key = process.env.REACT_APP_SUPABASE_API_KEY;

export default createClient(host, key);