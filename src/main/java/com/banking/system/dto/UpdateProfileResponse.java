package com.banking.system.dto;

public class UpdateProfileResponse {
    private String message;
    private String fullName;
    private String email;

    public UpdateProfileResponse(String message, String fullName, String email) {
        this.message = message;
        this.fullName = fullName;
        this.email = email;
    }

    // Getters
    public String getMessage() {
        return message;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }
}
