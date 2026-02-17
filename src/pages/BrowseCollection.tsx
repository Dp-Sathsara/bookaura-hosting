import { useState } from "react";
import BookCard from "@/components/BookCard";
import { useBookStore } from "@/store/useBookStore";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const BrowseCollection = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const { books } = useBookStore();

    const filteredBooks = books.filter((book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter italic">Browse Collection</h1>
                    <p className="text-muted-foreground">Explore our entire library of {books.length} books</p>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by title, author, or category..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {filteredBooks.map((book) => (
                    <BookCard key={book.id} {...book} />
                ))}
                {filteredBooks.length === 0 && (
                    <div className="col-span-full text-center py-20 text-muted-foreground">
                        No books found using "{searchQuery}".
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrowseCollection;
