package com.bookaura.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "orders")
public class Order {
    @Id
    private String id;
    private CustomerDetails customerDetails;
    private ShippingAddress shippingAddress;
    private List<OrderItem> items;
    private String userId; // Link to User ID
    private double totalAmount;
    private String paymentMethod;
    private String paymentStatus; // e.g., "Paid", "Pending"
    private String orderStatus; // "Pending", "Processing", "Shipped", "Delivered"
    private Date createdAt;

    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}
