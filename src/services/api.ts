import axios from 'axios';
// Book type එක නැත්නම් any දාන්න හෝ type එක හදන්න
import type { Book } from '../types/book';

// --- Types ---
export interface User {
    id: string;
    username: string; // Backend sends 'username'
    email: string;
    role: string;
    token?: string;
    imageUrl?: string;
}

export interface Article {
    id: string;
    title: string;
    content: string;
    author: string;
    imageUrl?: string;
    publishedDate?: string;
    createdAt?: string;
}

export interface Message {
    id: string;
    title: string;
    content: string;
    messageBody: string;
    createdAt: string;
}

export interface Review {
    id: string;
    userId: string;
    userName: string;
    bookId: string;
    bookTitle?: string;
    bookImage?: string;
    rating: number;
    comment: string;
    adminReply?: string;
    date: string;
}

export interface FAQ {
    id: string;
    question: string;
    answer: string;
}

export interface ContactMessage {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    adminReply?: string;
    status: 'PENDING' | 'REPLIED';
    createdAt: string;
}


export interface AuthResponse {
    token: string;
    user: User; // Backend sends { token, user }
}

// --- Base API Configuration ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- Request Interceptor to add JWT Token ---
api.interceptors.request.use(
    (config) => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.token) {
                    config.headers.Authorization = `Bearer ${user.token}`;
                }
            } catch (e) {
                console.error("Error parsing user from localStorage", e);
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// --- 0. Authentication API (New Addition) ---
export const AuthService = {
    login: async (data: any) => {
        const response = await api.post<AuthResponse>('/auth/login', data);
        return response.data;
    },
    register: async (data: any) => {
        const response = await api.post<AuthResponse>('/auth/register', data);
        return response.data;
    },
    socialLogin: async (data: any) => {
        const response = await api.post<AuthResponse>('/auth/social-login', data);
        return response.data;
    },
    changePassword: async (data: any) => {
        const response = await api.post('/auth/change-password', data);
        return response.data;
    }
};

// --- 1. Articles API ---
export const ArticleService = {
    getAll: async () => {
        const response = await api.get<Article[]>('/articles');
        return response.data;
    },
    getById: async (id: string) => {
        const response = await api.get<Article>(`/articles/${id}`);
        return response.data;
    },
    create: async (data: any) => {
        const response = await api.post<Article>('/articles', data);
        return response.data;
    },
    update: async (id: string, data: any) => {
        const response = await api.put<Article>(`/articles/${id}`, data);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await api.delete(`/articles/${id}`);
        return response.data;
    },
};

// --- 2. Messages (Admin Announcements) API ---
export const MessageService = {
    getAll: async () => {
        const response = await api.get<Message[]>('/messages');
        return response.data;
    },
    create: async (data: any) => {
        const response = await api.post<Message>('/messages', data);
        return response.data;
    },
    update: async (id: string, data: any) => {
        const response = await api.put<Message>(`/messages/${id}`, data);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await api.delete(`/messages/${id}`);
        return response.data;
    },
};

// --- 3. Reviews API ---
export const ReviewService = {
    getAll: async () => {
        const response = await api.get<Review[]>('/reviews');
        return response.data;
    },
    getByBookId: async (bookId: string) => {
        const response = await api.get<Review[]>(`/reviews/book/${bookId}`);
        return response.data;
    },
    add: async (data: any) => {
        const response = await api.post<Review>('/reviews/add', data);
        return response.data;
    },
    getAllAdmin: async () => {
        const response = await api.get<Review[]>('/admin/reviews/all');
        return response.data;
    },
    deleteAdmin: async (id: string) => {
        const response = await api.delete(`/admin/reviews/${id}`);
        return response.data;
    },
    replyAdmin: async (id: string, adminReply: string) => {
        const response = await api.put<Review>(`/admin/reviews/reply/${id}`, { adminReply });
        return response.data;
    },
};


// --- 4. FAQ API ---
export const FAQService = {
    getAll: async () => {
        const response = await api.get<FAQ[]>('/faqs');
        return response.data;
    },
    create: async (data: any) => {
        const response = await api.post<FAQ>('/faqs', data);
        return response.data;
    },
    update: async (id: string, data: any) => {
        const response = await api.put<FAQ>(`/faqs/${id}`, data);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await api.delete(`/faqs/${id}`);
        return response.data;
    },
};

// --- 5. Contacts (Inquiries) API ---
export const ContactService = {
    getAllAdmin: async () => {
        const response = await api.get<ContactMessage[]>('/admin/contact/all');
        return response.data;
    },
    create: async (data: any) => {
        const response = await api.post<ContactMessage>('/contact/send', data);
        return response.data;
    },
    replyAdmin: async (id: string, reply: string) => {
        const response = await api.put<ContactMessage>(`/admin/contact/reply/${id}`, { reply });
        return response.data;
    },
    deleteAdmin: async (id: string) => {
        const response = await api.delete(`/admin/contact/${id}`);
        return response.data;
    },
};


// --- 6. User Management API ---
export const UserService = {
    getAll: async () => {
        const response = await api.get<User[]>('/users');
        return response.data;
    },

    updateRole: async (id: string, role: string) => {
        const response = await api.put<User>(`/users/${id}/role`, { role });
        return response.data;
    },

    delete: async (id: string) => {
        await api.delete(`/users/${id}`);
    },

    getById: async (id: string) => {
        const response = await api.get<User>(`/users/${id}`);
        return response.data;
    },

    updateProfile: async (id: string, data: any) => {
        const response = await api.put<User>(`/users/profile/${id}`, data);
        return response.data;
    }
};

// --- Books/Products (Legacy Support) ---
export const getAllBooks = async () => {
    const response = await api.get<Book[]>('/books');
    return response.data;
};

export const getBookById = async (id: number | string) => {
    const response = await api.get<Book>(`/books/${id}`);
    return response.data;
};

export const createBook = async (data: any) => {
    const response = await api.post<Book>('/books', data);
    return response.data;
};

export const updateBook = async (id: number | string, data: any) => {
    const response = await api.put<Book>(`/books/${id}`, data);
    return response.data;
};

export const deleteBook = async (id: number | string) => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
};

export default api;