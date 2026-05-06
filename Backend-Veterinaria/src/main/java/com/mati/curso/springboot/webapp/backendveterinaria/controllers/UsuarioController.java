package com.mati.curso.springboot.webapp.backendveterinaria.controllers;

import com.mati.curso.springboot.webapp.backendveterinaria.entity.Persona;
import com.mati.curso.springboot.webapp.backendveterinaria.service.PersonaSyncService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api")
public class UsuarioController {
    @Autowired
    private PersonaSyncService personaSyncService;

    @GetMapping("/me")
    public ResponseEntity<Persona> getMe(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }
        Persona persona = personaSyncService.syncPersonaFromJwt(authHeader);
        return ResponseEntity.ok(persona);
    }
}
