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

        if (this.fecha_cracion == null || this.estado.isBlank()) {
            this.estado = "Pendiente";
        }
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
