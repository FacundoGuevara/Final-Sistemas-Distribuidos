package com.mati.curso.springboot.webapp.backendveterinaria.dto;

public class OrderItemDTO {
    private Long id;
    private Integer quantity;
    private Double price;
    private String menuItemName;

    public OrderItemDTO() {}

    public OrderItemDTO(Long id, Integer quantity, Double price, String menuItemName) {
        this.id = id;
        this.quantity = quantity;
        this.price = price;
        this.menuItemName = menuItemName;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public String getMenuItemName() { return menuItemName; }
    public void setMenuItemName(String menuItemName) { this.menuItemName = menuItemName; }
}
