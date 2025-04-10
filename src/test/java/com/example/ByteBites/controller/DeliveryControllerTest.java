package com.example.ByteBites.controller;

import com.example.ByteBites.models.*;
import com.example.ByteBites.service.inteface.DeliveryServiceInterface;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class DeliveryControllerTest {

    @Mock
    private DeliveryServiceInterface deliveryService;

    @InjectMocks
    private DeliveryController deliveryController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAvailableDeliveries() {
        Orders order1 = new Orders();
        Orders order2 = new Orders();
        List<Orders> mockOrders = Arrays.asList(order1, order2);

        when(deliveryService.getAvailableDeliveries()).thenReturn(mockOrders);

        ResponseEntity<List<Orders>> response = deliveryController.getAvailableDeliveries();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(2, response.getBody().size());
        verify(deliveryService, times(1)).getAvailableDeliveries();
    }

    @Test
    void testAcceptDelivery() {
        Long orderId = 1L;
        Accounts deliverer = new Accounts();
        deliverer.setId(100L);

        when(deliveryService.acceptDelivery(orderId, deliverer))
                .thenReturn("Order accepted successfully");

        ResponseEntity<String> response = deliveryController.acceptDelivery(orderId, deliverer);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Order accepted successfully", response.getBody());
        verify(deliveryService, times(1)).acceptDelivery(orderId, deliverer);
    }

    @Test
    void testUpdateDeliveryStatus() {
        Long deliveryId = 10L;
        DeliveryStatus newStatus = DeliveryStatus.IN_PROGRESS;

        when(deliveryService.updateDeliveryStatus(deliveryId, newStatus))
                .thenReturn("Delivery status updated");

        ResponseEntity<String> response = deliveryController.updateDeliveryStatus(deliveryId, newStatus);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Delivery status updated", response.getBody());
        verify(deliveryService, times(1)).updateDeliveryStatus(deliveryId, newStatus);
    }

    @Test
    void testGetDeliveriesByDeliver() {
        Long deliverId = 200L;
        Deliveries d1 = new Deliveries();
        Deliveries d2 = new Deliveries();
        List<Deliveries> mockList = Arrays.asList(d1, d2);

        when(deliveryService.getDeliveriesByDeliver(deliverId)).thenReturn(mockList);

        ResponseEntity<List<Deliveries>> response = deliveryController.getDeliveriesByDeliver(deliverId);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(2, response.getBody().size());
        verify(deliveryService, times(1)).getDeliveriesByDeliver(deliverId);
    }
}

