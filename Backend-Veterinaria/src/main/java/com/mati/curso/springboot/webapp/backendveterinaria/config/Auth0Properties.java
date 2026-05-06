package com.mati.curso.springboot.webapp.backendveterinaria.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "auth0")
public class Auth0Properties {
    private String audience;
    private String issuer;
    private String secret;

    public String getAudience() { return audience; }
    public void setAudience(String audience) { this.audience = audience; }
    public String getIssuer() { return issuer; }
    public void setIssuer(String issuer) { this.issuer = issuer; }
    public String getSecret() { return secret; }
    public void setSecret(String secret) { this.secret = secret; }
}
