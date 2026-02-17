package com.bookaura.controller;

import com.bookaura.dto.AnalyticsStatsDTO;
import com.bookaura.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/dashboard-data")
    public ResponseEntity<AnalyticsStatsDTO> getDashboardData() {
        return ResponseEntity.ok(analyticsService.getAnalyticsStats());
    }
}
