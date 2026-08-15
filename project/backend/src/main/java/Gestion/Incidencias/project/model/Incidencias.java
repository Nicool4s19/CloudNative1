package Gestion.Incidencias.project.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

@Entity
@Table(name = "incidencias")
public class Incidencias {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El titulo es obligatorio")
    @Column(nullable = false, length = 150)
    private String titulo;

    @NotBlank(message = "La descripcion es obligatoria")
    @Column(nullable = false, length = 150)
    private String descripcion;

    private String categoria;
    private String prioridad;
    private String estado;
    private String responsable;

    @Column(name= "Fecha_cracion")
    private LocalDateTime fecha_cracion;

    public Incidencias() {
    }

    @PrePersist
    public void prePersist() {
        this.fecha_cracion = LocalDateTime.now();

        if (this.estado == null || this.estado.isBlank()) {
            this.estado = "ABIERTA";
        } else {
            this.estado = this.estado.toUpperCase();
        }

        if (this.prioridad == null || this.prioridad.isBlank()) {
            this.prioridad = "MEDIA";
        } else {
            this.prioridad = this.prioridad.toUpperCase();
        }

        validarCampos();
    }

    public void validarCampos() {
        if (this.estado != null) {
            String est = this.estado.toUpperCase();
            if (!est.equals("ABIERTA") && !est.equals("EN_PROGRESO") && !est.equals("RESUELTA")) {
                throw new IllegalArgumentException("Estado no valido. Debe ser ABIERTA, EN_PROGRESO o RESUELTA.");
            }
            this.estado = est;
        }
        if (this.prioridad != null) {
            String prio = this.prioridad.toUpperCase();
            if (!prio.equals("BAJA") && !prio.equals("MEDIA") && !prio.equals("ALTA")) {
                throw new IllegalArgumentException("Prioridad no valida. Debe ser BAJA, MEDIA o ALTA.");
            }
            this.prioridad = prio;
        }
    }

    @PreUpdate
    public void preUpdate() {
        validarCampos();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getPrioridad() {
        return prioridad;
    }

    public void setPrioridad(String prioridad) {
        this.prioridad = prioridad;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getResponsable() {
        return responsable;
    }

    public void setResponsable(String responsable) {
        this.responsable = responsable;
    }

    public LocalDateTime getFecha_cracion() {
        return fecha_cracion;
    }

    public void setFecha_cracion(LocalDateTime fecha_cracion) {
        this.fecha_cracion = fecha_cracion;
    }
}
