package com.example.ByteBites.service.inteface;

import com.example.ByteBites.models.AuthRequest;
import com.example.ByteBites.models.RegisterRequest;
import org.springframework.http.ResponseEntity;

public interface AuthServiceInterface {
    ResponseEntity<String> register(RegisterRequest request);
    ResponseEntity<String> login(AuthRequest request);
}
