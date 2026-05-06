package com.mati.curso.springboot.webapp.backendveterinaria.service;

import com.mati.curso.springboot.webapp.backendveterinaria.entity.Order;
import com.mati.curso.springboot.webapp.backendveterinaria.entity.MenuItem;
import com.mati.curso.springboot.webapp.backendveterinaria.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final MenuItemService menuItemService;

    @Autowired
    public OrderService(OrderRepository orderRepository, MenuItemService menuItemService) {
        this.orderRepository = orderRepository;
        this.menuItemService = menuItemService;
    }

    public Order save(Order order) {
        double total = 0.0;
        if (order.getItems() != null) {
            for (var item : order.getItems()) {
                item.setOrder(order);
                if (item.getMenuItem() != null && item.getMenuItem().getId() != null) {
                    MenuItem menuItem = menuItemService.findById(item.getMenuItem().getId())
                        .orElseThrow(() -> new RuntimeException("MenuItem no encontrado"));
                    item.setMenuItem(menuItem);
                    item.setPrice(menuItem.getPrice());
                    total += menuItem.getPrice() * item.getQuantity();
                }
            }
        }
        order.setTotal(total);
        return orderRepository.save(order);
    }

    public List<Order> findAll() {
        return orderRepository.findAll();
    }

    public Optional<Order> findById(Long id) {
        return orderRepository.findById(id);
    }

    public List<Order> findByUserId(String userId) {
        return orderRepository.findByUserId(userId);
    }

    public void deleteById(Long id) {
        orderRepository.deleteById(id);
    }
}
