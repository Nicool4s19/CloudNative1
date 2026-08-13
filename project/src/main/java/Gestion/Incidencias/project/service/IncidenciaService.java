package Gestion.Incidencias.project.service;

import Gestion.Incidencias.project.model.Incidencias;
import Gestion.Incidencias.project.repositories.IncidenciaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
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

    public void eliminar(Long id) {
        if (!incidenciaRepository.existsById(id)) {
            throw new RuntimeException(
                    "No existe el incidencia con id: " + id);
        }

        incidenciaRepository.deleteById(id);
    }

}
