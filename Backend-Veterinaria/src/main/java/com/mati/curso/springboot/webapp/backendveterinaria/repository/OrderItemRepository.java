package com.mati.curso.springboot.webapp.backendveterinaria.repository;

import com.mati.curso.springboot.webapp.backendveterinaria.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByMenuItemId(Long menuItemId);
    void deleteByMenuItemId(Long menuItemId);
}
