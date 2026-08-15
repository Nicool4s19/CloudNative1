# Decisiones de Diseño y Arquitectura — Mini Help Desk

Este documento justifica las principales decisiones tecnológicas tomadas por el equipo para el desarrollo y despliegue del sistema.

---

## 1. Frontend: React + Vite + Vanilla CSS
- **Alternativa considerada:** Next.js o Angular.
- **Elección:** React inicializado con Vite y estilizado con Vanilla CSS.
- **Justificación:** 
  - **Vite** ofrece un entorno de desarrollo sumamente rápido mediante ESM nativos, además de generar un bundle estático extremadamente optimizado para producción.
  - Para un Help Desk interno de baja complejidad, Next.js introduce sobrecarga innecesaria (Server-Side Rendering, enrutamiento complejo) que no aporta valor directo al CRUD básico solicitado.
  - **Vanilla CSS** se escogió para tener un control estricto y preciso sobre la estética visual premium (glassmorphism, animaciones fluidas y variables de color consistentes), evitando dependencias externas de librerías CSS o Tailwind que pueden complicar la compatibilidad y legibilidad del código para fines educativos.

---

## 2. Backend: Java 21 + Spring Boot 4.x
- **Alternativa considerada:** Node.js (Express/NestJS) o Python (FastAPI).
- **Elección:** Java 21 + Spring Boot 4.0.0.
- **Justificación:**
  - Se utiliza el stack nativo definido para la asignatura, que proporciona un ecosistema robusto y tipado para la API REST corporativa.
  - El uso de **Java 21** nos permite aprovechar mejoras en el lenguaje (como Virtual Threads si fueran requeridos) y una sintaxis más moderna.
  - **Spring Boot 4.x** (junto con Spring Data JPA y Hibernate) reduce drásticamente el código repetitivo para el acceso a datos e inyección de dependencias.

---

## 3. Base de Datos: MySQL 8.0
- **Alternativa considerada:** PostgreSQL o base de datos en memoria (H2).
- **Elección:** MySQL 8.0.
- **Justificación:**
  - El proyecto original venía configurado con el driver de MySQL (`mysql-connector-j`). Para mantener la compatibilidad y no alterar la configuración inicial de Maven, decidimos persistir con MySQL.
  - Es una base de datos relacional estándar de la industria, ideal para mapear relaciones de incidencias y mantener integridad referencial.
  - H2 en memoria no cumpliría el requerimiento de persistencia física exigido para cuando los contenedores se detienen y recrean.

---

## 4. Contenerización y Orquestación: Docker y Docker Compose
- **Alternativa considerada:** Ejecución manual local con servidores instalados en el host.
- **Elección:** Contenedores independientes para Frontend, Backend y BD, coordinados por Docker Compose.
- **Justificación:**
  - Asegura que la aplicación se ejecute de la misma manera en la máquina del desarrollador como en la del docente, resolviendo el problema clásico de "en mi máquina sí funciona".
  - Permite levantar todo el stack tecnológico (Servidor web, Servidor de aplicaciones y Base de datos relacional) con una única instrucción: `docker compose up --build`.

---

## 5. Estrategia de Build Multi-stage en Dockerfiles
- **Justificación:**
  - Para el backend, la primera fase utiliza una imagen con Maven para compilar y empaquetar el código fuente, mientras que la segunda fase solo copia el artefacto `.jar` final sobre una imagen JRE de Java 21 muy ligera. Esto reduce el tamaño de la imagen final y aumenta la seguridad al omitir las herramientas de compilación en el contenedor en ejecución.
  - Para el frontend, se compilan los archivos estáticos en la fase de build, y luego se sirven usando un servidor Nginx mínimo, lo que es infinitamente más eficiente que mantener un servidor Node.js corriendo para servir archivos HTML/JS estáticos.
