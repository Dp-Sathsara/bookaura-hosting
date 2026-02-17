import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, TrendingDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/userCartStore";

interface BookCardProps {
  _id?: string; // ✅ Added _id for MongoDB
  id: number | string; // Allow string IDs too
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  category: string;
  image?: string;
  rating?: number;
  soldCount?: number;
}

const BookCard = ({
  _id, id, title, author, price, originalPrice, category, image, rating, soldCount
}: BookCardProps) => {
  const { addToCart } = useCartStore();
  const navigate = useNavigate();

  // ✅ Use _id if available, otherwise fallback to id
  const bookId = _id || id;

  const savings = originalPrice ? originalPrice - price : 0;

  return (
    <Card className="group/card relative overflow-hidden border-none shadow-none hover:shadow-xl transition-all duration-300 bg-card rounded-xl flex flex-col h-full font-sans">

      {/* 1. Image Section */}
      <Link to={`/book/${bookId}`} className="block relative aspect-[2/3] overflow-hidden bg-muted">
        <img
          src={image || '/placeholder-book.jpg'}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover/card:scale-110"
        />

        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <Badge className="bg-primary text-primary-foreground border-none font-bold text-[10px] px-2 h-5 shadow-sm uppercase tracking-wider">
            {category}
          </Badge>
        </div>
      </Link>

      {/* 2. Content Section */}
      <CardContent className="p-3 flex-grow flex flex-col pb-4">
        {/* Book Title & Author */}
        <div className="mb-2">
          <Link to={`/book/${bookId}`}>
            {/* ✅ Title: font-black ඉවත් කර font-medium යෙදුවා */}
            <h3 className="font-medium text-lg leading-tight line-clamp-1 group-hover/card:text-primary transition-colors tracking-tight text-foreground">
              {title}
            </h3>
          </Link>
          <p className="text-[13px] font-medium text-muted-foreground mt-0.5 italic">By {author}</p>
        </div>

        {/* Rating & Sold Count */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center text-[#1A1A1A] dark:text-white">
            <Star className="h-3 w-3 fill-current text-[#FFA800]" />
            {/* Rating එකත් font-bold කළා (black නෙමෙයි) */}
            <span className="text-[12px] font-bold ml-0.5">{Number(rating || 0).toFixed(1)}</span>
          </div>
          <span className="text-[12px] text-muted-foreground font-medium">
            | {(soldCount || 0) > 1000 ? `${((soldCount || 0) / 1000).toFixed(1)}k+` : (soldCount || 0)}+ sold
          </span>
        </div>

        {/* Price Section */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-1 text-[#1A1A1A] dark:text-white">
            <span className="text-[12px] font-medium">LKR</span>
            {/* ✅ Price: font-black ඉවත් කර font-semibold යෙදුවා */}
            <span className="text-2xl font-semibold tracking-tighter italic leading-none">
              {price.toLocaleString()}
            </span>
          </div>

          {/* Savings logic */}
          {savings > 0 && (
            <div className="flex items-center gap-1 text-[#FF4747] font-bold text-[12px] mt-0.5">
              <TrendingDown className="h-3.5 w-3.5" />
              <span>Save LKR {savings.toLocaleString()}</span>
            </div>
          )}
        </div>
      </CardContent>

      {/* 3. Action Buttons (Hover Effect) */}
      <CardFooter className="p-3 absolute bottom-0 w-full bg-card/95 backdrop-blur-sm border-t opacity-0 translate-y-full group-hover/card:opacity-100 group-hover/card:translate-y-0 transition-all duration-300 ease-in-out flex flex-col gap-2 z-10">
        <Button
          onClick={() => addToCart({ id, title, author, price, image: image || '' })}
          className="w-full font-bold h-10 gap-2 bg-primary hover:bg-primary/90 rounded-full text-xs shadow-md active:scale-95 transition-all uppercase tracking-wider"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>

        <Button
          variant="outline"
          onClick={() => navigate(`/category/${category.toLowerCase()}`)}
          className="w-full font-bold h-10 gap-2 border-primary/40 text-primary hover:bg-primary/5 rounded-full text-xs active:scale-95 transition-all uppercase tracking-wider"
        >
          <Search className="h-4 w-4" />
          Similar Books
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookCard;