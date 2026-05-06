package com.mati.curso.springboot.webapp.backendveterinaria.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiController {

    @GetMapping("/public")
    public ResponseEntity<Map<String, Object>> publicEndpoint() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Esta es una ruta pública - No requiere autenticación");
        response.put("status", "success");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/private")
    public ResponseEntity<Map<String, Object>> privateEndpoint(@AuthenticationPrincipal Jwt jwt) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Esta es una ruta privada - Requiere token válido de Auth0");
        response.put("status", "success");
        response.put("timestamp", System.currentTimeMillis());
        response.put("user", jwt.getSubject());
        response.put("email", jwt.getClaimAsString("email"));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/public/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Backend-Veterinaria");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
}
