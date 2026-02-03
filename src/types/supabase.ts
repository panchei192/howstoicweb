export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users_profile: {
                Row: {
                    id: string
                    username: string | null
                    display_name: string | null
                    avatar_url: string | null
                    avatar_path: string | null
                    avatar_updated_at: string
                    xp: number
                    level: number
                    created_at: string
                    updated_at: string
                    oro: number
                    equipped_frame: string | null
                    streak: number
                    last_active_date: string | null
                    equipped_theme: string | null
                }
                Insert: {
                    id: string
                    username?: string | null
                    display_name?: string | null
                    avatar_url?: string | null
                    avatar_path?: string | null
                    avatar_updated_at?: string
                    xp?: number
                    level?: number
                    created_at?: string
                    updated_at?: string
                    oro?: number
                    equipped_frame?: string | null
                    streak?: number
                    last_active_date?: string | null
                    equipped_theme?: string | null
                }
                Update: {
                    id?: string
                    username?: string | null
                    display_name?: string | null
                    avatar_url?: string | null
                    avatar_path?: string | null
                    avatar_updated_at?: string
                    xp?: number
                    level?: number
                    created_at?: string
                    updated_at?: string
                    oro?: number
                    equipped_frame?: string | null
                    streak?: number
                    last_active_date?: string | null
                    equipped_theme?: string | null
                }
            }
            levels: {
                Row: {
                    level: number
                    min_xp: number
                    title: string
                    badge: string | null
                }
                Insert: {
                    level: number
                    min_xp: number
                    title: string
                    badge?: string | null
                }
                Update: {
                    level?: number
                    min_xp?: number
                    title?: string
                    badge?: string | null
                }
            }
            challenges: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    xp_reward: number
                    difficulty: number
                    is_active: boolean
                    starts_at: string | null
                    ends_at: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    xp_reward?: number
                    difficulty?: number
                    is_active?: boolean
                    starts_at?: string | null
                    ends_at?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    xp_reward?: number
                    difficulty?: number
                    is_active?: boolean
                    starts_at?: string | null
                    ends_at?: string | null
                    created_at?: string
                }
            }
            user_challenges: {
                Row: {
                    id: string
                    user_id: string
                    challenge_id: string
                    status: Database['public']['Enums']['challenge_status']
                    evidence: Json | null
                    completed_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    challenge_id: string
                    status?: Database['public']['Enums']['challenge_status']
                    evidence?: Json | null
                    completed_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    challenge_id?: string
                    status?: Database['public']['Enums']['challenge_status']
                    evidence?: Json | null
                    completed_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            xp_ledger: {
                Row: {
                    id: string
                    user_id: string
                    source_type: Database['public']['Enums']['xp_source_type']
                    source_id: string | null
                    xp_delta: number
                    note: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    source_type?: Database['public']['Enums']['xp_source_type']
                    source_id?: string | null
                    xp_delta: number
                    note?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    source_type?: Database['public']['Enums']['xp_source_type']
                    source_id?: string | null
                    xp_delta?: number
                    note?: string | null
                    created_at?: string
                }
            }
            referral_codes: {
                Row: {
                    user_id: string
                    code: string
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    user_id: string
                    code: string
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    user_id?: string
                    code?: string
                    is_active?: boolean
                    created_at?: string
                }
            }
            referral_redemptions: {
                Row: {
                    id: string
                    referrer_user_id: string
                    referred_user_id: string
                    code: string
                    reward_xp: number
                    status: Database['public']['Enums']['referral_status']
                    created_at: string
                }
                Insert: {
                    id?: string
                    referrer_user_id: string
                    referred_user_id: string
                    code: string
                    reward_xp?: number
                    status?: Database['public']['Enums']['referral_status']
                    created_at?: string
                }
                Update: {
                    id?: string
                    referrer_user_id?: string
                    referred_user_id?: string
                    code?: string
                    reward_xp?: number
                    status?: Database['public']['Enums']['referral_status']
                    created_at?: string
                }
            }
            discount_codes: {
                Row: {
                    id: string
                    code: string
                    type: Database['public']['Enums']['discount_type']
                    value: number
                    starts_at: string | null
                    ends_at: string | null
                    max_uses: number | null
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    code: string
                    type: Database['public']['Enums']['discount_type']
                    value: number
                    starts_at?: string | null
                    ends_at?: string | null
                    max_uses?: number | null
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    code?: string
                    type?: Database['public']['Enums']['discount_type']
                    value?: number
                    starts_at?: string | null
                    ends_at?: string | null
                    max_uses?: number | null
                    is_active?: boolean
                    created_at?: string
                }
            }
            user_discount_redemptions: {
                Row: {
                    id: string
                    user_id: string
                    discount_code_id: string
                    used_at: string
                    order_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    discount_code_id: string
                    used_at?: string
                    order_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    discount_code_id?: string
                    used_at?: string
                    order_id?: string | null
                    created_at?: string
                }
            }
            user_inventory: {
                Row: {
                    id: string
                    user_id: string
                    item_id: string
                    item_type: string
                    acquired_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    item_id: string
                    item_type: string
                    acquired_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    item_id?: string
                    item_type?: string
                    acquired_at?: string
                }
            }
            achievements: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    icon: string | null
                    target: number
                    reward_oro: number
                    reward_xp: number
                }
                Insert: {
                    id: string
                    title: string
                    description?: string | null
                    icon?: string | null
                    target?: number
                    reward_oro?: number
                    reward_xp?: number
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    icon?: string | null
                    target?: number
                    reward_oro?: number
                    reward_xp?: number
                }
            }
            user_achievements: {
                Row: {
                    id: string
                    user_id: string
                    achievement_id: string
                    progress: number
                    completed: boolean
                    completed_at: string | null
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    achievement_id: string
                    progress?: number
                    completed?: boolean
                    completed_at?: string | null
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    achievement_id?: string
                    progress?: number
                    completed?: boolean
                    completed_at?: string | null
                    updated_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            add_xp: {
                Args: {
                    _user_id: string
                    _xp_delta: number
                    _source_type: Database['public']['Enums']['xp_source_type']
                    _source_id: string
                    _note?: string
                }
                Returns: void
            }
            redeem_referral_code: {
                Args: {
                    _code: string
                    _referred_user_id?: string
                }
                Returns: Database['public']['Tables']['referral_redemptions']['Row']
            }
            complete_challenge: {
                Args: {
                    _challenge_id: string
                    _user_id?: string
                }
                Returns: Database['public']['Tables']['user_challenges']['Row']
            }
            level_from_xp: {
                Args: {
                    _xp: number
                }
                Returns: number
            }
        }
        Enums: {
            challenge_status: 'started' | 'submitted' | 'completed' | 'rejected'
            referral_status: 'pending' | 'approved' | 'rejected'
            discount_type: 'percent' | 'fixed'
            xp_source_type: 'challenge' | 'referral' | 'streak' | 'admin' | 'purchase' | 'other'
        }
    }
}
