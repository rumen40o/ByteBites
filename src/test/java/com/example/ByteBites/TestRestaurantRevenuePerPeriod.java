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

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

public class TestRestaurantRevenuePerPeriod {

    private JWTService jwtService;
    private AccountRepository accountRepository;
    private RestaurantsRepository restaurantsRepository;
    private OrdersRepository ordersRepository;
    private ReportService reportService;

    @BeforeEach
    void setup() {
        jwtService = Mockito.mock(JWTService.class);
        accountRepository = Mockito.mock(AccountRepository.class);
        restaurantsRepository = Mockito.mock(RestaurantsRepository.class);
        ordersRepository = Mockito.mock(OrdersRepository.class);
        reportService = new ReportService(ordersRepository, jwtService, accountRepository, restaurantsRepository, null);
    }

    @Test
    void testGetRestaurantRevenuePerPeriod() {
        // Arrange
        String jwtToken = "mock.token.here";
        String username = "admin";
        Long restaurantId = 1L;

        LocalDateTime start = LocalDateTime.now().minusDays(7);
        LocalDateTime end = LocalDateTime.now();

        Accounts account = new Accounts();
        account.setId(3L);

        Restaurants restaurant = new Restaurants();
        restaurant.setId(restaurantId);
        restaurant.setName("Testaurant");
        restaurant.setOwner(account);

        Orders order1 = new Orders();
        order1.setTotalPrice(30.00);
        Orders order2 = new Orders();
        order2.setTotalPrice(50.00);

        when(jwtService.extractUsername(jwtToken)).thenReturn(username);
        when(accountRepository.findByUsername(username)).thenReturn(Optional.of(account));
        when(accountRepository.findByEmail(username)).thenReturn(Optional.empty());
        when(restaurantsRepository.findById(restaurantId)).thenReturn(Optional.of(restaurant));
        when(ordersRepository.findOrdersByRestaurantIdAndCreatedAtBetween(restaurantId, start, end))
                .thenReturn(List.of(order1, order2));

        // Act
        RestaurantPeriodRevenueDTO result = reportService.getRestaurantRevenueForPeriod(restaurantId, start, end, jwtToken);

        // Assert
        assertEquals(restaurantId, result.getRestaurantId());
        assertEquals("Testaurant", result.getRestaurantName());
        assertEquals(BigDecimal.valueOf(80.00), result.getTotalRevenue());
    }
}
