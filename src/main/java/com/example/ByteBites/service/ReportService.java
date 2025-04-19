package com.example.ByteBites.service;
import com.example.ByteBites.models.Accounts;
import com.example.ByteBites.models.DTO.RestaurantPeriodRevenueDTO;
import com.example.ByteBites.models.DTO.RestaurantRevenueDTO;
import com.example.ByteBites.models.Restaurants;
import com.example.ByteBites.repository.AccountRepository;
import com.example.ByteBites.repository.RestaurantsRepository;
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



    private AccountRepository accountRepository;


    private RestaurantsRepository restaurantRepository;





    public ReportService(
            OrdersRepository orderRepository,
            JWTService jwtService,
            AccountRepository accountRepository,
            RestaurantsRepository restaurantRepository
    ) {
        this.orderRepository = orderRepository;
        this.jwtService = jwtService;
        this.accountRepository = accountRepository;
        this.restaurantRepository = restaurantRepository;
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
        // 1. Get the username/email from the JWT
        String username = jwtService.extractUsername(jwtToken);

        // 2. Find the authenticated account
        Accounts account = accountRepository.findByUsername(username)
                .or(() -> accountRepository.findByEmail(username))
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // 3. Get the restaurant and check ownership
        Restaurants restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        if (!restaurant.getOwner().getId().equals(account.getId())) {
            throw new AccessDeniedException("You do not own this restaurant.");
        }

        // 4. Fetch orders in the time range
        List<Orders> orders = orderRepository.findOrdersByRestaurantIdAndCreatedAtBetween(restaurantId, start, end);

        // 5. Sum up the total revenue
        BigDecimal total = orders.stream()
                .map(order -> BigDecimal.valueOf(order.getTotalPrice()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 6. Return the DTO
        return new RestaurantPeriodRevenueDTO(restaurant.getId(), restaurant.getName(), total);
    }

}
