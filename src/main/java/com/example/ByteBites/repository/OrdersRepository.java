package com.example.ByteBites.repository;

import com.example.ByteBites.models.Accounts;
import com.example.ByteBites.models.DTO.RestaurantRevenueDTO;
import com.example.ByteBites.models.OrderStatus;
import com.example.ByteBites.models.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface OrdersRepository extends JpaRepository<Orders, Long> {
    List<Orders> findByCustomer(Accounts customer);

    List<Orders> findByStatus(OrderStatus status);

    List<Orders> findByRestaurantId(Long id);

    @Query("SELECT SUM(o.totalPrice) FROM Orders o")
    Double getTotalRevenue();

    @Query("""
    SELECT new com.example.ByteBites.models.DTO.RestaurantRevenueDTO(r.name, SUM(o.totalPrice))
    FROM Orders o
    JOIN o.restaurant r
    GROUP BY r.name
""")
    List<RestaurantRevenueDTO> getRevenuePerRestaurant();

    @Query("SELECT o FROM Orders o WHERE o.restaurant.id = :restaurantId AND o.createdAt BETWEEN :start AND :end")
    List<Orders> findOrdersByRestaurantIdAndCreatedAtBetween(
            @Param("restaurantId") Long restaurantId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query("""
    SELECT o FROM Orders o
    JOIN Deliveries d ON o.id = d.order.id
    WHERE d.deliver.id = :delivererId
    AND o.createdAt BETWEEN :start AND :end
""")
    List<Orders> findOrdersDeliveredByDelivererBetween(
            @Param("delivererId") Long delivererId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );



}
