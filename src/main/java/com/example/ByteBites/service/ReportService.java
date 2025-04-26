package com.example.ByteBites.service;
import com.example.ByteBites.models.Accounts;
import com.example.ByteBites.models.DTO.DelivererRevenueDTO;
import com.example.ByteBites.models.DTO.RestaurantPeriodRevenueDTO;
import com.example.ByteBites.models.DTO.RestaurantRevenueDTO;
import com.example.ByteBites.models.Restaurants;
import com.example.ByteBites.repository.AccountRepository;
import com.example.ByteBites.repository.RestaurantsRepository;
import com.example.ByteBites.security.ApplicationConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import com.example.ByteBites.service.inteface.ReportServiceInterface;
import com.example.ByteBites.repository.OrdersRepository;
import com.example.ByteBites.models.Orders;
import com.example.ByteBites.models.DTO.OrderStatsDTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReportService implements ReportServiceInterface {

    private final OrdersRepository orderRepository;
    private JWTService jwtService;

    @Value("${bonus.threshold}")
    private BigDecimal bonusThreshold;

    private AccountRepository accountRepository;


    private RestaurantsRepository restaurantRepository;


    private ApplicationConfig applicationConfig;


    public ReportService(
            OrdersRepository orderRepository,
            JWTService jwtService,
            AccountRepository accountRepository,
            RestaurantsRepository restaurantRepository,
           ApplicationConfig applicationConfig
    ) {
        this.orderRepository = orderRepository;
        this.jwtService = jwtService;
        this.accountRepository = accountRepository;
        this.restaurantRepository = restaurantRepository;
        this.applicationConfig = applicationConfig;
    }

    @Override
    public OrderStatsDTO getOrderStatistics() {
        List<Orders> allOrders = orderRepository.findAll();
        int totalOrders = allOrders.size();
        double averageValue = totalOrders == 0 ? 0 : allOrders.stream()
                .mapToDouble(Orders::getTotalPrice)
                .average()
                .orElse(0);
        return new OrderStatsDTO(totalOrders, averageValue);
    }
    @Override
    public List<RestaurantRevenueDTO> getRevenuePerRestaurant() {
        return orderRepository.getRevenuePerRestaurant();
    }

    public RestaurantPeriodRevenueDTO getRestaurantRevenueForPeriod(Long restaurantId, LocalDateTime start, LocalDateTime end, String jwtToken) {

        String username = jwtService.extractUsername(jwtToken);


        Accounts account = accountRepository.findByUsername(username)
                .or(() -> accountRepository.findByEmail(username))
                .orElseThrow(() -> new RuntimeException("Account not found"));


        Restaurants restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        if (!restaurant.getOwner().getId().equals(account.getId())) {
            throw new AccessDeniedException("You do not own this restaurant.");
        }


        List<Orders> orders = orderRepository.findOrdersByRestaurantIdAndCreatedAtBetween(restaurantId, start, end);


        BigDecimal total = orders.stream()
                .map(order -> BigDecimal.valueOf(order.getTotalPrice()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);


        return new RestaurantPeriodRevenueDTO(restaurant.getId(), restaurant.getName(), total);
    }

    @Override
    public List<DelivererRevenueDTO> getDelivererIncomeForPeriod(Long restaurantId, LocalDateTime start, LocalDateTime end, String jwtToken) {
        // Step 1: Validate user and ownership
        String username = jwtService.extractUsername(jwtToken);

        Accounts account = accountRepository.findByUsernameIgnoreCase(username)
                .or(() -> accountRepository.findByEmail(username))
                .orElseThrow(() -> new RuntimeException("Account not found"));

        Restaurants restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        if (!restaurant.getOwner().getId().equals(account.getId())) {
            throw new AccessDeniedException("You do not own this restaurant.");
        }

        // Step 2: Fetch revenue data
        List<DelivererRevenueDTO> revenues = orderRepository.getDelivererRevenueForRestaurantAndPeriod(restaurantId, start, end);

        // Step 3: Apply bonus logic
        for (DelivererRevenueDTO dto : revenues) {
            if (dto.getTotalIncome().compareTo(BigDecimal.valueOf(applicationConfig.getBonusThreshold())) >= 0) {
                BigDecimal bonusRevenue = dto.getTotalIncome().multiply(BigDecimal.valueOf(applicationConfig.getBonusMultiplier()));
                dto.setTotalIncome(bonusRevenue);
                dto.setBonusAwarded(true);
            }
        }

        return revenues;
    }


}
