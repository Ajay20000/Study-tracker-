class SupabaseDataInfrastructureBroker {
    constructor() {
        this.client = null;
    }

    hasSavedCredentials() {
        return localStorage.getItem('core_credentials_supabase_url') && 
               localStorage.getItem('core_credentials_supabase_anon_key');
    }

    saveCredentials(url, anonKey, userName) {
        localStorage.setItem('core_credentials_supabase_url', url);
        localStorage.setItem('core_credentials_supabase_anon_key', anonKey);
        localStorage.setItem('ssc_user_profile_name', userName);
    }

    getSavedCredentials() {
        return {
            url: localStorage.getItem('core_credentials_supabase_url'),
            anonKey: localStorage.getItem('core_credentials_supabase_anon_key'),
            userName: localStorage.getItem('ssc_user_profile_name') || 'Warrior'
        };
    }

    clearCredentials() {
        localStorage.removeItem('core_credentials_supabase_url');
        localStorage.removeItem('core_credentials_supabase_anon_key');
        localStorage.removeItem('ssc_user_profile_name');
    }

    initializeClient() {
        const credentials = this.getSavedCredentials();
        if (!credentials.url || !credentials.anonKey) return null;
        
        this.client = window.supabase.createClient(credentials.url, credentials.anonKey, {
            auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
        });
        return this.client;
    }

    async fetchTableRecords(tableName) {
        if (!this.client) return [];
        try {
            const { data, error } = await this.client
                .from(tableName)
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data || [];
        } catch (err) {
            console.error(`Database layer fetch crash for table [${tableName}]:`, err);
            return [];
        }
    }
}

export const supabaseService = new SupabaseDataInfrastructureBroker();
