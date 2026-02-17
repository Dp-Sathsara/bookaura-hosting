import { useState } from "react";
import { ContactService } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe } from "lucide-react";
import { motion } from "framer-motion";

const ContactPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await ContactService.create(formData);
            toast.success("Message sent successfully!", {
                description: "We'll get back to you as soon as possible.",
            });
            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch (error) {

            console.error("Failed to send message:", error);
            toast.error("Failed to send message", {
                description: "Please check your connection and try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactDetails = [
        {
            icon: MapPin,
            title: "Visit Us",
            content: "Colombo 06, Sri Lanka.",
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            icon: Phone,
            title: "Call Us",
            content: "+94 74 243 1458",
            color: "text-green-500",
            bg: "bg-green-500/10"
        },
        {
            icon: Mail,
            title: "Email Us",
            content: "bookaura@outlook.com",
            color: "text-primary",
            bg: "bg-primary/10"
        },
        {
            icon: Clock,
            title: "Working Hours",
            content: "Mon - Sat: 10 AM - 10 PM",
            color: "text-orange-500",
            bg: "bg-orange-500/10"
        }
    ];

    return (
        <div className="relative min-h-screen pt-20 pb-16 overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 relative">
                {/* Header Section */}
                <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                            Connect with us
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-tight mb-6">
                            Let's Start a <span className="text-primary italic">Conversation</span>
                        </h1>
                        <p className="text-muted-foreground text-lg font-medium leading-relaxed">
                            Have a question about a book? Need help with an order? Or just want to talk literature?
                            Our team is here to help you navigate through our universe of stories.
                        </p>
                    </motion.div>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 items-start max-w-7xl mx-auto">

                    {/* Contact Information Cards */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
                            {contactDetails.map((detail, index) => (
                                <motion.div
                                    key={detail.title}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="p-6 rounded-3xl bg-card border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className={`h-12 w-12 rounded-2xl ${detail.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                            <detail.icon className={`h-6 w-6 ${detail.color}`} />
                                        </div>
                                        <div>
                                            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{detail.title}</h3>
                                            <p className="font-bold text-foreground leading-snug">{detail.content}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Social Links Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="p-8 rounded-3xl bg-primary text-primary-foreground hidden lg:block overflow-hidden relative"
                        >
                            <Globe className="absolute -right-8 -bottom-8 h-48 w-48 opacity-10 rotate-12" />
                            <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4">Global Support</h3>
                            <p className="text-primary-foreground/80 font-medium mb-6">
                                We're building a community of readers across the world. Join our journey on social media.
                            </p>
                            <div className="flex gap-4">
                                {['Facebook', 'Insta', 'Twitter', 'GitHub'].map(social => (
                                    <button key={social} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[10px] font-black uppercase tracking-widest transition-colors">
                                        {social}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Contact Form Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-7"
                    >
                        <div className="bg-card/50 backdrop-blur-xl border border-border/50 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                            {/* Decorative element */}
                            <div className="absolute top-0 right-0 h-32 w-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors" />

                            <div className="flex items-center gap-3 mb-10">
                                <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <MessageSquare className="h-5 w-5 text-primary" />
                                </div>
                                <h2 className="text-2xl font-black uppercase italic tracking-tighter">Send a Message</h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground ml-1">Your Name</label>
                                        <Input
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="John Doe"
                                            className="h-14 bg-muted/30 border-none rounded-2xl px-6 font-bold placeholder:text-muted-foreground/50 focus-visible:ring-primary/30"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground ml-1">Email Address</label>
                                        <Input
                                            required
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="john@example.com"
                                            className="h-14 bg-muted/30 border-none rounded-2xl px-6 font-bold placeholder:text-muted-foreground/50 focus-visible:ring-primary/30"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground ml-1">Subject</label>
                                    <Input
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        placeholder="Order Inquiry / Book Recommendation"
                                        className="h-14 bg-muted/30 border-none rounded-2xl px-6 font-bold placeholder:text-muted-foreground/50 focus-visible:ring-primary/30"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground ml-1">Message</label>
                                    <Textarea
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="Type your message here..."
                                        className="min-h-[180px] bg-muted/30 border-none rounded-2xl p-6 font-bold placeholder:text-muted-foreground/50 focus-visible:ring-primary/30"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-md shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-3">
                                            <div className="h-5 w-5 border-3 border-t-white border-white/30 rounded-full animate-spin" />
                                            Dispatching...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-3">
                                            <Send className="h-5 w-5" />
                                            Send Message
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;

