import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Review, Article, ContactMessage } from '../types/content';

interface ContentStore {
    reviews: Review[];
    articles: Article[];
    contacts: ContactMessage[];

    // Actions
    addReview: (review: Review) => void;
    updateReviewStatus: (id: string, status: 'approved' | 'rejected') => void;
    deleteReview: (id: string) => void;

    addArticle: (article: Article) => void;
    updateArticle: (article: Article) => void;
    deleteArticle: (id: string) => void;

    addContactMessage: (message: ContactMessage) => void;
    deleteContactMessage: (id: string) => void;
}

export const useContentStore = create<ContentStore>()(
    persist(
        (set) => ({
            reviews: [
                { id: '1', user: 'John Doe', rating: 5, comment: 'Great book!', bookId: 1, date: '2024-02-14', status: 'approved' },
                { id: '2', user: 'Jane Smith', rating: 4, comment: 'Enjoyed it.', bookId: 2, date: '2024-02-13', status: 'pending' },
            ],
            articles: [
                { id: '1', title: 'Top 10 Books of 2024', content: 'Here is the list...', author: 'Admin', date: '2024-01-01', status: 'published', image: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9vayUyMGNvdmVyfGVufDB8fDB8fHww' },
            ],
            contacts: [
                { id: '1', name: 'Alice', email: 'alice@example.com', subject: 'Inquiry', message: 'Do you ship internationally?', date: '2024-02-10' },
            ],

            addReview: (review) => set((state) => ({ reviews: [review, ...state.reviews] })),
            updateReviewStatus: (id, status) => set((state) => ({
                reviews: state.reviews.map((r) => r.id === id ? { ...r, status } : r)
            })),
            deleteReview: (id) => set((state) => ({ reviews: state.reviews.filter((r) => r.id !== id) })),

            addArticle: (article) => set((state) => ({ articles: [article, ...state.articles] })),
            updateArticle: (article) => set((state) => ({
                articles: state.articles.map((a) => a.id === article.id ? article : a)
            })),
            deleteArticle: (id) => set((state) => ({ articles: state.articles.filter((a) => a.id !== id) })),

            addContactMessage: (msg) => set((state) => ({ contacts: [msg, ...state.contacts] })),
            deleteContactMessage: (id) => set((state) => ({ contacts: state.contacts.filter((c) => c.id !== id) })),
        }),
        {
            name: 'content-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
