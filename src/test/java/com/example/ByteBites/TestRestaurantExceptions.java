package com.example.ByteBites;

import com.example.ByteBites.models.Accounts;
import com.example.ByteBites.models.DTO.RestaurantPeriodRevenueDTO;
import com.example.ByteBites.models.Orders;
import com.example.ByteBites.models.Restaurants;
import com.example.ByteBites.repository.AccountRepository;
import com.example.ByteBites.repository.OrdersRepository;
import com.example.ByteBites.repository.RestaurantsRepository;
import com.example.ByteBites.service.JWTService;
import com.example.ByteBites.service.ReportService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.access.AccessDeniedException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class TestRestaurantExceptions {

    private JWTService jwtService;
    private AccountRepository accountRepository;
    private RestaurantsRepository restaurantsRepository;
    private OrdersRepository ordersRepository;
    private ReportService reportService;

    private final String jwtToken = "mock.token.here";
    private final String username = "admin";
    private final Long restaurantId = 1L;

    private Accounts owner;
    private Restaurants restaurant;

    @BeforeEach
    void setup() {
        jwtService = mock(JWTService.class);
        accountRepository = mock(AccountRepository.class);
        restaurantsRepository = mock(RestaurantsRepository.class);
        ordersRepository = mock(OrdersRepository.class);

        reportService = new ReportService(ordersRepository, jwtService, accountRepository, restaurantsRepository, null);


        owner = new Accounts();
        owner.setId(3L);

        restaurant = new Restaurants();
        restaurant.setId(restaurantId);
        restaurant.setName("Testaurant");
        restaurant.setOwner(owner);
    }

    @Test
    void testHappyPathRevenueCalculation() {
        when(jwtService.extractUsername(jwtToken)).thenReturn(username);
        when(accountRepository.findByUsername(username)).thenReturn(Optional.of(owner));
        when(accountRepository.findByEmail(username)).thenReturn(Optional.empty());
        when(restaurantsRepository.findById(restaurantId)).thenReturn(Optional.of(restaurant));

        Orders order1 = new Orders(); order1.setTotalPrice(30.0);
        Orders order2 = new Orders(); order2.setTotalPrice(50.0);

        LocalDateTime start = LocalDateTime.now().minusDays(7);
        LocalDateTime end = LocalDateTime.now();

        when(ordersRepository.findOrdersByRestaurantIdAndCreatedAtBetween(restaurantId, start, end))
                .thenReturn(List.of(order1, order2));

        RestaurantPeriodRevenueDTO result = reportService.getRestaurantRevenueForPeriod(restaurantId, start, end, jwtToken);

        assertEquals(restaurantId, result.getRestaurantId());
        assertEquals("Testaurant", result.getRestaurantName());
        assertEquals(BigDecimal.valueOf(80.0), result.getTotalRevenue());
    }

    @Test
    void testRestaurantNotFoundThrowsException() {
        when(jwtService.extractUsername(jwtToken)).thenReturn(username);
        when(accountRepository.findByUsername(username)).thenReturn(Optional.of(owner));
        when(accountRepository.findByEmail(username)).thenReturn(Optional.empty());
        when(restaurantsRepository.findById(restaurantId)).thenReturn(Optional.empty());

        LocalDateTime start = LocalDateTime.now().minusDays(7);
        LocalDateTime end = LocalDateTime.now();

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                reportService.getRestaurantRevenueForPeriod(restaurantId, start, end, jwtToken));

        assertEquals("Restaurant not found", ex.getMessage());
    }

    @Test
    void testWrongOwnerThrowsAccessDeniedException() {
        Accounts anotherUser = new Accounts(); anotherUser.setId(999L);

        when(jwtService.extractUsername(jwtToken)).thenReturn(username);
        when(accountRepository.findByUsername(username)).thenReturn(Optional.of(anotherUser));
        when(accountRepository.findByEmail(username)).thenReturn(Optional.empty());
        when(restaurantsRepository.findById(restaurantId)).thenReturn(Optional.of(restaurant));

        LocalDateTime start = LocalDateTime.now().minusDays(7);
        LocalDateTime end = LocalDateTime.now();

        assertThrows(AccessDeniedException.class, () ->
                reportService.getRestaurantRevenueForPeriod(restaurantId, start, end, jwtToken));
    }

    @Test
    void testNoOrdersReturnsZeroRevenue() {
        when(jwtService.extractUsername(jwtToken)).thenReturn(username);
        when(accountRepository.findByUsername(username)).thenReturn(Optional.of(owner));
        when(accountRepository.findByEmail(username)).thenReturn(Optional.empty());
        when(restaurantsRepository.findById(restaurantId)).thenReturn(Optional.of(restaurant));

        LocalDateTime start = LocalDateTime.now().minusDays(7);
        LocalDateTime end = LocalDateTime.now();

        when(ordersRepository.findOrdersByRestaurantIdAndCreatedAtBetween(restaurantId, start, end))
                .thenReturn(List.of());

        RestaurantPeriodRevenueDTO result = reportService.getRestaurantRevenueForPeriod(restaurantId, start, end, jwtToken);

        assertEquals(BigDecimal.ZERO, result.getTotalRevenue());
    }
}