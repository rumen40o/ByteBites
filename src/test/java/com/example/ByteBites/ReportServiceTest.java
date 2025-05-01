package com.example.ByteBites;

import com.example.ByteBites.models.*;
import com.example.ByteBites.models.DTO.DelivererRevenueDTO;
import com.example.ByteBites.repository.AccountRepository;
import com.example.ByteBites.repository.OrdersRepository;
import com.example.ByteBites.repository.RestaurantsRepository;
import com.example.ByteBites.security.ApplicationConfig;
import com.example.ByteBites.service.JWTService;
import com.example.ByteBites.service.ReportService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ReportServiceTest {

    private ReportService reportService;
    private OrdersRepository ordersRepository;
    private JWTService jwtService;
    private AccountRepository accountRepository;
    private RestaurantsRepository restaurantsRepository;
    private ApplicationConfig applicationConfig;

    @BeforeEach
    void setUp() {
        ordersRepository = mock(OrdersRepository.class);
        jwtService = mock(JWTService.class);
        accountRepository = mock(AccountRepository.class);
        restaurantsRepository = mock(RestaurantsRepository.class);
        applicationConfig = mock(ApplicationConfig.class);

        reportService = new ReportService(ordersRepository, jwtService, accountRepository, restaurantsRepository, applicationConfig);
    }

    @Test
    void testBonusIsAppliedWhenThresholdIsMet() {
        // Arrange
        String jwt = "dummy.jwt.token";
        String username = "admin";
        Long restaurantId = 1L;
        Long delivererId = 102L;
        LocalDateTime start = LocalDateTime.now().minusDays(10);
        LocalDateTime end = LocalDateTime.now();

        BigDecimal income = BigDecimal.valueOf(100);
        BigDecimal threshold = BigDecimal.valueOf(50);
        double multiplier = 1.1;

        DelivererRevenueDTO dto = new DelivererRevenueDTO(delivererId, "GrafDracula", income);

        Accounts mockAccount = new Accounts();
        mockAccount.setId(1L);

        Restaurants mockRestaurant = new Restaurants();
        mockRestaurant.setId(restaurantId);
        mockRestaurant.setOwner(mockAccount);

        when(jwtService.extractUsername(jwt)).thenReturn(username);
        when(accountRepository.findByUsernameIgnoreCase(username)).thenReturn(Optional.of(mockAccount));
        when(restaurantsRepository.findById(restaurantId)).thenReturn(Optional.of(mockRestaurant));
        when(ordersRepository.getDelivererRevenueForRestaurantAndPeriod(restaurantId, start, end)).thenReturn(List.of(dto));
        when(applicationConfig.getBonusThreshold()).thenReturn(threshold.doubleValue());
        when(applicationConfig.getBonusMultiplier()).thenReturn(multiplier);

        // Act
        List<DelivererRevenueDTO> result = reportService.getDelivererIncomeForPeriod(restaurantId, start, end, jwt);

        // Assert
        assertEquals(1, result.size());
        DelivererRevenueDTO updatedDto = result.get(0);
        assertTrue(updatedDto.isBonusAwarded());
        assertEquals(income.multiply(BigDecimal.valueOf(multiplier)), updatedDto.getTotalIncome());
    }
}
