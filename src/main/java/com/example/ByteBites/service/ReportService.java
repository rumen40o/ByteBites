package com.example.ByteBites.service;
import com.example.ByteBites.models.Accounts;
import com.example.ByteBites.models.DTO.DelivererRevenueDTO;
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
    public DelivererRevenueDTO getDelivererIncomeForPeriod(Long delivererId, LocalDateTime start, LocalDateTime end, String jwtToken) {
        // 1. Extract username/email from token
        String username = jwtService.extractUsername(jwtToken);

        // 2. Find the authenticated account
        Accounts account = accountRepository.findByUsernameIgnoreCase(username)
                .or(() -> accountRepository.findByEmail(username))
                .orElseThrow(() -> new RuntimeException("Account not found"));


        if (!account.getId().equals(delivererId)) {
            throw new AccessDeniedException("You are not allowed to view this deliverer’s income.");
        }


        List<Orders> orders = orderRepository. findOrdersDeliveredByDelivererBetween(delivererId, start, end);


        BigDecimal total = orders.stream()
                .map(order -> BigDecimal.valueOf(order.getTotalPrice()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);


        return new DelivererRevenueDTO(delivererId, account.getUsername(), total);
    }

}
