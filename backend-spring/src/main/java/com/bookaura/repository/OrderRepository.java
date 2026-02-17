package com.bookaura.repository;

import com.bookaura.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {
        List<Order> findByCustomerDetailsEmail(String email);

        List<Order> findByUserId(String userId);

        // 1. Total Revenue: Sum totalAmount where status is "Shipped"
        @org.springframework.data.mongodb.repository.Aggregation(pipeline = {
                        "{ '$match': { 'orderStatus': 'Shipped' } }",
                        "{ '$group': { '_id': null, 'total': { '$sum': '$totalAmount' } } }"
        })
        Double getTotalRevenue();

        // 2. Count by multiple statuses
        long countByOrderStatusIn(java.util.List<String> statuses);

        // 3. Find orders created after a certain date
        List<Order> findByCreatedAtAfter(java.util.Date date);

        // 4. Find top 5 recent orders
        List<Order> findTop5ByOrderByCreatedAtDesc();

        // 5. Monthly Revenue Aggregation (last 6 months)
        @org.springframework.data.mongodb.repository.Aggregation(pipeline = {
                        "{ '$match': { 'createdAt': { '$gte': ?0 } } }",
                        "{ '$group': { '_id': { '$month': '$createdAt' }, 'revenue': { '$sum': '$totalAmount' } } }",
                        "{ '$sort': { '_id': 1 } }"
        })
        List<org.bson.Document> getMonthlyRevenue(java.util.Date fromDate);

        // 6. Monthly Order Count Aggregation (last 6 months)
        @org.springframework.data.mongodb.repository.Aggregation(pipeline = {
                        "{ '$match': { 'createdAt': { '$gte': ?0 } } }",
                        "{ '$group': { '_id': { '$month': '$createdAt' }, 'orders': { '$sum': 1 } } }",
                        "{ '$sort': { '_id': 1 } }"
        })
        List<org.bson.Document> getMonthlyOrderCount(java.util.Date fromDate);

        // 7. Category Sales Aggregation
        @org.springframework.data.mongodb.repository.Aggregation(pipeline = {
                        "{ '$unwind': '$items' }",
                        "{ '$group': { '_id': '$items.category', 'value': { '$sum': '$items.quantity' } } }",
                        "{ '$sort': { 'value': -1 } }"
        })
        List<org.bson.Document> getCategorySales();
}
