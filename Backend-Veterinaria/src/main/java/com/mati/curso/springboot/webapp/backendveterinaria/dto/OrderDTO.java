package com.mati.curso.springboot.webapp.backendveterinaria.dto;

import java.time.LocalDateTime;
import java.util.List;

public class OrderDTO {
    private Long id;
    private String status;
    private Double total;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String customerEmail;
    private List<OrderItemDTO> items;

    public OrderDTO() {}

    public OrderDTO(Long id, String status, Double total, LocalDateTime createdAt, LocalDateTime updatedAt, String customerEmail, List<OrderItemDTO> items) {
        this.id = id;
        this.status = status;
        this.total = total;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.customerEmail = customerEmail;
        this.items = items;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
    public List<OrderItemDTO> getItems() { return items; }
    public void setItems(List<OrderItemDTO> items) { this.items = items; }
}
