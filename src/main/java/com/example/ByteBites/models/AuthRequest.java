package com.example.ByteBites.models;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class AuthRequest {
    @NotBlank(message = "Username or email cannot be empty")
    private String identifier;

    @NotBlank(message = "Password cannot be empty")
    private String password;
}
