import { useEffect, useState } from "react";
import { ReviewService, type Review } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Trash2, Reply, MessageCircle, Star, Search } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function AdminReviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Reply Modal State
    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [adminReply, setAdminReply] = useState("");
    const [isSubmittingReply, setIsSubmittingReply] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const data = await ReviewService.getAllAdmin();
            setReviews(data);
        } catch (error) {
            console.error("Failed to fetch reviews", error);
            toast.error("Failed to load reviews");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this review? This action cannot be undone.")) return;
        try {
            await ReviewService.deleteAdmin(id);
            setReviews(reviews.filter((r) => r.id !== id));
            toast.success("Review deleted successfully");
        } catch (error) {
            console.error("Failed to delete review", error);
            toast.error("Failed to delete review");
        }
    };

    const handleOpenReplyModal = (review: Review) => {
        setSelectedReview(review);
        setAdminReply(review.adminReply || "");
        setIsReplyModalOpen(true);
    };

    const handleSendReply = async () => {
        if (!selectedReview) return;
        if (!adminReply.trim()) {
            toast.error("Reply cannot be empty");
            return;
        }

        setIsSubmittingReply(true);
        try {
            await ReviewService.replyAdmin(selectedReview.id, adminReply);
            toast.success("Reply saved successfully");
            setIsReplyModalOpen(false);
            fetchReviews(); // Refresh list to show updated reply
        } catch (error) {
            console.error("Failed to save reply", error);
            toast.error("Failed to save reply");
        } finally {
            setIsSubmittingReply(false);
        }
    };

    const filteredReviews = reviews.filter(review =>
        review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.bookTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="font-black uppercase tracking-widest text-xs animate-pulse">Loading Reviews...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500 font-sans">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter italic">Review <span className="text-primary">Management</span></h2>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1">Manage customer feedback and respond to reviews</p>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search reviews..."
                        className="pl-10 rounded-xl bg-muted/30 border-none font-bold placeholder:font-bold focus-visible:ring-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-card rounded-[2rem] border-2 border-primary/5 shadow-2xl shadow-primary/5 overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="border-none hover:bg-transparent">
                            <TableHead className="font-black uppercase tracking-widest text-[10px] py-6">Book</TableHead>
                            <TableHead className="font-black uppercase tracking-widest text-[10px] py-6">User</TableHead>
                            <TableHead className="font-black uppercase tracking-widest text-[10px] py-6">Rating</TableHead>
                            <TableHead className="font-black uppercase tracking-widest text-[10px] py-6">Comment</TableHead>
                            <TableHead className="font-black uppercase tracking-widest text-[10px] py-6">Admin Reply</TableHead>
                            <TableHead className="font-black uppercase tracking-widest text-[10px] py-6 text-right px-8">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredReviews.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-40 text-center font-bold text-muted-foreground uppercase tracking-widest text-xs">
                                    No reviews found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredReviews.map((review) => (
                                <TableRow key={review.id} className="hover:bg-primary/5 border-b border-muted/50 transition-colors group">
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            {review.bookImage && (
                                                <div className="h-14 w-10 relative group-hover:scale-110 transition-transform duration-300 shadow-md">
                                                    <img src={review.bookImage} alt="" className="h-full w-full object-cover rounded shadow-inner" />
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                <span className="font-black uppercase tracking-tight text-xs line-clamp-1 max-w-[150px]" title={review.bookTitle}>
                                                    {review.bookTitle || "Unknown"}
                                                </span>
                                                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">ID: {review.bookId?.substring(0, 8)}...</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm tracking-tight">{review.userName}</span>
                                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{new Date(review.date).toLocaleDateString()}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`h-3 w-3 ${star <= review.rating ? "fill-primary text-primary" : "text-muted-foreground/20"}`}
                                                />
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[200px]">
                                        <p className="text-xs font-medium italic text-muted-foreground line-clamp-2 leading-relaxed" title={review.comment}>
                                            "{review.comment}"
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        {review.adminReply ? (
                                            <div className="flex items-start gap-2 max-w-[200px]">
                                                <MessageCircle className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                                                <p className="text-xs font-bold line-clamp-2 text-foreground/80 leading-relaxed">
                                                    {review.adminReply}
                                                </p>
                                            </div>
                                        ) : (
                                            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest opacity-30">No Reply</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right px-8">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-9 w-9 rounded-xl p-0 border-primary/20 hover:border-primary hover:bg-primary/10 text-primary"
                                                onClick={() => handleOpenReplyModal(review)}
                                                title="Reply"
                                            >
                                                <Reply className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-9 w-9 rounded-xl p-0 border-red-200 hover:border-red-500 hover:bg-red-50 text-red-500"
                                                onClick={() => handleDelete(review.id)}
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Reply Modal */}
            <Dialog open={isReplyModalOpen} onOpenChange={setIsReplyModalOpen}>
                <DialogContent className="sm:max-w-md rounded-[2.5rem] border-none shadow-2xl font-sans">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic">Send <span className="text-primary">Reply</span></DialogTitle>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Replying to {selectedReview?.userName}'s review</p>
                    </DialogHeader>

                    <div className="py-6 space-y-6">
                        <div className="bg-muted/30 rounded-2xl p-4 border-l-4 border-primary/50 relative">
                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Customer said:</p>
                            <p className="text-xs font-medium italic text-muted-foreground">"{selectedReview?.comment}"</p>
                        </div>

                        <div className="space-y-3 pt-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Admin Response</label>
                            <Textarea
                                placeholder="Type your reply here..."
                                className="min-h-[120px] rounded-2xl bg-muted/20 border-none font-bold focus-visible:ring-primary"
                                value={adminReply}
                                onChange={(e) => setAdminReply(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            className="w-full h-12 rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 bg-primary"
                            onClick={handleSendReply}
                            disabled={isSubmittingReply}
                        >
                            {isSubmittingReply ? "Saving..." : "Save Reply"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
