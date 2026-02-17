package com.bookaura.service;

import com.bookaura.model.Order;
import com.bookaura.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public Order createOrder(Order order) {
        order.setCreatedAt(new Date());
        order.setOrderStatus("Pending");
        if ("Cash on Delivery".equals(order.getPaymentMethod())) {
            order.setPaymentStatus("Pending");
        } else {
            order.setPaymentStatus("Paid");
        }
        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getOrdersByEmail(String email) {
        return orderRepository.findByCustomerDetailsEmail(email);
    }

    public Optional<Order> getOrderById(String id) {
        return orderRepository.findById(id);
    }

    public List<Order> getOrdersByUserId(String userId) {
        return orderRepository.findByUserId(userId);
    }

    public Order cancelOrder(String orderId) {
        Optional<Order> orderOptional = orderRepository.findById(orderId);
        if (orderOptional.isPresent()) {
            Order order = orderOptional.get();
            if ("Pending".equals(order.getOrderStatus())) {
                order.setOrderStatus("Cancelled");
                return orderRepository.save(order);
            } else {
                throw new RuntimeException("Order cannot be cancelled. Current status: " + order.getOrderStatus());
            }
        }
        throw new RuntimeException("Order not found with id: " + orderId);
    }

    public Order updateOrderStatus(String id, String status) {
        Optional<Order> orderOptional = orderRepository.findById(id);
        if (orderOptional.isPresent()) {
            Order order = orderOptional.get();
            order.setOrderStatus(status);
            return orderRepository.save(order);
        }
        throw new RuntimeException("Order not found with id: " + id);
    }
}
