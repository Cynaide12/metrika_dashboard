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
  last_visit: string;
  first_visit: string;
  is_online: boolean;
  sessions_count: number;
}

// type RecordEvent struct {
// 	ID        uint           `json:"id"`
// 	SessionID uint           `json:"session_id"`
// 	Type      int            `json:"type"`
// 	Timestamp int64          `json:"timestamp"`
// 	Data      map[string]any `json:"data"`
// }
export declare interface RecordEvent {
  id: number;
  session_id: number;
  type: number;
  timestamp: number;
  data: any;
}
