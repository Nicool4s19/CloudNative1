# Evidencias del Laboratorio 1 - DSY1107

# Parte A: Primer API Gateway

## 1. Pruebas directas al Backend (JSONPlaceholder)
* **Colección:** `GET https://jsonplaceholder.typicode.com/posts` | Status: `200 OK`
* **Recurso:** `GET https://jsonplaceholder.typicode.com/posts/1` | Status: `200 OK`

## Análisis teórico:
**¿Qué problema podría producir si el cliente conoce directamente la dirección física del backend?**
Produce un acoplamiento directo entre cliente e infraestructura. Si la dirección IP, dominio o puerto del backend cambian, todos los clientes dejan de funcionar. Además, impide centralizar políticas transversales de seguridad, monitoreo y control de tráfico.

## 2. Pruebas a través de Spring Cloud Gateway (`localhost:8080`)
* **Colección:** `GET http://localhost:8080/api/v1/posts` | Status: `200 OK`
* **Recurso:** `GET http://localhost:8080/api/v1/posts/1` | Status: `200 OK`

# Recorrido de la petición:
1. **Cliente → Gateway:** Envía `GET http://localhost:8080/api/v1/posts/1`.
2. **Predicate Match:** La regla `Path=/api/v1/posts/**` coincide con la URI solicitada.
3. **Filter Transformation:** El filtro `RewritePath` reescribe la ruta a `/posts/1`.
4. **Gateway → Backend:** Consulta internamente a `https://jsonplaceholder.typicode.com/posts/1`.
5. **Respuesta:** JSONPlaceholder responde con status `200 OK` y el Gateway lo reenvía al cliente.

---

# Parte B: HTTP y Richardson Maturity Model (Nivel 2)

| Método | Recurso | Status Code | Significado |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/posts` | `200 OK` | Lectura de la colección completa de posts. |
| `GET` | `/api/v1/posts/1` | `200 OK` | Lectura de un recurso individual por ID. |
| `POST` | `/api/v1/posts` | `201 Created` | Creación exitosa de un nuevo recurso. |
| `PUT` | `/api/v1/posts/1` | `200 OK` | Actualización/reemplazo completo del recurso. |
| `DELETE` | `/api/v1/posts/1` | `200 OK` | Eliminación del recurso indicado. |

---

# Parte C: Versionado (Ruta /api/v2)

## 1. Comandos Git para la rama de trabajo
Para crear y cambiarse a la rama `feature/version-v2`:
```bash
git checkout -b feature/version-v2
# O con la sintaxis moderna de Git:
# git switch -c feature/version-v2
```

## 2. Pruebas de Versionado e Inyección de Headers
* **Petición a v1:** `GET http://localhost:8080/api/v1/posts/1`
  * **Header recibido:** `X-API-Version: v1`
  * **Header recibido:** `X-Gateway-Lab: DSY1107`
  * **Status:** `200 OK`
* **Petición a v2:** `GET http://localhost:8080/api/v2/posts/1`
  * **Header recibido:** `X-API-Version: v2`
  * **Header recibido:** `X-Gateway-Lab: DSY1107`
  * **Status:** `200 OK`

## 3. Análisis Teórico sobre Versionado

### ¿Por qué podrían coexistir v1 y v2 en un entorno de producción?
Permite garantizar la **compatibilidad hacia atrás (*backward compatibility*)** y la continuidad operativa del negocio. Cuando se introducen cambios disruptivos (*breaking changes* — ej. cambios en contratos JSON, eliminación de campos o nuevos flujos de autenticación), mantener ambas versiones activas evita que clientes existentes (apps móviles no actualizadas, integraciones de terceros o sistemas heredados) sufran caídas o interrupciones mientras los nuevos clientes consumen `v2`.

### ¿Por qué no se obliga a todos los clientes a migrar el mismo día?
Porque los consumidores de una API suelen estar distribuidos y fuera del control directo del equipo de backend (ej. usuarios que no han actualizado su aplicación móvil desde las tiendas de apps o clientes B2B con ciclos de release propios). Una migración forzada instantánea (*Big Bang*) provocaría fallas masivas de servicio, pérdidas económicas y una mala experiencia de usuario. La coexistencia permite una migración progresiva y ordenada.

### ¿La versión de la URL representa necesariamente una versión del servidor desplegado?
**No.** Gracias a la capa de abstracción del API Gateway, la versión en la URI (`/api/v1` vs `/api/v2`) es solo una interfaz lógica expuesta al cliente. Detrás del Gateway, ambas rutas pueden ser atendidas por el mismo servicio backend (mediante reescritura de rutas o adaptadores internos), por instancias independientes del mismo microservicio, o por microservicios completamente diferentes desplegados en arquitecturas distintas. El cliente queda totalmente desacoplado de la infraestructura física subyacente.

### ¿Cuándo y bajo qué condiciones se debería retirar la versión v1 (Deprecation/Sunset)?
La versión v1 debe retirarse siguiendo un proceso formal de **Deprecación y Retiro (*Sunset Policy*)** bajo las siguientes condiciones:
1. **Anuncio formal y periodo de gracia:** Se comunica a los consumidores la fecha límite de soporte (utilizando documentación y headers HTTP estándar como `Sunset: <date>` y `Deprecation: @<timestamp>`).
2. **Monitoreo de telemetría:** El Gateway y los sistemas de observabilidad evidencian que el tráfico hacia `v1` ha caído a cero o a un nivel residual acordado contractualmente.
3. **Alternativas y soporte de migración:** Se ha provisto una guía de migración clara y soporte técnico para los clientes remanentes.
4. **Cumplimiento del SLA/Plazo:** Se cumple la fecha fijada en los acuerdos de nivel de servicio sin comprometer operaciones críticas.

---

# Parte D: Política Transversal (Header del Gateway) y Matriz de Responsabilidades

## 1. Configuración de Filtros Globales
Se configuró la sección `default-filters` en Spring Cloud Gateway para inyectar automáticamente el encabezado HTTP de respuesta `X-Gateway-Lab: DSY1107` en todas las rutas gestionadas.

## 2. Matriz de Clasificación de Responsabilidades

| Responsabilidad | Capa Principal | Justificación Técnica |
| :--- | :--- | :--- |
| **Routing** | **Gateway** | Actúa como Reverse Proxy centralizado; inspecciona la URI, método y headers de la petición para derivar el tráfico al microservicio o backend correspondiente, abstrayendo la topología física de la red. |
| **Lógica de negocio** | **Backend** | Modela el dominio, validaciones complejas, cálculos y procesos propios de la aplicación. Debe mantenerse desacoplada de la infraestructura de transporte y red. |
| **Autenticación / Autorización** | **Gateway y Backend** | **Gateway:** Realiza la autenticación perimetral y validación de tokens (ej. JWT, OAuth2) para rechazar tráfico ilegítimo en el borde. <br>**Backend:** Aplica la autorización fina basada en roles o atributos (RBAC/ABAC) sobre entidades específicas del dominio. |
| **Transformación de rutas** | **Gateway** | Reescribe o mapea URIs públicas (`/api/v1/posts/**`) hacia paths internos (`/posts/**`), adaptando los contratos hacia los microservicios sin exponer la arquitectura interna al cliente. |
| **Persistencia de datos** | **Backend** | Administra el acceso a bases de datos (SQL/NoSQL), transaccionalidad, integridad referencial y caché de datos del dominio. |
| **Rate Limiting** | **Gateway** | Protege los servicios internos contra sobrecargas, abusos y ataques de denegación de servicio (DoS) limitando la tasa de peticiones por IP, usuario o API Key antes de consumir recursos del backend. |
| **Reglas de negocio** | **Backend** | Residen en el núcleo de la aplicación (*Core Domain*); cualquier cambio de política de negocio debe evolucionar en el microservicio específico sin afectar la capa de ruteo perimetral. |
| **Observabilidad del tráfico** | **Gateway y Backend** | **Gateway:** Provee métricas perimetrales (latencia total, throughput, tasa de errores HTTP por ruta) y propagación de Correlation IDs. <br>**Backend:** Registra logs contextuales de negocio, tiempos de base de datos y trazas distribuidas internas. |