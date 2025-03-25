package com.example.ByteBites.security;

import com.example.ByteBites.models.*;
import com.example.ByteBites.repository.AccountRepository;
import com.example.ByteBites.repository.MenuItemsRepository;
import com.example.ByteBites.repository.OrdersRepository;
import com.example.ByteBites.repository.RestaurantsRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;

import java.util.Collections;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {

    private final AccountRepository repository;
    private final RestaurantsRepository restaurantsRepository;
    private final MenuItemsRepository menuItemsRepository;
    private final OrdersRepository ordersRepository;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return loginIdentifier -> repository.findByUsername(loginIdentifier)
                .or(() -> repository.findByEmail(loginIdentifier)) // Проверка и по email
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public HttpMessageConverter<Object> createMappingJackson2HttpMessageConverter() {
        MappingJackson2HttpMessageConverter jackson2HttpMessageConverter = new MappingJackson2HttpMessageConverter();

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        jackson2HttpMessageConverter.setObjectMapper(objectMapper);
        return jackson2HttpMessageConverter;
    }

    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint() {
        return (request, response, authException) -> {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
        };
    }

    @Bean
    CommandLineRunner loadData() {
        return args -> {
            if (repository.count() == 0) {
                BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

                Accounts user = new Accounts("user1", "user1@example.com", encoder.encode("password"),"0896724567", Roles.USER);
                Accounts deliver = new Accounts("deliver1", "deliver1@example.com", encoder.encode("password"),"0896724554", Roles.DELIVER);
                Accounts owner = new Accounts("admin", "admin@example.com", encoder.encode("admin123"),"0896742567", Roles.OWNER);

                repository.saveAll(List.of(user, deliver, owner));

                Restaurants restaurant = new Restaurants("Pizza Place", "Best pizza in town", "123 Main St");
                restaurantsRepository.save(restaurant);

                MenuItems pizza = new MenuItems("Margherita Pizza", 12.99, Category.PIZZA, restaurant);
                MenuItems pasta = new MenuItems("Spaghetti Carbonara", 9.99, Category.PASTA, restaurant);

                menuItemsRepository.saveAll(List.of(pizza, pasta));


                System.out.println("Тестови данни са добавени успешно!");
            }
        };
    }
}
