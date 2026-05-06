package com.mati.curso.springboot.webapp.backendveterinaria.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Service
public class Auth0Service {
    @Value("${auth0.domain}")
    private String domain;
    @Value("${auth0.clientId}")
    private String clientId;
    @Value("${auth0.clientSecret}")
    private String clientSecret;
    @Value("${auth0.audience}")
    private String audience;
    @Value("${auth0.veterinarioRoleId}")
    private String veterinarioRoleId;

    private final RestTemplate restTemplate = new RestTemplate();

    public String getManagementApiToken() {
        String url = "https://" + domain + "/oauth/token";
        Map<String, String> body = new HashMap<>();
        body.put("grant_type", "client_credentials");
        body.put("client_id", clientId);
        body.put("client_secret", clientSecret);
        body.put("audience", audience);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
        return (String) response.getBody().get("access_token");
    }

    public Map<String, Object> createAuth0User(String email, String password) {
        String url = "https://" + domain + "/api/v2/users";
        String token = getManagementApiToken();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);
        Map<String, Object> body = new HashMap<>();
        body.put("email", email);
        body.put("password", password);
        body.put("connection", "Username-Password-Authentication");
        body.put("email_verified", false);
        body.put("app_metadata", Map.of("created_by_admin", true));
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
        return response.getBody();
    }

    public void assignVeterinarioRoleToUser(String userId) {
        String url = "https://" + domain + "/api/v2/users/" + userId + "/roles";
        String token = getManagementApiToken();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);
        Map<String, Object> body = new HashMap<>();
        body.put("roles", List.of(veterinarioRoleId));
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        restTemplate.postForEntity(url, entity, Void.class);
    }
}
