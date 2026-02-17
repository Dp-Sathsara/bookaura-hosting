package com.bookaura.service;

import com.bookaura.dto.DashboardStatsDTO;
import com.bookaura.repository.BookRepository;
import com.bookaura.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;
import java.time.format.DateTimeFormatter;
import com.bookaura.model.Order;

@Service
public class AdminDashboardService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private BookRepository bookRepository;

    public DashboardStatsDTO getDashboardStats() {
        // 1. Total Revenue: Sum of totalAmount where status is "Shipped"
        Double revenue = orderRepository.getTotalRevenue();
        double totalRevenue = (revenue != null) ? revenue : 0.0;

        // 2. Active Orders: Status "Pending" or "Processing"
        long activeOrders = orderRepository.countByOrderStatusIn(Arrays.asList("Pending", "Processing"));

        // 3. Total Books (Inventory): Sum of stock
        Long stock = bookRepository.getTotalStock();
        long totalBooks = (stock != null) ? stock : 0;

        // 4. Completed Orders: Status "Shipped" or "Delivered"
        long completedOrders = orderRepository.countByOrderStatusIn(Arrays.asList("Shipped", "Delivered"));

        // 5. Chart Data: Last 7 days
        LocalDate sevenDaysAgo = LocalDate.now().minusDays(6);
        Date date = Date.from(sevenDaysAgo.atStartOfDay(ZoneId.systemDefault()).toInstant());
        List<Order> ordersLast7Days = orderRepository.findByCreatedAtAfter(date);

        Map<String, Double> salesMap = new LinkedHashMap<>();
        Map<String, Double> trafficMap = new LinkedHashMap<>();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEE");

        for (int i = 0; i < 7; i++) {
            LocalDate d = sevenDaysAgo.plusDays(i);
            String dayName = d.format(formatter);
            salesMap.put(dayName, 0.0);
            trafficMap.put(dayName, 0.0);
        }

        for (Order order : ordersLast7Days) {
            if (order.getCreatedAt() != null) {
                LocalDate orderDate = order.getCreatedAt().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                String dayName = orderDate.format(formatter);
                if (salesMap.containsKey(dayName)) {
                    salesMap.put(dayName, salesMap.get(dayName) + order.getTotalAmount());
                    trafficMap.put(dayName, trafficMap.get(dayName) + 1);
                }
            }
        }

        List<DashboardStatsDTO.ChartDataDTO> salesData = new ArrayList<>();
        List<DashboardStatsDTO.ChartDataDTO> trafficData = new ArrayList<>();

        salesMap.forEach((k, v) -> salesData.add(new DashboardStatsDTO.ChartDataDTO(k, v)));
        trafficMap.forEach((k, v) -> trafficData.add(new DashboardStatsDTO.ChartDataDTO(k, v)));

        // 6. Recent Orders: Top 5
        List<Order> recentOrdersList = orderRepository.findTop5ByOrderByCreatedAtDesc();
        List<DashboardStatsDTO.RecentOrderDTO> recentOrders = new ArrayList<>();

        for (Order order : recentOrdersList) {
            String customerName = (order.getCustomerDetails() != null) ? order.getCustomerDetails().getName() : "Guest";
            // Check if user is linked, if so, we can try to get name from User entity if
            // needed, but Order should have snapshot.

            recentOrders.add(new DashboardStatsDTO.RecentOrderDTO(
                    order.getId(),
                    customerName,
                    order.getTotalAmount(),
                    order.getOrderStatus(),
                    order.getCreatedAt()));
        }

        return new DashboardStatsDTO(totalRevenue, activeOrders, totalBooks, completedOrders,
                salesData, trafficData, recentOrders);
    }
}
