package Gestion.Incidencias.project.controller;

import Gestion.Incidencias.project.model.Incidencias;
import Gestion.Incidencias.project.service.IncidenciaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/incidencias")
@CrossOrigin(origins = "*")
public class IncidenciaController {

    private final IncidenciaService incidenciaService;

    public IncidenciaController(IncidenciaService incidenciaService) {
        this.incidenciaService = incidenciaService;
    }

    //Listar Todas con filtros
    @GetMapping
    public List<Incidencias> ObtenerIncidencias(
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) String prioridad,
            @RequestParam(required = false) String search) {
        return incidenciaService.buscar(estado, prioridad, search);
    }

    //Obtener estadísticas
    @GetMapping("/stats")
    public Map<String, Long> obtenerEstadisticas() {
        return incidenciaService.obtenerEstadisticas();
    }

    //Buscar por ID
    @GetMapping("/{id}")
    public ResponseEntity<Incidencias> ObtenerIncidencia(@PathVariable Long id) {
        return incidenciaService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    //Crear
    @PostMapping
    public Incidencias crear(
            @Valid @RequestBody Incidencias incidencias){
        return incidenciaService.crear(incidencias);
    }

    // Actualizar
    @PutMapping("/{id}")
    public Incidencias actualizar(
            @PathVariable Long id,
            @Valid @RequestBody Incidencias incidencias) {
        return incidenciaService.actualizar(id, incidencias);
    }

    // Cambio rápido de estado
    @PatchMapping("/{id}/estado")
    public Incidencias cambiarEstado(
            @PathVariable Long id,
            @RequestParam String nuevoEstado) {
        return incidenciaService.cambiarEstado(id, nuevoEstado);
    }

    //Eliminar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        incidenciaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

}
