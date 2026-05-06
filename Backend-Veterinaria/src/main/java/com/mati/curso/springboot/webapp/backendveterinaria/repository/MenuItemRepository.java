package com.mati.curso.springboot.webapp.backendveterinaria.repository;

import com.mati.curso.springboot.webapp.backendveterinaria.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    java.util.List<MenuItem> findByAvailableTrue();
}
