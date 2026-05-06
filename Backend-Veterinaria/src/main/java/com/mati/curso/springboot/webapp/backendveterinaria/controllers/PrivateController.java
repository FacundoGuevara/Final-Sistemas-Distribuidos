package com.mati.curso.springboot.webapp.backendveterinaria.controllers;

import com.mati.curso.springboot.webapp.backendveterinaria.entity.MenuItem;
import com.mati.curso.springboot.webapp.backendveterinaria.repository.OrderItemRepository;
import com.mati.curso.springboot.webapp.backendveterinaria.service.MenuItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/private")
public class PrivateController {

    private final MenuItemService menuItemService;
    private final OrderItemRepository orderItemRepository;

    @Autowired
    public PrivateController(MenuItemService menuItemService, OrderItemRepository orderItemRepository) {
        this.menuItemService = menuItemService;
        this.orderItemRepository = orderItemRepository;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> privateRoute(@AuthenticationPrincipal Jwt jwt) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Ruta privada - Requiere autenticación con Auth0");
        response.put("status", "success");
        response.put("timestamp", System.currentTimeMillis());
        response.put("user", jwt.getSubject());
        response.put("email", jwt.getClaimAsString("email"));
        response.put("name", jwt.getClaimAsString("name"));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> userProfile(@AuthenticationPrincipal Jwt jwt) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Perfil del usuario autenticado");
        response.put("status", "success");
        response.put("timestamp", System.currentTimeMillis());
        response.put("user_id", jwt.getSubject());
        response.put("email", jwt.getClaimAsString("email"));
        response.put("name", jwt.getClaimAsString("name"));
        response.put("picture", jwt.getClaimAsString("picture"));
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/menu")
    public ResponseEntity<List<MenuItem>> getAllMenuItems() {
        return ResponseEntity.ok(menuItemService.findAll());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/menu")
    public ResponseEntity<MenuItem> createMenuItem(@RequestBody MenuItem menuItem) {
        return ResponseEntity.ok(menuItemService.save(menuItem));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/menu/{id}")
    public ResponseEntity<MenuItem> updateMenuItem(@PathVariable Long id, @RequestBody MenuItem menuItem) {
        return menuItemService.findById(id)
                .map(existing -> {
                    menuItem.setId(id);
                    return ResponseEntity.ok(menuItemService.save(menuItem));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/menu/{id}")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable Long id) {
        if (menuItemService.findById(id).isPresent()) {
            orderItemRepository.deleteByMenuItemId(id);
            menuItemService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
