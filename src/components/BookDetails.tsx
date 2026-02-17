import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, ShoppingCart, Check, Plus, Minus, CreditCard } from "lucide-react";
import { useCartStore } from "@/store/userCartStore";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import BookCard from "./BookCard";
import BookReviews from "./BookReviews";
import axios from "axios";

// Define the Book interface locally or import it, but it must handle _id
interface Book {
  _id: string;
  id: number | string;
  title: string;
  author: string;
  price: number;
  originalPrice: number;
  category: string;
  image: string;
  description: string;
  rating: number;
  soldCount: number;
  stock: number;
}

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCartStore();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [relatedBooks, setRelatedBooks] = useState<any[]>([]); // Using any[] for now to facilitate quicker refactor, ideally explicit typing should be used

  useEffect(() => {
    window.scrollTo(0, 0);
    setQuantity(1);

    const fetchBook = async () => {
      if (!id) {
        setError("Invalid Book ID");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      try {
        // Try fetching using axios
        const response = await axios.get(`http://localhost:8080/api/books/${id}`);
        setBook(response.data);

        // Fetch related books
        try {
          const allBooksResponse = await axios.get('http://localhost:8080/api/books');
          const allBooks = allBooksResponse.data;
          const currentBook = response.data;
          const related = allBooks.filter(
            (b: any) => (b.category === currentBook.category || b.author === currentBook.author) && b._id !== currentBook._id
          ).slice(0, 5);
          setRelatedBooks(related);
        } catch (relatedError) {
          console.error("Error fetching related books", relatedError);
        }

      } catch (err: any) {
        console.error("Error fetching book:", err);
        setError("Book not found or server error");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleAddToCart = () => {
    if (book) {
      // Adapter for cart store which expects specific fields
      // Ensure we map _id or id correctly
      addToCart({
        id: book.id || book._id,
        title: book.title,
        author: book.author,
        price: book.price,
        image: book.image
      }, quantity);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  const handleBuyNow = () => {
    if (book) {
      addToCart({
        id: book.id || book._id,
        title: book.title,
        author: book.author,
        price: book.price,
        image: book.image
      }, quantity);
      navigate("/checkout");
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
      setQuantity(1);
    } else if (book && value > book.stock) {
      setQuantity(book.stock); // Cap at available stock
    } else {
      setQuantity(value);
    }
  };

  const increaseQty = () => {
    if (book && quantity < book.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-bold">Loading Book Details...</h2>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold">{error || "Book not found!"}</h2>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 animate-in slide-in-from-right-10 fade-in duration-300 ease-in-out font-sans">

      <Button variant="ghost" className="mb-6 gap-2 hover:bg-muted/50 font-bold" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16">
        <div className="flex justify-center bg-muted/20 rounded-2xl p-8 items-center border shadow-inner">
          <img
            src={book.image}
            alt={book.title}
            className="w-full max-w-[280px] md:max-w-[320px] shadow-2xl rounded-lg transform hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Badge className="px-3 py-1 text-xs font-black uppercase tracking-widest" variant="secondary">
              {book.category}
            </Badge>
            {/* ✅ Book Name: italic අයින් කළා (removed italic) */}
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-foreground leading-tight uppercase">
              {book.title}
            </h1>
            <p className="text-lg text-muted-foreground font-medium italic">by {book.author}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.floor(book.rating || 4) ? "fill-current" : "text-muted"}`} />
              ))}
            </div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">({book.soldCount || 100}+ sold)</span>
          </div>

          <div className="text-3xl font-black text-primary tracking-tighter">
            Rs. {book.price.toLocaleString()}
          </div>

          <p className="text-muted-foreground leading-relaxed text-base font-medium">
            {book.description || "No description available."}
          </p>

          <div className="space-y-5 pt-2">
            <div className="flex items-center gap-3">
              <span className="font-bold uppercase text-xs tracking-widest text-muted-foreground">Qty</span>
              {/* ✅ Quantity Selector with Input Field */}
              <div className="flex items-center border-2 rounded-lg overflow-hidden bg-muted/30">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-none hover:bg-background"
                  onClick={decreaseQty}
                  disabled={book.stock === 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  max={book.stock}
                  disabled={book.stock === 0}
                  className="w-14 text-center font-bold text-base bg-transparent border-none focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-none hover:bg-background"
                  onClick={increaseQty}
                  disabled={book.stock === 0 || quantity >= book.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {/* Stock Display */}
              {book.stock === 0 ? (
                <span className="text-red-600 text-sm font-bold">Out of Stock</span>
              ) : (
                <span className="text-red-600 text-sm font-medium">
                  ({book.stock} left in stock)
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className={`flex-1 h-12 flex items-center justify-center gap-2 text-sm font-black uppercase tracking-widest rounded-xl transition-all duration-300 shadow-lg text-white ${book.stock === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : isAdded
                      ? "bg-green-600 shadow-green-200"
                      : "bg-primary shadow-primary/20 hover:opacity-90"
                  }`}
                onClick={handleAddToCart}
                disabled={book.stock === 0}
              >
                {isAdded ? (
                  <>
                    <Check className="h-4 w-4 animate-in zoom-in" /> Added
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" /> Add to Cart
                  </>
                )}
              </button>

              <button
                className={`flex-1 h-12 flex items-center justify-center gap-2 text-sm font-black uppercase tracking-widest border-2 rounded-xl transition-all duration-300 ${book.stock === 0
                    ? "border-gray-400 text-gray-400 cursor-not-allowed"
                    : "border-primary text-primary hover:bg-primary hover:text-white"
                  }`}
                onClick={handleBuyNow}
                disabled={book.stock === 0}
              >
                <CreditCard className="h-4 w-4" /> Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <BookReviews
        bookId={id!}
        bookTitle={book.title}
        bookImage={book.image}
      />

      {
        relatedBooks.length > 0 && (
          <div className="border-t border-primary/10 pt-12">
            <h3 className="text-2xl font-black tracking-tighter mb-8 uppercase italic">You might also <span className="text-primary">like</span></h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {relatedBooks.map((relatedBook) => (
                <BookCard key={relatedBook._id || relatedBook.id} {...relatedBook} />
              ))}
            </div>
          </div>
        )
      }
    </div >
  );
};

export default BookDetails;