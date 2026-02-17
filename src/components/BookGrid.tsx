import { Link } from "react-router-dom";
import BookCard from "./BookCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface BookGridProps {
    title: string;
    books: any[];
    categoryLink: string;
}

const BookGrid = ({ title, books, categoryLink }: BookGridProps) => {
    return (
        <div className="py-10 border-b border-border/10 animate-in fade-in slide-in-from-bottom-5 duration-1000">
            <div className="container mx-auto px-4">

                {/* Title Section */}
                <div className="flex justify-between items-end mb-8">
                    <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic text-foreground leading-none">
                        {title}
                    </h2>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {books.map((book) => (
                        <div key={book.id} className="h-full">
                            <BookCard {...book} />
                        </div>
                    ))}
                </div>

                {/* See More Link - Bottom Right */}
                <div className="flex justify-end mt-8">
                    <Link to={categoryLink}>
                        <Button
                            variant="link"
                            className="group/link text-primary font-black uppercase tracking-[0.2em] text-[10px] gap-2 hover:no-underline"
                        >
                            See Full Collection
                            <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BookGrid;
