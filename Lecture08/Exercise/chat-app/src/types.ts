// shared interfaces

export interface User {
    id: string;
    name: string;
    group_id: string;
}

export interface ChatMessage { // not used - maybe that's for next week
    sender_id: string;
    receiver_id: string;
    message: string;
    timestamp: number;
}