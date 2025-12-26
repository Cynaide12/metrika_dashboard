export declare interface GuestSession {
    id: number;
    guest_id: number;
    ip_address: string;
    active: boolean;
    end_time?: string;
    last_active: string;
}