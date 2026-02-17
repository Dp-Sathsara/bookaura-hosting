package com.bookaura.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    private String bookId;
    private String title;
    private String author;
    private double price;
    private int quantity;
    private String image;
}
