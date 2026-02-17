package com.bookaura.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsDTO {
    private double totalRevenue;
    private long activeOrders;
    private long totalBooks;
    private long completedOrders;
    private java.util.List<ChartDataDTO> salesData;
    private java.util.List<ChartDataDTO> trafficData;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ChartDataDTO {
        private String name;
        private double value; // Can support both sales (double) and traffic count (long -> double)
    }

    private java.util.List<RecentOrderDTO> recentOrders;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RecentOrderDTO {
        private String id;
        private String customerName;
        private double amount;
        private String status;
        private java.util.Date date;
    }
}
