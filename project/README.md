# Incidencias Help Desk — Cloud Native Diagnostics

## 1. Nombre del Proyecto
**Mini Help Desk — Sistema de Registro y Seguimiento de Incidencias Técnicas**

## 2. Integrantes
- Nicolas (Nicool4s19)
- Integrante Colaborador

## 3. Problema que Resuelve
En pequeñas y medianas organizaciones, la comunicación de incidentes técnicos (como fallas de hardware, problemas de conectividad o errores de software) suele realizarse mediante canales informales (chats, correo no estructurado, llamadas de pasillo). Esto provoca pérdida de información, falta de priorización y nula visibilidad del estado de cada ticket técnico.

Este proyecto provee una plataforma centralizada para registrar, clasificar por prioridad, buscar y seguir incidencias técnicas en tiempo real, resolviendo el caos de soporte interno y optimizando el tiempo de respuesta del equipo de TI.

## 4. Tecnologías Utilizadas
- **Backend:** Java 21 + Spring Boot 4.0.0 + Spring Data JPA + Maven.
- **Frontend:** React 18+ (Vite) + Vanilla CSS (Variables HSL, Diseño Responsivo y Micro-animaciones).
- **Base de Datos:** MySQL 8.0.
- **Contenerización y Despliegue:** Docker + Docker Compose.

## 5. Arquitectura Resumida
La solución adopta una arquitectura de 3 capas contenerizada y aislada:
- **Capa Cliente (Frontend):** Servida por Nginx en puerto local `3000`.
- **Capa Servidor (Backend):** API REST ejecutándose en puerto local `8080`.
- **Capa Datos (Base de Datos):** Servidor MySQL interno en puerto `3306` (no expuesto externamente por defecto para seguridad, persistido en el volumen `db_data`).

## 6. Requisitos para Ejecutar
- **Docker Desktop** instalado y activo.
- **Git** (para clonar y versionar).
- Puertos del host `3000` y `8080` libres.

## 7. Variables de Entorno Necesarias
Las variables de entorno se especifican en el archivo `.env` en la raíz de `project/`:
- `DB_NAME`: Nombre de la base de datos (por defecto: `gestion_incidencias`).
- `DB_PASSWORD`: Contraseña del usuario root de MySQL (por defecto: `secretpassword`).
- `VITE_API_URL`: URL del backend consumida por el cliente browser (por defecto: `http://localhost:8080/api/incidencias`).

## 8. Comando para Levantar la Solución
Desde la raíz de `project/` (donde está el archivo `compose.yaml`), ejecute:
```bash
docker compose up --build
```
Para apagar los contenedores conservando los datos:
```bash
docker compose down
```

## 9. URLs y Puertos Esperados
- **Frontend (Web App):** [http://localhost:3000](http://localhost:3000)
- **Backend (API REST):** [http://localhost:8080/api/incidencias](http://localhost:8080/api/incidencias)

## 10. Cómo Verificar Rápidamente el CRUD
1. **Acceder a la interfaz:** Abra su navegador en [http://localhost:3000](http://localhost:3000).
2. **Crear Incidencia:** Haga clic en "Nueva Incidencia", complete el título y la descripción, seleccione categoría y prioridad. Presione "Registrar". El dashboard incrementará el contador "Abiertas" y la tarjeta aparecerá con prioridad y estado `ABIERTA`.
3. **Ver Detalle:** Haga clic sobre cualquier tarjeta en el listado para abrir un modal con la información detallada (incluida la fecha de creación y el técnico asignado).
4. **Editar Incidencia:** Haga clic en el ícono de lápiz ✏️ de la tarjeta, modifique algún campo (ej: cambiar el responsable o la prioridad) y presione "Guardar Cambios".
5. **Cambio Rápido de Estado:**
   - Si la incidencia está en estado `ABIERTA`, verá un botón "Iniciar". Al presionarlo, cambiará a `EN_PROGRESO` y los contadores se actualizarán.
   - Si está `EN_PROGRESO`, verá el botón "Resolver". Al presionarlo, pasará a `RESUELTA`.
6. **Eliminar Incidencia:** Haga clic en el ícono de basurero 🗑️ de la tarjeta y confirme el cuadro de diálogo del navegador.

## 11. Funcionalidades Adicionales Implementadas
- **Dashboard Dinámico en Tiempo Real:** Contadores superiores que se actualizan de forma reactiva al crear, eliminar o alterar estados.
- **Filtros Combinados y Búsqueda por Texto:** Búsqueda en tiempo real por palabras clave en título/descripción y filtrado por dropdowns de estado y prioridad.
- **Cambio Rápido de Estado:** Transiciones de estado directas desde la tarjeta sin entrar a formularios de edición.
- **Manejo Global de Excepciones:** Respuestas detalladas y consistentes en JSON (status 400 Bad Request) ante fallas de validación.

## 12. Limitaciones Conocidas
- Autenticación o roles de usuario no soportados en esta etapa de diagnóstico.
- No dispone de carga de archivos adjuntos.
