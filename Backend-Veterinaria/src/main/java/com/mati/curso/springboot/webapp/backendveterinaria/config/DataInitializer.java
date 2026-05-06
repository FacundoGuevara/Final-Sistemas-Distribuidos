package com.mati.curso.springboot.webapp.backendveterinaria.config;

import com.mati.curso.springboot.webapp.backendveterinaria.entity.MenuItem;
import com.mati.curso.springboot.webapp.backendveterinaria.repository.MenuItemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initMenuItems(MenuItemRepository menuItemRepository) {
        return args -> {
            if (menuItemRepository.count() > 0) return;

            List<MenuItem> servicios = List.of(
                menuItem("Consulta General", "Revisión clínica completa de tu mascota con diagnóstico y recomendaciones.", 3500.0, "Consulta General", true),
                menuItem("Vacunación Antirrábica", "Vacuna obligatoria contra la rabia para perros y gatos.", 2500.0, "Vacunación", true),
                menuItem("Vacunación Séxtuple", "Protección contra las principales enfermedades infecciosas caninas.", 3800.0, "Vacunación", true),
                menuItem("Castración Macho", "Cirugía de esterilización para machos con anestesia general y seguimiento.", 18000.0, "Cirugía", true),
                menuItem("Castración Hembra", "Cirugía de esterilización para hembras con anestesia general y seguimiento.", 24000.0, "Cirugía", true),
                menuItem("Baño y Peluquería Pequeño", "Baño, secado, corte de pelo y uñas para razas pequeñas.", 4500.0, "Peluquería y Baño", true),
                menuItem("Baño y Peluquería Grande", "Baño, secado, corte de pelo y uñas para razas grandes.", 7000.0, "Peluquería y Baño", true),
                menuItem("Limpieza Dental", "Destartarización y limpieza profunda de la cavidad bucal bajo anestesia.", 12000.0, "Odontología", true),
                menuItem("Radiografía", "Diagnóstico por imagen digital para detección de fracturas y patologías internas.", 6500.0, "Diagnóstico por Imagen", true),
                menuItem("Ecografía Abdominal", "Estudio ecográfico para evaluar órganos abdominales.", 8000.0, "Diagnóstico por Imagen", true),
                menuItem("Análisis de Sangre Completo", "Hemograma y bioquímica sérica para evaluación del estado de salud general.", 5500.0, "Análisis Clínicos", true),
                menuItem("Atención de Urgencias", "Atención inmediata ante emergencias veterinarias las 24 horas.", 9000.0, "Urgencias", true)
            );

            menuItemRepository.saveAll(servicios);
        };
    }

    private MenuItem menuItem(String name, String description, Double price, String category, Boolean available) {
        MenuItem item = new MenuItem();
        item.setName(name);
        item.setDescription(description);
        item.setPrice(price);
        item.setCategory(category);
        item.setAvailable(available);
        return item;
    }
}
