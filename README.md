# CloudNative1 - API Gateway con Spring Cloud Gateway

Proyecto desarrollado para la asignatura **DSY1107**, enfocado en la implementación de un API Gateway centralizado mediante **Spring Cloud Gateway** y la validación del **Modelo de Madurez de Richardson (Nivel 2)**.

---

## 🛠️ Estructura del Repositorio

* **`gateway/`**: Proyecto Spring Boot con Spring Cloud Gateway (escuchando en el puerto 8080).
  * **`src/`**: Código fuente de la aplicación Java y configuraciones `application.yml`.
  * **`pom.xml`**: Archivo de configuración Maven con dependencias de Spring Cloud Gateway.
* **`client/`**: Archivos estáticos del frontend.
  * **`index.html`**: Interfaz de cliente web.
* **`docs/`**: Documentación teórica y evidencias.
  * **`evidencias.md`**: Análisis teórico, recorrido de peticiones y respuestas a las preguntas del laboratorio.

---

## 🚀 Cómo Ejecutar el API Gateway Localmente

* **Paso 1: Ingresar al directorio del Gateway**
  Abrir la terminal e ingresar a la carpeta del proyecto:
  `cd gateway`

* **Paso 2: Compilar e Iniciar la Aplicación**
  Ejecutar el plugin de Spring Boot para levantar el servidor:
  `mvn spring-boot:run`

* **Paso 3: Validar el Puerto de Escucha**
  Verificar que el API Gateway esté activo escuchando peticiones en:
  `http://localhost:8080`

---

## 🔗 Rutas y Reescritura de Rutas (Partes A y B)

El Gateway actúa como punto único de entrada (Reverse Proxy) y redirige las peticiones hacia el servicio externo **JSONPlaceholder** (`https://jsonplaceholder.typicode.com`) utilizando la regla `RewritePath`:

| Método HTTP | Ruta Expuesta en Gateway | Ruta Destino (Backend) | Acción / Descripción del Recurso | Status Esperado |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/posts` | `/posts` | Consultar la colección completa de publicaciones. | `200 OK` |
| `GET` | `/api/v1/posts/{id}` | `/posts/{id}` | Obtener una publicación específica por su ID. | `200 OK` |
| `POST` | `/api/v1/posts` | `/posts` | Crear una nueva publicación enviando el Body en formato JSON. | `201 Created` |
| `PUT` | `/api/v1/posts/{id}` | `/posts/{id}` | Reemplazar/Actualizar una publicación existente por su ID. | `200 OK` |
| `DELETE` | `/api/v1/posts/{id}` | `/posts/{id}` | Eliminar una publicación específica por su ID. | `200 OK` |

---

## 📄 Evidencias y Análisis Teórico

Para revisar las respuestas a las preguntas de análisis y la validación del **Nivel 2 de Richardson**, consulta los detalles en nuestro documento dedicado:

👉 **[Consultar documento de evidencias (`docs/evidencias.md`)](./docs/evidencias.md)**
