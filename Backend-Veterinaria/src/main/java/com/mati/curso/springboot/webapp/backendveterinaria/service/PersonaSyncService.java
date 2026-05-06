package com.mati.curso.springboot.webapp.backendveterinaria.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.mati.curso.springboot.webapp.backendveterinaria.entity.Persona;
import com.mati.curso.springboot.webapp.backendveterinaria.repository.PersonaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PersonaSyncService {
    @Autowired
    private PersonaRepository personaRepository;

    public Persona syncPersonaFromJwt(String jwtToken) {
        DecodedJWT jwt = JWT.decode(jwtToken.replace("Bearer ", ""));

        String auth0Id = jwt.getSubject();
        String email = jwt.getClaim("email").asString();
        String nombre = jwt.getClaim("name").asString();
        List<String> roles = jwt.getClaim("https://cafeteria.com/roles").asList(String.class);
        String rol = (roles != null && !roles.isEmpty()) ? roles.get(0) : "CLIENTE";

        return personaRepository.findByAuth0Id(auth0Id)
            .map(persona -> {
                boolean updated = false;
                if (email != null && !email.equals(persona.getEmail())) {
                    persona.setEmail(email);
                    updated = true;
                }
                if (nombre != null && !nombre.equals(persona.getNombre())) {
                    persona.setNombre(nombre);
                    updated = true;
                }
                if (rol != null && !rol.equals(persona.getRol())) {
                    persona.setRol(rol);
                    updated = true;
                }
                if (updated) personaRepository.save(persona);
                return persona;
            })
            .orElseGet(() -> {
                Persona persona = new Persona();
                persona.setAuth0Id(auth0Id);
                persona.setEmail(email);
                persona.setNombre(nombre);
                persona.setRol(rol);
                return personaRepository.save(persona);
            });
    }
}
