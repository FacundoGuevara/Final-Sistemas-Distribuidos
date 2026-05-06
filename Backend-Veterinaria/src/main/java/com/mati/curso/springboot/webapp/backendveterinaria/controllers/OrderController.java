package com.mati.curso.springboot.webapp.backendveterinaria.controllers;

import com.mati.curso.springboot.webapp.backendveterinaria.entity.Order;
import com.mati.curso.springboot.webapp.backendveterinaria.entity.OrderItem;
import com.mati.curso.springboot.webapp.backendveterinaria.service.OrderService;
import com.mati.curso.springboot.webapp.backendveterinaria.dto.OrderDTO;
import com.mati.curso.springboot.webapp.backendveterinaria.dto.OrderItemDTO;
import com.mati.curso.springboot.webapp.backendveterinaria.repository.PersonaRepository;
import com.mati.curso.springboot.webapp.backendveterinaria.entity.Persona;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/private/orders")
public class OrderController {
    private final OrderService orderService;
    private final PersonaRepository personaRepository;

    @Autowired
    public OrderController(OrderService orderService, PersonaRepository personaRepository) {
        this.orderService = orderService;
        this.personaRepository = personaRepository;
    }

    @PreAuthorize("hasRole('CLIENTE')")
    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(@RequestBody Order order, @AuthenticationPrincipal Jwt jwt) {
        order.setUserId(jwt.getSubject());
        order.setStatus("PENDIENTE");
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        Order created = orderService.save(order);
        return ResponseEntity.ok(mapOrderToDTO(created));
    }

    @PreAuthorize("hasAnyRole('VETERINARIO','ADMIN')")
    @GetMapping
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        List<OrderDTO> dtos = orderService.findAll().stream()
            .map(this::mapOrderToDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PreAuthorize("hasRole('CLIENTE')")
    @GetMapping("/my")
    public ResponseEntity<List<OrderDTO>> getMyOrders(@AuthenticationPrincipal Jwt jwt) {
        List<OrderDTO> dtos = orderService.findByUserId(jwt.getSubject()).stream()
            .map(this::mapOrderToDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PreAuthorize("hasAnyRole('VETERINARIO','ADMIN')")
    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id,
                                                    @RequestBody StatusUpdateRequest statusUpdate) {
        Optional<Order> orderOpt = orderService.findById(id);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.setStatus(statusUpdate.getStatus());
            order.setUpdatedAt(LocalDateTime.now());
            return ResponseEntity.ok(orderService.save(order));
        }
        return ResponseEntity.notFound().build();
    }

    public static class StatusUpdateRequest {
        private String status;
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    private OrderDTO mapOrderToDTO(Order order) {
        String customerEmail = personaRepository.findByAuth0Id(order.getUserId())
            .map(Persona::getEmail).orElse(null);
        return new OrderDTO(
            order.getId(),
            order.getStatus(),
            order.getTotal(),
            order.getCreatedAt(),
            order.getUpdatedAt(),
            customerEmail,
            order.getItems() != null
                ? order.getItems().stream().map(this::mapOrderItemToDTO).collect(Collectors.toList())
                : null
        );
    }

    private OrderItemDTO mapOrderItemToDTO(OrderItem item) {
        String menuItemName = item.getMenuItem() != null ? item.getMenuItem().getName() : null;
        return new OrderItemDTO(item.getId(), item.getQuantity(), item.getPrice(), menuItemName);
    }
}
