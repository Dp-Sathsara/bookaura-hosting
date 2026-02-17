package com.bookaura.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnalyticsStatsDTO {
    private double totalRevenue;
    private long totalOrders;
    private long newCustomers;
    private double conversionRate;
    private java.util.List<MonthlyDataDTO> monthlyData;
    private java.util.List<CategoryDataDTO> categoryData;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MonthlyDataDTO {
        private String name;
        private double revenue;
        private long orders;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CategoryDataDTO {
        private String name;
        private long value;
    }
}
