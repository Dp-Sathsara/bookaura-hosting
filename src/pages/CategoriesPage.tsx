import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import BookCard from "@/components/BookCard";
import { useBookStore } from "@/store/useBookStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "../components/ui/select";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Filter, X, Search, ArrowLeft } from "lucide-react";

const INITIAL_CATEGORIES = [
    "Fiction",
    "Non-Fiction",
    "Educational (O/L, A/L)",
    "Children's Books",
    "Religious & Spiritual",
    "Academic & Professional",
    "Languages & Literature",
    "Literature",
    "Productivity",
    "Self-Help",
    "Hobbies",
    "Magazines"
];

const CategoriesPage = () => {
    const { books } = useBookStore();
    const [searchParams] = useSearchParams();
    const initialCategory = searchParams.get("category");

    // Dynamic Categories from Store + Initial
    const categories = useMemo(() => {
        const bookCategories = books.map(b => b.category);
        return Array.from(new Set([...INITIAL_CATEGORIES, ...bookCategories])).sort();
    }, [books]);

    // State
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        initialCategory ? [initialCategory] : []
    );
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [authorSearch, setAuthorSearch] = useState("");
    const [sortOption, setSortOption] = useState("newest");
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    // Filter Logic
    const filteredBooks = useMemo(() => {
        return books.filter((book) => {
            // 1. Category Filter
            if (selectedCategories.length > 0) {
                // Simple case-insensitive check. Real app might need exactID match.
                // Also handling the "Educational" split if needed, but for now exact match or partial match on category string.
                const matchesCategory = selectedCategories.some(cat =>
                    book.category.toLowerCase().includes(cat.toLowerCase())
                );
                if (!matchesCategory) return false;
            }

            // 2. Price Filter
            if (book.price < priceRange[0] || book.price > priceRange[1]) {
                return false;
            }

            // 3. Author Filter
            if (authorSearch.length > 0) {
                if (!book.author.toLowerCase().includes(authorSearch.toLowerCase())) {
                    return false;
                }
            }

            return true;
        }).sort((a, b) => {
            // Sorting
            if (sortOption === "price-asc") return a.price - b.price;
            if (sortOption === "price-desc") return b.price - a.price;
            // Default 'newest' (assuming higher ID = newer for this demo)
            const aId = typeof a.id === 'string' ? parseInt(a.id) : a.id;
            const bId = typeof b.id === 'string' ? parseInt(b.id) : b.id;
            return bId - aId;
        });
    }, [selectedCategories, priceRange, authorSearch, sortOption]);

    // Handlers
    const toggleCategory = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    const clearFilters = () => {
        setSelectedCategories([]);
        setPriceRange([0, 10000]);
        setAuthorSearch("");
        setSortOption("newest");
    };

    // Sidebar Component (Reusable for Desktop & Mobile)
    const FilterSidebar = () => (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Filters</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-destructive hover:text-destructive/90 text-xs uppercase font-bold">
                    Clear All
                </Button>
            </div>

            {/* Author Search */}
            <div className="space-y-3">
                <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Author</Label>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search author..."
                        value={authorSearch}
                        onChange={(e) => setAuthorSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            {/* Price Range */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Price Range (LKR)</Label>
                </div>

                {/* Min/Max Input Fields */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label htmlFor="min-price" className="text-xs font-semibold text-muted-foreground">Min</Label>
                        <Input
                            id="min-price"
                            type="number"
                            min={0}
                            max={10000}
                            value={priceRange[0]}
                            onChange={(e) => {
                                const value = parseInt(e.target.value) || 0;
                                const newMin = Math.max(0, Math.min(value, priceRange[1]));
                                setPriceRange([newMin, priceRange[1]]);
                            }}
                            className="h-9 text-sm font-mono"
                            placeholder="0"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="max-price" className="text-xs font-semibold text-muted-foreground">Max</Label>
                        <Input
                            id="max-price"
                            type="number"
                            min={0}
                            max={10000}
                            value={priceRange[1]}
                            onChange={(e) => {
                                const value = parseInt(e.target.value) || 10000;
                                const newMax = Math.min(10000, Math.max(value, priceRange[0]));
                                setPriceRange([priceRange[0], newMax]);
                            }}
                            className="h-9 text-sm font-mono"
                            placeholder="10000"
                        />
                    </div>
                </div>

                {/* Slider */}
                <div className="pt-2">
                    <Slider
                        defaultValue={[0, 10000]}
                        max={10000}
                        min={0}
                        step={10}
                        value={priceRange}
                        onValueChange={setPriceRange}
                        className="mt-2"
                    />
                    <div className="flex justify-between mt-1.5">
                        <span className="text-xs text-muted-foreground font-mono">0</span>
                        <span className="text-xs text-muted-foreground font-mono">10,000</span>
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="space-y-3">
                <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Categories</Label>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                    {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-3 group">
                            <Checkbox
                                id={category}
                                checked={selectedCategories.includes(category)}
                                onCheckedChange={() => toggleCategory(category)}
                            />
                            <label
                                htmlFor={category}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                                {category}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background font-sans">
            <div className="container mx-auto px-4 py-8">

                {/* Header & Mobile Toggle */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <Button
                            variant="ghost"
                            className="pl-0 mb-4 hover:bg-transparent hover:text-primary font-bold text-muted-foreground text-md"
                            onClick={() => window.history.back()}
                        >
                            <ArrowLeft className="mr-2 h-5 w-5" /> Back
                        </Button>
                        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic">
                            All <span className="text-primary">Categories</span>
                        </h1>
                        <p className="text-muted-foreground font-medium mt-1">Found {filteredBooks.length} books</p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        {/* Mobile Filter Trigger */}
                        <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="md:hidden flex-1">
                                    <Filter className="mr-2 h-4 w-4" /> Filters
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                                <SheetHeader className="mb-6">
                                    <SheetTitle className="text-left uppercase font-black italic text-2xl">Refine Search</SheetTitle>
                                </SheetHeader>
                                <FilterSidebar />
                            </SheetContent>
                        </Sheet>

                        {/* Sort Dropdown */}
                        <Select value={sortOption} onValueChange={setSortOption}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest Arrivals</SelectItem>
                                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Desktop Sidebar */}
                    <aside className="hidden md:block w-72 flex-shrink-0 sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto pr-4 no-scrollbar">
                        <FilterSidebar />
                    </aside>

                    {/* Book Grid */}
                    <section className="flex-1">
                        <AnimatePresence mode="popLayout">
                            {filteredBooks.length > 0 ? (
                                <motion.div
                                    layout
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                >
                                    {filteredBooks.map((book) => (
                                        <motion.div
                                            key={book.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <BookCard {...book} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center py-20 text-center"
                                >
                                    <div className="bg-muted p-6 rounded-full mb-4">
                                        <X className="h-12 w-12 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-xl font-bold text-muted-foreground">No books match your criteria.</h3>
                                    <Button
                                        variant="link"
                                        onClick={clearFilters}
                                        className="text-primary font-bold mt-2"
                                    >
                                        Clear all filters
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </section>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </div>
    );
};

export default CategoriesPage;
