import { create } from 'zustand';
import { api, getAllBooks, updateBook, deleteBook } from '@/services/api';
import { type Book } from '@/types/book';

interface BookStore {
    books: Book[];
    isLoading: boolean;
    error: string | null;
    fetchBooks: () => Promise<void>;
    addBook: (book: FormData | Omit<Book, 'id'>) => Promise<void>;
    updateBook: (id: string | number, updates: Partial<Book>) => Promise<void>;
    deleteBook: (id: string | number) => Promise<void>;
}

export const useBookStore = create<BookStore>((set) => ({
    books: [],
    isLoading: false,
    error: null,

    fetchBooks: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await getAllBooks();
            set({ books: data, isLoading: false });
        } catch (error) {
            console.error("Failed to fetch books:", error);
            set({ error: "Failed to fetch books", isLoading: false });
        }
    },

    addBook: async (bookData) => {
        set({ isLoading: true, error: null });
        try {
            // Using api instance directly to handle FormData headers if needed
            // For FormData, usually letting browser set Content-Type is best, effectively removing it from defaults
            // But preserving existing login of explicitly setting it if it worked before, 
            // OR relying on axios to override if passed FormData.
            // Let's use specific config to be safe and match previous implementation pattern but using 'api' instance

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const response = await api.post('/books', bookData, config);

            set((state) => ({
                books: [response.data, ...state.books],
                isLoading: false
            }));
        } catch (error) {
            console.error("Failed to add book:", error);
            set({ error: "Failed to add book", isLoading: false });
        }
    },

    updateBook: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
            const data = await updateBook(id, updates);
            set((state) => ({
                books: state.books.map((book) =>
                    // Check both string/number id types as legacy code might handle both
                    (String(book.id) === String(id) || String((book as any)._id) === String(id)) ? data : book
                ),
                isLoading: false
            }));
        } catch (error) {
            console.error("Failed to update book:", error);
            set({ error: "Failed to update book", isLoading: false });
        }
    },

    deleteBook: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await deleteBook(id);
            set((state) => ({
                books: state.books.filter((book) => String(book.id) !== String(id) && String((book as any)._id) !== String(id)),
                isLoading: false
            }));
        } catch (error) {
            console.error("Failed to delete book:", error);
            set({ error: "Failed to delete book", isLoading: false });
        }
    },
}));
