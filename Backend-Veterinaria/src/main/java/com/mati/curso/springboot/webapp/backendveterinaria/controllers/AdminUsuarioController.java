package com.mati.curso.springboot.webapp.backendveterinaria.controllers;

import com.mati.curso.springboot.webapp.backendveterinaria.entity.Persona;
import com.mati.curso.springboot.webapp.backendveterinaria.repository.PersonaRepository;
import com.mati.curso.springboot.webapp.backendveterinaria.service.Auth0Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/usuarios")
public class AdminUsuarioController {
    @Autowired
    private PersonaRepository personaRepository;
    @Autowired
    private Auth0Service auth0Service;

    @GetMapping("")
    public ResponseEntity<Iterable<Persona>> listarUsuarios() {
        return ResponseEntity.ok(personaRepository.findAll());
    }

    @GetMapping("/buscar")
    public ResponseEntity<Persona> buscarUsuario(@RequestParam(required = false) String email,
                                                  @RequestParam(required = false) String nombre) {
        if (email != null) {
            return personaRepository.findByEmail(email)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } else if (nombre != null) {
            return personaRepository.findAll().stream()
                    .filter(p -> nombre.equalsIgnoreCase(p.getNombre()))
                    .findFirst()
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Persona> verUsuarioPorId(@PathVariable Long id) {
        return personaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
