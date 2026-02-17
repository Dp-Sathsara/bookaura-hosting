import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}

const ReviewModal = ({ isOpen, onClose, orderId }: ReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    // මෙතනදී Review එක සේව් කරන Logic එක පසුව backend සමග සම්බන්ධ කළ හැක
    console.log(`Review for ${orderId}: ${rating} stars, Comment: ${comment}`);
    alert("Thank you for your review!");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-[2rem] font-sans border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">Submit Review</DialogTitle>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Order: {orderId}</p>
        </DialogHeader>
        
        <div className="py-6 flex flex-col items-center space-y-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Rate your experience</p>
          
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="transition-transform hover:scale-125 focus:outline-none"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                <Star
                  className={`h-10 w-10 ${
                    star <= (hover || rating) ? "fill-primary text-primary" : "text-muted-foreground/30"
                  } transition-colors`}
                />
              </button>
            ))}
          </div>

          <div className="w-full space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Your Feedback</p>
            <Textarea 
              placeholder="Tell us what you loved about these books..." 
              className="rounded-2xl bg-muted/30 border-none font-bold min-h-[100px] focus-visible:ring-primary"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            className="w-full h-12 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 bg-primary"
            onClick={handleSubmit}
            disabled={rating === 0}
          >
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;