import { motion } from "framer-motion";
import { BookOpen, Users, Award, Target, Heart, Sparkles } from "lucide-react";

const AboutPage = () => {
    const values = [
        {
            icon: BookOpen,
            title: "Curated Collection",
            description: "Handpicked books across genres to satisfy every reader's taste and curiosity.",
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            icon: Users,
            title: "Community First",
            description: "Building a vibrant community of book lovers who share, discuss, and grow together.",
            color: "text-green-500",
            bg: "bg-green-500/10"
        },
        {
            icon: Award,
            title: "Quality Assured",
            description: "Every book is carefully selected and verified for authenticity and condition.",
            color: "text-primary",
            bg: "bg-primary/10"
        },
        {
            icon: Heart,
            title: "Passion Driven",
            description: "We're not just selling books—we're sharing stories that change lives.",
            color: "text-red-500",
            bg: "bg-red-500/10"
        }
    ];

    const stats = [
        { number: "10,000+", label: "Books Available" },
        { number: "5,000+", label: "Happy Readers" },
        { number: "50+", label: "Categories" },
        { number: "24/7", label: "Support" }
    ];

    return (
        <div className="relative min-h-screen pt-20 pb-16 overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 relative">
                {/* Header Section */}
                <div className="max-w-4xl mx-auto text-center mb-20 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                            Our Story
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-tight mb-6">
                            Where Stories <span className="text-primary italic">Come Alive</span>
                        </h1>
                        <p className="text-muted-foreground text-lg font-medium leading-relaxed max-w-3xl mx-auto">
                            BookAura is more than just an online bookstore. We're a passionate community dedicated to
                            connecting readers with stories that inspire, educate, and transform. Every book we offer
                            is a gateway to new worlds, ideas, and perspectives.
                        </p>
                    </motion.div>
                </div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-20"
                >
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="p-6 rounded-3xl bg-card border border-border/50 text-center hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                        >
                            <div className="text-3xl md:text-4xl font-black text-primary mb-2">{stat.number}</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>

                {/* Mission Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="max-w-5xl mx-auto mb-20"
                >
                    <div className="bg-primary text-primary-foreground p-10 md:p-16 rounded-[2.5rem] relative overflow-hidden">
                        <Target className="absolute -right-8 -bottom-8 h-64 w-64 opacity-10 rotate-12" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center">
                                    <Sparkles className="h-6 w-6" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter">Our Mission</h2>
                            </div>
                            <p className="text-primary-foreground/90 text-lg font-medium leading-relaxed max-w-3xl">
                                To make quality literature accessible to everyone, everywhere. We believe that every person
                                deserves access to the transformative power of books. Through our carefully curated collection,
                                seamless shopping experience, and dedicated customer support, we're building a world where
                                reading is celebrated and stories are shared.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Values Section */}
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-4">
                            What We <span className="text-primary">Stand For</span>
                        </h2>
                        <p className="text-muted-foreground text-lg font-medium">
                            The core values that guide everything we do
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {values.map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                                className="p-8 rounded-3xl bg-card border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group"
                            >
                                <div className="flex items-start gap-5">
                                    <div className={`h-14 w-14 rounded-2xl ${value.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                        <value.icon className={`h-7 w-7 ${value.color}`} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black uppercase tracking-tight mb-3">{value.title}</h3>
                                        <p className="text-muted-foreground font-medium leading-relaxed">{value.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="max-w-4xl mx-auto text-center mt-20 p-10 rounded-3xl bg-muted/30 border border-border/50"
                >
                    <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter mb-4">
                        Join Our Reading Community
                    </h3>
                    <p className="text-muted-foreground text-lg font-medium mb-6">
                        Discover your next favorite book and connect with fellow readers who share your passion for literature.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a href="/categories" className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-wider text-sm hover:shadow-lg hover:shadow-primary/30 transition-all">
                            Browse Collection
                        </a>
                        <a href="/contact" className="px-8 py-4 bg-card border border-border rounded-2xl font-black uppercase tracking-wider text-sm hover:shadow-lg transition-all">
                            Get in Touch
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AboutPage;
