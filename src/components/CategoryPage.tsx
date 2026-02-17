import { useParams, useNavigate } from "react-router-dom";
import { BOOKS } from "@/data/books";
import BookCard from "./BookCard";
import { Button } from "./ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Badge } from "./ui/badge";

const CategoryPage = () => {
  const { category } = useParams(); // URL එකෙන් category නම ගන්නවා
  const navigate = useNavigate();

  // URL එකේ තියෙන category එකට ගැලපෙන පොත් ටික ෆිල්ටර් කරගන්නවා
  // (Case insensitive: Fiction = fiction)
  const filteredBooks = BOOKS.filter(
    (book) => book.category.toLowerCase() === category?.toLowerCase()
  );

  // Category නම මුල් අකුර Capital කරලා ලස්සනට පෙන්වන්න
  const formattedCategory = category 
    ? category.charAt(0).toUpperCase() + category.slice(1) 
    : "All";

  return (
    <div className="container mx-auto px-4 py-16 font-sans">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <Button 
            variant="ghost" 
            className="pl-0 mb-2 hover:bg-transparent hover:text-primary font-bold text-muted-foreground"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
          
          <div className="flex items-center gap-3">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground uppercase italic leading-none">
              {formattedCategory} <span className="text-primary">Books</span>
            </h2>
          </div>
          <p className="text-muted-foreground mt-2 text-lg font-medium">
            Explore our curated collection of {formattedCategory} books.
          </p>
        </div>

        <Badge variant="secondary" className="font-bold px-4 py-2 text-md">
          {filteredBooks.length} results found
        </Badge>
      </div>

      {/* 2. Grid Section (Books) */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} {...book} />
          ))}
        </div>
      ) : (
        // පොත් නැති වුණොත් පෙන්වන Empty State එක
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="bg-muted p-6 rounded-full">
            <BookOpen className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-black text-muted-foreground">No Books Found</h3>
          <p className="text-muted-foreground">
            Sorry, we couldn't find any books in the <b>{formattedCategory}</b> category.
          </p>
          <Button onClick={() => navigate("/")} className="font-bold mt-4">
            Browse All Books
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;