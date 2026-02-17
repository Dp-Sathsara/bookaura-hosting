import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import BookCard from "./BookCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface BookRowProps {
  title: string;
  books: any[];
  categoryLink: string;
  autoScrollDirection?: "left" | "right";
}

const BookRow = ({ title, books, categoryLink, autoScrollDirection = "left" }: BookRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    // තත්පර 5 කට වරක් 300px ප්‍රමාණයක් smooth විදියට scroll වේ.
    const interval = setInterval(() => {
      const scrollAmount = 300; 

      if (autoScrollDirection === "left") {
        if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 10) {
          scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
      } else {
        // දකුණට යන logic එක (Right to Left move)
        if (scrollContainer.scrollLeft <= 10) {
          scrollContainer.scrollTo({ left: scrollContainer.scrollWidth, behavior: "smooth" });
        } else {
          scrollContainer.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        }
      }
    }, 5000); 

    return () => clearInterval(interval);
  }, [autoScrollDirection]);

  return (
    <div className="py-10 border-b border-border/10 animate-in fade-in slide-in-from-bottom-5 duration-1000">
      <div className="container mx-auto px-4">
        
        {/* Title Section */}
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic text-foreground leading-none">
            {title}
          </h2>
        </div>

        {/* Scrollable Row Wrapper */}
        <div className="relative group">
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-6 scroll-smooth no-scrollbar"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch' 
            }}
          >
            {books.map((book) => (
              <div key={book.id} className="min-w-[220px] md:min-w-[280px] transition-transform duration-300 hover:z-10">
                <BookCard {...book} />
              </div>
            ))}
          </div>
          
          {/* See More Link - Bottom Right */}
          <div className="flex justify-end mt-2">
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

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default BookRow;