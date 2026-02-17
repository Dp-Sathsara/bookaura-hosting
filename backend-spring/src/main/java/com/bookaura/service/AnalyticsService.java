package com.bookaura.service;

import com.bookaura.dto.AnalyticsStatsDTO;
import com.bookaura.repository.OrderRepository;
import com.bookaura.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

@Service
public class AnalyticsService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    public AnalyticsStatsDTO getAnalyticsStats() {
        // 1. Total Revenue (all completed orders)
        Double revenue = orderRepository.getTotalRevenue();
        double totalRevenue = (revenue != null) ? revenue : 0.0;

        // 2. Total Orders
        long totalOrders = orderRepository.count();

        // 3. New Customers (users created in last 30 days)
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        Date fromDate = Date.from(thirtyDaysAgo.atStartOfDay(ZoneId.systemDefault()).toInstant());
        long newCustomers = userRepository.countByCreatedAtAfter(fromDate);

        // 4. Conversion Rate (completed orders / total orders)
        long completedOrders = orderRepository.countByOrderStatusIn(Arrays.asList("Shipped", "Delivered"));
        double conversionRate = (totalOrders > 0) ? ((double) completedOrders / totalOrders) * 100 : 0.0;

        // 5. Monthly Data (last 6 months)
        LocalDate sixMonthsAgo = LocalDate.now().minusMonths(6);
        Date sixMonthsDate = Date.from(sixMonthsAgo.atStartOfDay(ZoneId.systemDefault()).toInstant());

        List<org.bson.Document> monthlyRevenueDocs = orderRepository.getMonthlyRevenue(sixMonthsDate);
        List<org.bson.Document> monthlyOrderDocs = orderRepository.getMonthlyOrderCount(sixMonthsDate);

        // Create a map for easy lookup
        Map<Integer, Double> revenueMap = new HashMap<>();
        Map<Integer, Long> orderCountMap = new HashMap<>();

        for (org.bson.Document doc : monthlyRevenueDocs) {
            revenueMap.put(doc.getInteger("_id"), doc.getDouble("revenue"));
        }

        for (org.bson.Document doc : monthlyOrderDocs) {
            orderCountMap.put(doc.getInteger("_id"), ((Number) doc.get("orders")).longValue());
        }

        // Generate monthly data for last 6 months
        List<AnalyticsStatsDTO.MonthlyDataDTO> monthlyData = new ArrayList<>();
        String[] monthNames = { "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" };

        for (int i = 5; i >= 0; i--) {
            LocalDate monthDate = LocalDate.now().minusMonths(i);
            int monthIndex = monthDate.getMonthValue();
            String monthName = monthNames[monthIndex - 1];

            double monthRevenue = revenueMap.getOrDefault(monthIndex, 0.0);
            long orders = orderCountMap.getOrDefault(monthIndex, 0L);

            monthlyData.add(new AnalyticsStatsDTO.MonthlyDataDTO(monthName, monthRevenue, orders));
        }

        // 6. Category Sales Data
        List<org.bson.Document> categorySalesDocs = orderRepository.getCategorySales();
        List<AnalyticsStatsDTO.CategoryDataDTO> categoryData = new ArrayList<>();

        for (org.bson.Document doc : categorySalesDocs) {
            String category = doc.getString("_id");
            if (category != null && !category.isEmpty()) {
                long value = ((Number) doc.get("value")).longValue();
                categoryData.add(new AnalyticsStatsDTO.CategoryDataDTO(category, value));
            }
        }

        // If no category data, provide default
        if (categoryData.isEmpty()) {
            categoryData.add(new AnalyticsStatsDTO.CategoryDataDTO("No Data", 0));
        }

        return new AnalyticsStatsDTO(
                totalRevenue,
                totalOrders,
                newCustomers,
                Math.round(conversionRate * 10.0) / 10.0, // Round to 1 decimal
                monthlyData,
                categoryData);
    }
}
