package com.bookaura.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username; // This will actually be the "Name" (First + Last)
    private String email;
    private String password;
}
