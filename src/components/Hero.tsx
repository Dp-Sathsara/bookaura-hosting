import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ 1. Import useNavigate

const Hero = () => {
  const navigate = useNavigate(); // ✅ 2. Initialize hook

  return (
    // bg-slate-50 ain karala bg-background damma
    <section className="relative overflow-hidden bg-background py-16 md:py-24 transition-colors duration-300">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">

          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              <span>Discover Your Next Adventure</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
              Unlock a World of <span className="text-primary">Knowledge</span> at Your Fingertips
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              Explore thousands of books from best-selling authors. From fiction to finance,
              find the perfect read to ignite your imagination.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              {/* ✅ 3. Added onClick Navigation */}
              <Button
                size="lg"
                className="rounded-full px-8 h-12 text-base font-semibold transition-transform hover:scale-105"
                onClick={() => navigate("/browse-collection")}
              >
                Browse Collection
              </Button>

              {/* ✅ 4. Added onClick Navigation */}
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 h-12 text-base font-semibold border-2 transition-transform hover:scale-105"
                onClick={() => navigate("/categories")}
              >
                <BookOpen className="mr-2 h-5 w-5" />
                View Categories
              </Button>
            </div>
          </div>

          {/* Image/Visual Part */}
          <div className="flex-1 relative">
            {/* border-white ain karala border-border damma */}
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-border transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1000&auto=format&fit=crop"
                alt="Library"
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Floating Card Detail */}
            <div className="absolute -bottom-6 -left-6 z-20 bg-card p-4 rounded-xl shadow-xl border animate-bounce-slow hidden md:block">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold">5k+</span>
                </div>
                <div className="text-sm text-card-foreground">
                  <p className="font-bold">Active Readers</p>
                  <p className="text-muted-foreground">Joining daily</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;