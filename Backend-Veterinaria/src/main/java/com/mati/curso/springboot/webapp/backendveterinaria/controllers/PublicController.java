package com.mati.curso.springboot.webapp.backendveterinaria.controllers;

import com.mati.curso.springboot.webapp.backendveterinaria.entity.MenuItem;
import com.mati.curso.springboot.webapp.backendveterinaria.service.MenuItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/public")
public class PublicController {

    private final MenuItemService menuItemService;

    @Autowired
    public PublicController(MenuItemService menuItemService) {
        this.menuItemService = menuItemService;
    }

    @GetMapping("")
    public ResponseEntity<Map<String, Object>> publicRoute() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Ruta pública general - Acceso libre");
        response.put("status", "success");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/menu")
    public ResponseEntity<List<MenuItem>> getMenu() {
        return ResponseEntity.ok(menuItemService.findAllAvailable());
    }

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> home() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Backend Veterinaria API");
        response.put("version", "1.0.0");
        response.put("status", "running");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
}
