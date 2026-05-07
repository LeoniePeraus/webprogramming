// shared interfaces

export interface User {
    id: string;
    name: string;
    group_id: string;
}

export interface ChatMessage {
    sender_id: string;
    receiver_id: string;
    message: string;
    timestamp?: number;
}