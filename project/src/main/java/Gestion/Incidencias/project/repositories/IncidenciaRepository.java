package Gestion.Incidencias.project.repositories;

import Gestion.Incidencias.project.model.Incidencias;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IncidenciaRepository extends JpaRepository<Incidencias, Long> {
}
