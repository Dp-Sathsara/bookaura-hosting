package com.bookaura.controller;

import com.bookaura.model.Review;
import com.bookaura.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/api/reviews/book/{bookId}")
    public List<Review> getReviewsByBookId(@PathVariable String bookId) {
        return reviewService.getReviewsByBookId(bookId);
    }

    @PostMapping("/api/reviews/add")
    public Review createReview(@RequestBody Review review) {
        return reviewService.createReview(review);
    }

    // Admin Endpoints
    @GetMapping("/api/admin/reviews/all")
    public List<Review> getAllReviews() {
        return reviewService.getAllReviews();
    }

    @DeleteMapping("/api/admin/reviews/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable String id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/api/admin/reviews/reply/{id}")
    public ResponseEntity<Review> replyToReview(@PathVariable String id,
            @RequestBody java.util.Map<String, String> payload) {
        String reply = payload.get("adminReply");
        Review updatedReview = reviewService.updateAdminReply(id, reply);
        if (updatedReview != null) {
            return ResponseEntity.ok(updatedReview);
        }
        return ResponseEntity.notFound().build();
    }
}
