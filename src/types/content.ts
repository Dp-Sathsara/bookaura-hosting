export interface Review {
    id: string;
    user: string;
    rating: number;
    comment: string;
    bookId: number;
    date: string;
    status: 'pending' | 'approved' | 'rejected';
}

export interface Article {
    id: string;
    title: string;
    content: string;
    author: string;
    date: string;
    status: 'draft' | 'published';
    image: string;
}

export interface ContactMessage {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    date: string;
}
