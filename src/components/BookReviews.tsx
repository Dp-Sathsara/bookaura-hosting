import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ReviewService, type Review } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, Send, User } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";


interface BookReviewsProps {
    bookId: string;
    bookTitle: string;
    bookImage: string;
}

export default function BookReviews({ bookId, bookTitle, bookImage }: BookReviewsProps) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, [bookId]);

    const fetchReviews = async () => {
        try {
            const data = await ReviewService.getByBookId(bookId);
            setReviews(data);
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error("Please login to leave a review");
            return;
        }
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }
        if (!comment.trim()) {
            toast.error("Please add a comment");
            return;
        }

        setIsSubmitting(true);
        try {
            await ReviewService.add({
                bookId,
                bookTitle,
                bookImage,
                userId: user.id || user.email, // using email if id is missing
                userName: user.username || user.email.split('@')[0],
                rating,
                comment,
            });
            toast.success("Review submitted successfully!");
            setRating(0);
            setComment("");
            fetchReviews();
        } catch (error) {
            console.error("Failed to submit review", error);
            toast.error("Failed to submit review");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-16 border-t border-primary/10 pt-12 font-sans">
            <div className="flex items-center gap-3 mb-8">
                <MessageSquare className="h-6 w-6 text-primary" />
                <h3 className="text-2xl font-black tracking-tighter uppercase italic">Customer <span className="text-primary">Reviews</span></h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left: Review List */}
                <div className="lg:col-span-2 space-y-8">
                    {loading ? (
                        <div className="text-center py-10 text-muted-foreground font-bold uppercase tracking-widest text-xs">Loading reviews...</div>
                    ) : reviews.length === 0 ? (
                        <div className="bg-muted/20 rounded-3xl p-10 text-center border-2 border-dashed border-muted">
                            <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm">No reviews yet. Be the first to share your thoughts!</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {reviews.map((review) => (
                                <div key={review.id} className="bg-muted/10 rounded-[2rem] p-6 border transition-all hover:border-primary/20 hover:bg-muted/20">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border-2 border-primary/20 shadow-sm">
                                                <AvatarFallback className="bg-primary/10 text-primary font-black uppercase text-xs">
                                                    {review.userName?.substring(0, 2) || "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-black uppercase tracking-tight text-sm">{review.userName}</p>
                                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                                    {new Date(review.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`h-3.5 w-3.5 ${star <= review.rating ? "fill-primary text-primary" : "text-muted-foreground/20"}`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <p className="text-sm font-medium leading-relaxed italic text-foreground/80 mb-4 pl-2 border-l-2 border-primary/20 ml-2">
                                        "{review.comment}"
                                    </p>

                                    {review.adminReply && (
                                        <div className="mt-4 ml-6 bg-primary/5 rounded-2xl p-4 border border-primary/10 relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge variant="default" className="text-[9px] font-black uppercase tracking-widest px-2 py-0">Admin Reply</Badge>
                                            </div>
                                            <p className="text-xs font-bold leading-relaxed text-foreground">
                                                {review.adminReply}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Submit Review Form */}
                <div className="lg:col-span-1">
                    <div className="bg-background border-2 border-primary/10 rounded-[2.5rem] p-8 shadow-2xl shadow-primary/5 sticky top-24">
                        <h4 className="text-xl font-black uppercase tracking-tighter italic mb-2">Write a <span className="text-primary">Review</span></h4>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-6">Share your experience with others</p>

                        {user ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Rating</label>
                                    <div className="flex gap-2 justify-center py-2 bg-muted/30 rounded-2xl">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                className="transition-transform hover:scale-125 focus:outline-none"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHover(star)}
                                                onMouseLeave={() => setHover(0)}
                                            >
                                                <Star
                                                    className={`h-8 w-8 ${star <= (hover || rating) ? "fill-primary text-primary" : "text-muted-foreground/30"
                                                        } transition-colors`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Your Comment</label>
                                    <Textarea
                                        placeholder="What did you think of this book?"
                                        className="min-h-[120px] rounded-2xl bg-muted/30 border-none font-bold placeholder:font-bold focus-visible:ring-primary"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-12 rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Submitting..." : (
                                        <span className="flex items-center gap-2">Submit <Send className="h-4 w-4" /></span>
                                    )}
                                </Button>
                            </form>
                        ) : (
                            <div className="text-center py-8 space-y-4">
                                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted/50 mb-2">
                                    <User className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <p className="text-sm font-bold text-muted-foreground">Please log in to share your review.</p>
                                <Button variant="outline" className="w-full rounded-xl font-black uppercase tracking-widest" onClick={() => navigate('/login')}>
                                    Login Now
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

