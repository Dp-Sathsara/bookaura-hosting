package com.bookaura.service;

import com.bookaura.model.Review;
import com.bookaura.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public List<Review> getReviewsByBookId(String bookId) {
        return reviewRepository.findByBookId(bookId);
    }

    public Review createReview(Review review) {
        return reviewRepository.save(review);
    }

    public void deleteReview(String id) {
        reviewRepository.deleteById(id);
    }

    public Review getReviewById(String id) {
        return reviewRepository.findById(id).orElse(null);
    }

    public Review updateAdminReply(String id, String adminReply) {
        Review review = getReviewById(id);
        if (review != null) {
            review.setAdminReply(adminReply);
            return reviewRepository.save(review);
        }
        return null;
    }
}
