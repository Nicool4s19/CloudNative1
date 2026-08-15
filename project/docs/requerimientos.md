# Levantamiento de Requerimientos — Mini Help Desk

## 3.1 Problema
En las organizaciones, el flujo informal de comunicación a través de aplicaciones de mensajería o conversaciones verbales para reportar incidencias técnicas (como fallas de hardware, problemas de acceso o errores en el software) genera una pérdida crítica de información. Sin un registro centralizado, el equipo de soporte técnico carece de visibilidad respecto al estado real de los incidentes pendientes, en proceso o resueltos, lo que deriva en tiempos de respuesta lentos, duplicación de esfuerzos y frustración de los colaboradores de la empresa.

Esta aplicación resuelve ese problema al proveer una plataforma web unificada para registrar, dar seguimiento y gestionar de principio a fin el ciclo de vida de cada incidencia técnica. Los operadores de soporte técnico podrán visualizar de forma clara y priorizada todas las solicitudes pendientes, optimizando la asignación de recursos y garantizando que ningún caso quede en el olvido.

El resultado esperado es una mejora en la eficiencia de resolución de problemas, un historial trazable de incidencias y un indicador visual e inmediato del estado operativo de la infraestructura y servicios de la organización.

## 3.2 Actores

### Operador de Soporte
- **Qué necesita hacer:** Registrar nuevas incidencias, listar todos los casos activos, filtrar y buscar incidencias específicas, visualizar indicadores resumidos, ver detalles, actualizar información (incluyendo cambios de estado rápidos) y eliminar registros obsoletos o erróneos.
- **Qué información utiliza:** Título, descripción, categoría, prioridad (Baja, Media, Alta), estado (Abierta, En Progreso, Resuelta), fecha de creación y responsable asignado.
- **Qué resultado espera:** Un panel dinámico que le permita gestionar y resolver incidencias de manera ágil, manteniendo la base de datos actualizada en tiempo real.

## 3.3 Requerimientos Funcionales

1. **RF-01 — Registrar incidencia:** El sistema debe permitir registrar una incidencia indicando obligatoriamente título, descripción y, de forma opcional, categoría, prioridad y responsable.
2. **RF-02 — Listar incidencias:** El sistema debe mostrar un listado con todas las incidencias registradas con su correspondiente título, prioridad, estado y fecha de creación.
3. **RF-03 — Ver detalle de incidencia:** El sistema debe permitir visualizar toda la información detallada de una incidencia seleccionada, incluyendo su descripción completa y responsable.
4. **RF-04 — Actualizar incidencia:** El sistema debe permitir modificar los datos de una incidencia existente (título, descripción, categoría, prioridad, responsable y estado).
5. **RF-05 — Eliminar incidencia:** El sistema debe permitir eliminar permanentemente una incidencia de la base de datos previa confirmación del operador.
6. **RF-06 — Cambio rápido de estado:** El sistema debe permitir al operador cambiar el estado de una incidencia de forma directa desde la vista principal sin abrir el formulario completo de edición (ej. pasar de `ABIERTA` a `EN_PROGRESO` o `RESUELTA`).
7. **RF-07 — Búsqueda y filtrado:** El sistema debe permitir buscar incidencias por texto (coincidencia en título o descripción) y filtrar dinámicamente por prioridad o por estado.
8. **RF-08 — Indicador de resumen:** El sistema debe mostrar contadores en tiempo real del número total de incidencias agrupadas por su estado (`ABIERTA`, `EN_PROGRESO`, `RESUELTA`).

## 3.4 Requerimientos No Funcionales

1. **RNF-01 — Ejecución reproducible:** La solución completa debe poder iniciarse mediante Docker Compose (`docker compose up --build`) sin requerir configuraciones previas en el host local.
2. **RNF-02 — Persistencia de datos:** Los datos registrados deben persistir en una base de datos MySQL mediante el uso de volúmenes Docker, incluso si los contenedores se detienen o recrean.
3. **RNF-03 — Manejo de errores:** El backend debe validar las entradas y retornar mensajes de error comprensibles con códigos de estado HTTP semánticos (ej: 400 Bad Request en validaciones) en lugar de fallar con errores internos del servidor (500).
4. **RNF-04 — Usabilidad:** La interfaz de usuario debe ser responsiva, intuitiva y estéticamente atractiva, adaptándose a dispositivos móviles y de escritorio, utilizando transiciones suaves y componentes interactivos claros.
5. **RNF-05 — Mantenibilidad:** El backend debe estar estructurado siguiendo el patrón de capas de Spring Boot (Controller, Service, Repository, Model) con código modular y libre de secretos versionados en el código fuente.

## 3.5 Reglas de Negocio

1. **RN-01:** Toda incidencia nueva debe comenzar automáticamente en estado `ABIERTA`.
2. **RN-02:** Los estados permitidos para una incidencia son estrictamente: `ABIERTA`, `EN_PROGRESO` y `RESUELTA`.
3. **RN-03:** Las prioridades permitidas para una incidencia son estrictamente: `BAJA`, `MEDIA` y `ALTA`.
4. **RN-04:** El título y la descripción son campos obligatorios y no pueden estar vacíos ni formados únicamente por espacios en blanco.

## 3.6 Criterios de Aceptación

### Criterio de Aceptación 1 (Para RF-01 - Registrar incidencia)
- **Dado que** el operador se encuentra en el formulario de creación y ha completado los campos obligatorios "Título" y "Descripción",
- **Cuando** presiona el botón para guardar la incidencia,
- **Entonces** el sistema almacena la incidencia en la base de datos,
- **Y** se muestra un mensaje de éxito,
- **Y** la incidencia aparece en la lista principal con estado inicial `ABIERTA` y la fecha de creación actual.

### Criterio de Aceptación 2 (Para RF-06 - Cambio rápido de estado)
- **Dado que** el operador visualiza una incidencia en estado `ABIERTA` en el listado,
- **Cuando** hace clic en el botón de acción rápida "Iniciar",
- **Entonces** el sistema actualiza el estado de esa incidencia a `EN_PROGRESO` en el backend,
- **Y** el listado y los contadores del dashboard se actualizan inmediatamente reflejando el cambio.

### Criterio de Aceptación 3 (Para RF-07 - Búsqueda y filtrado)
- **Dado que** existen incidencias con diferentes estados y prioridades en el sistema,
- **Cuando** el operador selecciona el filtro de prioridad "ALTA",
- **Entonces** el sistema oculta todas las incidencias de prioridad "MEDIA" y "BAJA", mostrando únicamente aquellas clasificadas como "ALTA".

## 3.7 Alcance y Fuera de Alcance

### En Alcance
- CRUD completo de la entidad Incidencia.
- Búsqueda textual y filtrado por estado/prioridad interactivo.
- Cambio rápido de estado desde el listado.
- Dashboard resumen con contadores dinámicos.
- Contenerización con Docker de frontend (Nginx), backend (Spring Boot) y base de datos (MySQL).
- Persistencia mediante volúmenes Docker.

### Fuera de Alcance
- Autenticación y autorización de usuarios (Login/Roles).
- Asignación automatizada de incidencias mediante algoritmos.
- Historial detallado o auditoría de cambios paso a paso en tablas secundarias.
- Sistema de notificaciones por correo electrónico, SMS o notificaciones Push.
- Integración con APIs externas o servicios de Inteligencia Artificial.
- Despliegue en la nube.
