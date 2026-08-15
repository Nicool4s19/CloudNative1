package Gestion.Incidencias.project.service;

import Gestion.Incidencias.project.model.Incidencias;
import Gestion.Incidencias.project.repositories.IncidenciaRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class IncidenciaService {

    private final IncidenciaRepository incidenciaRepository;

    public IncidenciaService(IncidenciaRepository incidenciaRepository) {
        this.incidenciaRepository = incidenciaRepository;
    }

    public List<Incidencias> obtnerTodas() {
        return incidenciaRepository.findAll();
    }

    public List<Incidencias> buscar(String estado, String prioridad, String search) {
        String est = (estado == null || estado.trim().isEmpty()) ? null : estado.toUpperCase();
        String prio = (prioridad == null || prioridad.trim().isEmpty()) ? null : prioridad.toUpperCase();
        String src = (search == null || search.trim().isEmpty()) ? null : search;
        return incidenciaRepository.buscarIncidencias(est, prio, src);
    }

    public Optional<Incidencias> obtenerPorId(Long id) {
        return incidenciaRepository.findById(id);
    }

    public Incidencias crear(Incidencias incidencia) {
        return incidenciaRepository.save(incidencia);
    }

    public Incidencias actualizar(Long id, Incidencias datosNuevos) {

        Incidencias incidencia = incidenciaRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("No existe el incidencia con id: " + id));

        incidencia.setTitulo(datosNuevos.getTitulo());
        incidencia.setDescripcion(datosNuevos.getDescripcion());
        incidencia.setCategoria(datosNuevos.getCategoria());
        incidencia.setPrioridad(datosNuevos.getPrioridad());
        incidencia.setEstado(datosNuevos.getEstado());
        incidencia.setResponsable(datosNuevos.getResponsable());

        return incidenciaRepository.save(incidencia);
    }

    public Incidencias cambiarEstado(Long id, String nuevoEstado) {
        Incidencias incidencia = incidenciaRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("No existe la incidencia con id: " + id));
        
        if (nuevoEstado == null || nuevoEstado.trim().isEmpty()) {
            throw new IllegalArgumentException("El estado no puede estar vacio");
        }
        
        incidencia.setEstado(nuevoEstado.toUpperCase());
        return incidenciaRepository.save(incidencia);
    }

    public Map<String, Long> obtenerEstadisticas() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("ABIERTA", 0L);
        stats.put("EN_PROGRESO", 0L);
        stats.put("RESUELTA", 0L);

        List<Object[]> resultados = incidenciaRepository.countByEstado();
        for (Object[] fila : resultados) {
            String estado = (String) fila[0];
            Long count = (Long) fila[1];
            if (estado != null) {
                stats.put(estado.toUpperCase(), count);
            }
        }
        return stats;
    }

    public void eliminar(Long id) {
        if (!incidenciaRepository.existsById(id)) {
            throw new RuntimeException(
                    "No existe el incidencia con id: " + id);
        }

        incidenciaRepository.deleteById(id);
    }

}
