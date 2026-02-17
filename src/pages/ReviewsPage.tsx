import { useEffect, useState } from "react";
import { ReviewService, type Review } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const data = await ReviewService.getAll();
            setReviews(data);
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-10 font-bold">Loading reviews...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl font-sans animate-in fade-in duration-500">
            <h1 className="text-3xl font-black uppercase tracking-tighter mb-8 text-center text-primary">Customer Reviews</h1>

            {reviews.length === 0 ? (
                <div className="text-center text-muted-foreground p-10">No reviews yet. Be the first to share your thoughts!</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map((review) => (
                        <Card key={review.id} className="rounded-2xl border-none shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            <CardHeader className="flex flex-row gap-4 items-center bg-muted/20 pb-4">
                                {review.bookImage && (
                                    <img src={review.bookImage} alt={review.bookTitle} className="w-12 h-16 object-cover rounded shadow-sm" />
                                )}
                                <div>
                                    <CardTitle className="text-md font-bold line-clamp-1" title={review.bookTitle}>{review.bookTitle || "Unknown Book"}</CardTitle>
                                    <p className="text-xs text-muted-foreground font-medium">Reviewed by {review.userName}</p>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-3">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`h-4 w-4 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                                        />
                                    ))}
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed italic">"{review.comment}"</p>
                                <p className="text-xs text-muted-foreground text-right">{new Date(review.date).toLocaleDateString()}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
