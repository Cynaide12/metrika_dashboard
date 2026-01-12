export declare interface GuestSession {
  id: number;
  guest_id: number;
  ip_address: string;
  active: boolean;
  end_time?: string;
  last_active: string;
}

export declare interface Guest {
  id: number;
  f_id: number;
  domain_id: number;
  total_seconds_on_site: number;
  last_visit: string;
  first_visit: string;
  is_online: boolean;
  sessions_count: number;
}
