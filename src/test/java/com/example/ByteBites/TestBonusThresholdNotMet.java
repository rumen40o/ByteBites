package com.example.ByteBites;

import com.example.ByteBites.models.Accounts;
import com.example.ByteBites.models.DTO.DelivererRevenueDTO;
import com.example.ByteBites.models.Restaurants;
import com.example.ByteBites.repository.AccountRepository;
import com.example.ByteBites.repository.OrdersRepository;
import com.example.ByteBites.repository.RestaurantsRepository;
import com.example.ByteBites.security.ApplicationConfig;
import com.example.ByteBites.service.JWTService;
import com.example.ByteBites.service.ReportService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

public class TestBonusThresholdNotMet {

    private ReportService reportService;
    private AccountRepository accountRepository;
    private RestaurantsRepository restaurantsRepository;
    private OrdersRepository ordersRepository;
    private JWTService jwtService;
    private ApplicationConfig applicationConfig;

    private Accounts mockAccount;
    private Restaurants mockRestaurant;

    @BeforeEach
    void setUp() {
        accountRepository = mock(AccountRepository.class);
        restaurantsRepository = mock(RestaurantsRepository.class);
        ordersRepository = mock(OrdersRepository.class);
        jwtService = mock(JWTService.class);
        applicationConfig = mock(ApplicationConfig.class);

        reportService = new ReportService(
                ordersRepository,
                jwtService,
                accountRepository,
                restaurantsRepository,
                applicationConfig
        );

        mockAccount = new Accounts();
        mockAccount.setId(1L);

        mockRestaurant = new Restaurants();
        mockRestaurant.setId(1L);
        mockRestaurant.setOwner(mockAccount);
    }

    @Test
    void testBonusThresholdNotMet() {
        // Arrange
        String jwt = "mock.jwt.token";
        Long restaurantId = 1L;
        LocalDateTime start = LocalDateTime.now().minusDays(7);
        LocalDateTime end = LocalDateTime.now();
        BigDecimal income = BigDecimal.valueOf(10.00); // below the threshold
        double multiplier = 1.10;

        DelivererRevenueDTO dto = new DelivererRevenueDTO(1L, "GrafDracula", income);

        when(jwtService.extractUsername(jwt)).thenReturn("GrafDracula");
        when(accountRepository.findByUsernameIgnoreCase(anyString())).thenReturn(Optional.of(mockAccount));
        when(accountRepository.findByEmail(anyString())).thenReturn(Optional.of(mockAccount));
        when(restaurantsRepository.findById(restaurantId)).thenReturn(Optional.of(mockRestaurant));
        when(ordersRepository.getDelivererRevenueForRestaurantAndPeriod(restaurantId, start, end)).thenReturn(List.of(dto));
        when(applicationConfig.getBonusThreshold()).thenReturn(20.00);
        when(applicationConfig.getBonusMultiplier()).thenReturn(multiplier);

        // Act
        List<DelivererRevenueDTO> result = reportService.getDelivererIncomeForPeriod(restaurantId, start, end, jwt);

        // Assert
        assertEquals(1, result.size());
        DelivererRevenueDTO updatedDto = result.get(0);
        assertFalse(updatedDto.isBonusAwarded());
        assertEquals(income, updatedDto.getTotalIncome()); // income should not change
    }
}
