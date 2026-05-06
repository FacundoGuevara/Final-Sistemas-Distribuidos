package com.mati.curso.springboot.webapp.backendveterinaria.service;

import com.mati.curso.springboot.webapp.backendveterinaria.entity.MenuItem;
import com.mati.curso.springboot.webapp.backendveterinaria.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MenuItemService {
    private final MenuItemRepository menuItemRepository;

    @Autowired
    public MenuItemService(MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    public List<MenuItem> findAll() {
        return menuItemRepository.findAll();
    }

    public List<MenuItem> findAllAvailable() {
        return menuItemRepository.findByAvailableTrue();
    }

    public Optional<MenuItem> findById(Long id) {
        return menuItemRepository.findById(id);
    }

    public MenuItem save(MenuItem menuItem) {
        return menuItemRepository.save(menuItem);
    }

    public void deleteById(Long id) {
        menuItemRepository.deleteById(id);
    }
}
