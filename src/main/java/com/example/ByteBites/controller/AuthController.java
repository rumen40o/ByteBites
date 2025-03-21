package com.example.ByteBites.controller;

import com.example.ByteBites.models.Accounts;
import com.example.ByteBites.models.AuthRequest;
import com.example.ByteBites.models.RegisterRequest;
import com.example.ByteBites.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins =  "http://localhost:3000")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        return authenticationService.register(request);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody AuthRequest request, HttpServletResponse response) {
        ResponseEntity<String> responseEntity = authenticationService.login(request);

        // Ако логинът е успешен, добавяме JWT в `HttpOnly` cookie
        if (responseEntity.getStatusCode().is2xxSuccessful()) {
            String jwtToken = responseEntity.getBody();

            Cookie jwtCookie = new Cookie("jwt_token", jwtToken);
            jwtCookie.setHttpOnly(true);
            jwtCookie.setSecure(false);
            jwtCookie.setPath("/");
            jwtCookie.setMaxAge(60 * 60); // 1 час

            response.addCookie(jwtCookie);
        }

        return responseEntity;
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletResponse response) {

        Cookie jwtCookie = new Cookie("jwt_token", null);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(false);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(0);

        response.addCookie(jwtCookie);

        return ResponseEntity.ok("Logged out successfully");
    }

    @GetMapping("/protected-resource")
    public ResponseEntity<?> getProtectedResource(@AuthenticationPrincipal Accounts user) {
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        return ResponseEntity.ok().body(
                String.format("{\"message\": \"This is a protected resource\", \"user\": \"%s\"}", user.getUsername())
        );
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal Accounts user) {
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        return ResponseEntity.ok(user);
    }
}
