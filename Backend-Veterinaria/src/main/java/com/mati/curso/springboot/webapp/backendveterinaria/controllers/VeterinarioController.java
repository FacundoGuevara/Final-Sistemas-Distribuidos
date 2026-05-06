package com.mati.curso.springboot.webapp.backendveterinaria.controllers;

import com.mati.curso.springboot.webapp.backendveterinaria.dto.CreateVeterinarioRequestDTO;
import com.mati.curso.springboot.webapp.backendveterinaria.dto.UserVeterinarioDTO;
import com.mati.curso.springboot.webapp.backendveterinaria.entity.Persona;
import com.mati.curso.springboot.webapp.backendveterinaria.repository.PersonaRepository;
import com.mati.curso.springboot.webapp.backendveterinaria.service.Auth0Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/private/users")
public class VeterinarioController {
    private final PersonaRepository personaRepository;
    private final Auth0Service auth0Service;

    @Autowired
    public VeterinarioController(PersonaRepository personaRepository, Auth0Service auth0Service) {
        this.personaRepository = personaRepository;
        this.auth0Service = auth0Service;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<UserVeterinarioDTO>> getVeterinarios(@RequestParam(required = false) String role) {
        List<Persona> personas;
        if (role != null && role.equalsIgnoreCase("veterinario")) {
            personas = personaRepository.findAll().stream()
                .filter(p -> p.getRol() != null && p.getRol().equalsIgnoreCase("veterinario"))
                .collect(Collectors.toList());
        } else {
            personas = personaRepository.findAll();
        }
        List<UserVeterinarioDTO> dtos = personas.stream().map(this::mapToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> createVeterinario(@RequestBody CreateVeterinarioRequestDTO request) {
        if (personaRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("El email ya está registrado");
        }
        Map<String, Object> auth0User = auth0Service.createAuth0User(request.getEmail(), request.getPassword());
        String userId = (String) auth0User.get("user_id");
        if (userId == null) {
            return ResponseEntity.status(500).body("Error creando usuario en Auth0");
        }
        auth0Service.assignVeterinarioRoleToUser(userId);
        Persona persona = new Persona();
        persona.setEmail(request.getEmail());
        persona.setNombre(request.getNombre() != null ? request.getNombre() : request.getEmail());
        persona.setRol("VETERINARIO");
        persona.setAuth0Id(userId);
        Persona saved = personaRepository.save(persona);
        return ResponseEntity.ok(mapToDTO(saved));
    }

    private UserVeterinarioDTO mapToDTO(Persona persona) {
        return new UserVeterinarioDTO(
            persona.getId(),
            persona.getEmail(),
            persona.getNombre(),
            List.of(persona.getRol())
        );
    }
}
