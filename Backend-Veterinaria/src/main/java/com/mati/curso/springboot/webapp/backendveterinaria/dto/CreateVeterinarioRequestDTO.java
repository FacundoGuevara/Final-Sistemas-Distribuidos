package com.mati.curso.springboot.webapp.backendveterinaria.dto;

public class CreateVeterinarioRequestDTO {
    private String email;
    private String password;
    private String nombre;

    public CreateVeterinarioRequestDTO() {}

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
}
