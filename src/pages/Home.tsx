import { useEffect } from "react";
import Hero from "@/components/Hero";
import BookRow from "@/components/BookRow";
import BookCard from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

// ✅ Swiper Imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import BookGrid from "@/components/BookGrid";



import { useBookStore } from "@/store/useBookStore";

const Home = () => {
  const { books, fetchBooks } = useBookStore();

  useEffect(() => {
    fetchBooks();
  }, []);

  // Filtering Logic for different sections
  const featuredBooks = books.filter(b => b.isFeatured).slice(0, 10); // Display featured books
  const newArrivals = [...books].reverse().slice(0, 12);
  const fictionBooks = books.filter(b => b.category === "Fiction").slice(0, 12);
  const childrenBooks = books.filter(b => b.category === "Children").slice(0, 12);
  const novelsBooks = books.filter(b => b.category === "Novels").slice(0, 12);

  return (
    <div className="bg-background min-h-screen pb-20 font-sans">
      {/* 1. Hero Section */}
      <Hero />

      <main className="container mx-auto px-4 py-16 font-sans">
        {/* Featured Books Carousel Section */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground uppercase italic leading-none">
              Featured Books
            </h2>
            <p className="text-muted-foreground mt-2 text-lg font-medium">Handpicked favorites just for you</p>
          </div>
          <Badge variant="outline" className="hidden sm:flex font-black px-4 py-1.5 border-primary/20 text-primary text-sm uppercase tracking-wider">
            {featuredBooks.length} items found
          </Badge>
        </div>

        {/* ✅ Swiper Carousel */}
        <div className="mb-20">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={true}
            pagination={{ clickable: true, dynamicBullets: true }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 4,
              },
              1280: {
                slidesPerView: 5,
              },
            }}
            className="pb-12" // Add padding for pagination bullets
          >
            {featuredBooks.map((book) => (
              <SwiperSlide key={book.id} className="h-auto">
                <div className="h-full p-1">
                  <BookCard {...book} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* --- Alternating Scrolling Rows --- */}
        <div id="browse-collection" className="space-y-12">

          {/* 1. New Arrivals - Moves LEFT */}
          <BookRow
            title="Explore Our Latest Arrivals"
            books={newArrivals}
            categoryLink="/categories"
            autoScrollDirection="left"
          />

          {/* 2. Fiction - Moves RIGHT */}
          <BookRow
            title="Best Fiction"
            books={fictionBooks}
            categoryLink="/categories?category=Fiction"
            autoScrollDirection="right"
          />

          {/* 3. Children - Grid Layout */}
          <BookGrid
            title="Best Children's Books"
            books={childrenBooks}
            categoryLink="/categories?category=Children"
          />

          {/* 4. Novels - Grid Layout */}
          <BookGrid
            title="Best Novels"
            books={novelsBooks}
            categoryLink="/categories?category=Novels"
          />
        </div>

        <div className="mt-20 flex flex-col items-center justify-center space-y-6 border-t border-primary/10 pt-16">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black tracking-tight">Hungry for more?</h3>
            <p className="text-muted-foreground font-medium text-lg">Explore our entire collection of thousands of books.</p>
          </div>

          <Button
            size="lg"
            className="group px-12 h-16 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xl rounded-2xl transition-all duration-300 shadow-2xl shadow-primary/30 uppercase tracking-widest"
            onClick={() => {
              const element = document.getElementById("browse-collection");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Explore Full Collection
            <ArrowRight className="ml-3 h-7 w-7 group-hover:translate-x-2 transition-transform" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Home;