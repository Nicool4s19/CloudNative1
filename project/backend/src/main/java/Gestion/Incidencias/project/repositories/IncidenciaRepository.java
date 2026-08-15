package Gestion.Incidencias.project.repositories;

import Gestion.Incidencias.project.model.Incidencias;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidenciaRepository extends JpaRepository<Incidencias, Long> {

    @Query("SELECT i FROM Incidencias i WHERE " +
           "(:estado IS NULL OR i.estado = :estado) AND " +
           "(:prioridad IS NULL OR i.prioridad = :prioridad) AND " +
           "(:search IS NULL OR LOWER(i.titulo) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(i.descripcion) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Incidencias> buscarIncidencias(
            @Param("estado") String estado,
            @Param("prioridad") String prioridad,
            @Param("search") String search
    );

    @Query("SELECT i.estado, COUNT(i) FROM Incidencias i GROUP BY i.estado")
    List<Object[]> countByEstado();
}
