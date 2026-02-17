import { useState, useEffect, useRef } from "react";
import { Search, User, BookOpen, X, Package, Settings, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ✅ Correct Imports
import { ModeToggle } from "./mode-toggle";
import { CartDrawer } from "./CartDrawer";

import { useBookStore } from "@/store/useBookStore";
import { useAuth } from "@/context/AuthContext";

interface NavbarProps {
  setSearchQuery: (query: string) => void;
}

const Navbar = ({ setSearchQuery: _setSearchQuery }: NavbarProps) => {
  const { user, logout } = useAuth();
  const { books } = useBookStore();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Search Logic
  useEffect(() => {
    if (query.trim().length > 0) {
      const filtered = books.filter(book =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        book.keywords?.some((k: string) => k.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5);

      setSuggestions(filtered);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query, books]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = (bookId: number) => {
    setQuery("");
    setIsOpen(false);
    navigate(`/book/${bookId}`);
  };

  const handleBrowseCollection = () => {
    if (location.pathname === "/") {
      const element = document.getElementById("browse-collection");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/#browse-collection");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 font-sans">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 relative">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-black text-xl cursor-pointer tracking-tighter uppercase italic">
          <BookOpen className="h-6 w-6 text-primary" />
          <span>BOOK<span className="text-primary">AURA</span></span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center ml-6 gap-1">
          <Button
            variant="ghost"
            onClick={handleBrowseCollection}
            className="font-bold text-muted-foreground hover:text-primary uppercase tracking-wider text-xs"
          >
            Browse Collection
          </Button>

          <Link to="/categories">
            <Button
              variant="ghost"
              className="font-bold text-muted-foreground hover:text-primary uppercase tracking-wider text-xs"
            >
              Category
            </Button>
          </Link>



          <Link to="/articles">
            <Button
              variant="ghost"
              className="font-bold text-muted-foreground hover:text-primary uppercase tracking-wider text-xs"
            >
              Articles
            </Button>
          </Link>

          <Link to="/audio-books">
            <Button
              variant="ghost"
              className="font-bold text-muted-foreground hover:text-primary uppercase tracking-wider text-xs"
            >
              Audio Book
            </Button>
          </Link>

          <Link to="/faq">
            <Button
              variant="ghost"
              className="font-bold text-muted-foreground hover:text-primary uppercase tracking-wider text-xs"
            >
              FAQ
            </Button>
          </Link>

          <Link to="/about">
            <Button
              variant="ghost"
              className="font-bold text-muted-foreground hover:text-primary uppercase tracking-wider text-xs"
            >
              About Us
            </Button>
          </Link>

          <Link to="/contact">

            <Button
              variant="ghost"
              className="font-bold text-muted-foreground hover:text-primary uppercase tracking-wider text-xs"
            >
              Contact
            </Button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex relative w-full max-sm items-center mx-4" ref={dropdownRef}>
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search books..."
            className="pl-9 bg-muted/50 focus-visible:ring-primary shadow-none h-10 rounded-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length > 0 && setIsOpen(true)}
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); setIsOpen(false); }}
              className="absolute right-3 hover:text-primary transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}

          {/* SUGGESTION BOX */}
          {isOpen && suggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-card border rounded-xl shadow-2xl mt-2 overflow-hidden animate-in fade-in slide-in-from-top-2 z-[100]">
              <div className="p-2 text-[10px] font-bold text-muted-foreground border-b uppercase tracking-wider bg-muted/30">
                Quick Results
              </div>
              {suggestions.map((book) => (
                <div
                  key={book.id}
                  onClick={() => handleSuggestionClick(book.id)}
                  className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer border-b last:border-0 transition-colors group"
                >
                  <img src={book.image} alt={book.title} className="h-10 w-8 object-cover rounded shadow-sm group-hover:scale-105 transition-transform" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-foreground line-clamp-1">{book.title}</span>
                    <span className="text-xs text-muted-foreground">by {book.author}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 md:gap-2">
          <ModeToggle />

          <CartDrawer />

          {/* Auth Buttons / Profile */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full border border-border/50 ml-1 p-0 overflow-hidden">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${user.username}&background=random`} alt={user.username} />
                    <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 font-sans rounded-[1.2rem] shadow-2xl border-none" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-4">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-black uppercase italic tracking-tight leading-none">{user.username}</p>
                    <p className="text-[10px] font-bold leading-none text-muted-foreground uppercase tracking-widest mt-1">{user.role}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-muted" />

                <DropdownMenuItem
                  className="cursor-pointer font-bold uppercase text-[10px] tracking-widest py-3 focus:bg-primary/10 focus:text-primary"
                  onClick={() => navigate("/orders")}
                >
                  <Package className="mr-3 h-4 w-4" />
                  My Orders
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="cursor-pointer font-bold uppercase text-[10px] tracking-widest py-3 focus:bg-primary/10 focus:text-primary"
                  onClick={() => navigate("/profile")}
                >
                  <Settings className="mr-3 h-4 w-4" />
                  Profile Settings
                </DropdownMenuItem>

                {user.role === 'ADMIN' && (
                  <DropdownMenuItem
                    className="cursor-pointer font-bold uppercase text-[10px] tracking-widest py-3 focus:bg-primary/10 focus:text-primary"
                    onClick={() => navigate("/admin")}
                  >
                    <Settings className="mr-3 h-4 w-4" />
                    Admin Dashboard
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator className="bg-muted" />

                <DropdownMenuItem
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer font-black uppercase text-[10px] tracking-widest py-3"
                  onClick={logout}
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="hidden md:flex font-bold">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="font-bold">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;