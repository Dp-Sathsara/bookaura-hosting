package com.bookaura.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "reviews")
public class Review {
    @Id
    private String id;
    private String userId;
    private String userName;
    private String bookId;
    private String bookTitle;
    private String bookImage;
    private int rating; // 1-5
    private String comment;
    private String adminReply;
    private Date date = new Date();
}
