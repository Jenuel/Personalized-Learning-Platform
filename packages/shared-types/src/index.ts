
export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface AuthTokenPayload {
    id: string;
    email: string;
    iat?: number;
    exp?: number;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    message: string;
    token: string;
    user: Pick<User, 'id' | 'email' | 'name'>;
}


export interface Card {
    id: string;
    question: string;
    answer: string;
    userId: string;
    metadata?: CardMetadata;
    createdAt: Date;
    updatedAt: Date;
}

export interface CardMetadata {
    id: string;
    cardId: string;
    source?: string;
    tags?: string[];
    difficulty?: 'easy' | 'medium' | 'hard';
}

export interface CreateCardDto {
    question: string;
    answer: string;
    metadata?: Partial<CardMetadata>;
}

export interface UpdateCardDto {
    question?: string;
    answer?: string;
    metadata?: Partial<CardMetadata>;
}


export interface Assessment {
    id: string;
    userId: string;
    cardId: string;
    score: number;
    answeredAt: Date;
}


export interface GeneratedFlashcard {
    question: string;
    answer: string;
    source?: string;
}

export interface AutomationResponse {
    flashcards: GeneratedFlashcard[];
    status: 'success' | 'error';
    message?: string;
}


export interface ApiResponse<T = unknown> {
    data?: T;
    message?: string;
    error?: string;
    statusCode: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
