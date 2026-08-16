# Cloud Native - API Gateway con Spring Cloud Gateway

Proyecto desarrollado para la asignatura **DSY1107**, enfocado en la implementación de un API Gateway centralizado mediante **Spring Cloud Gateway** y la validación del **Modelo de Madurez de Richardson (Nivel 2)**.

---

## 🛠️ Estructura del Repositorio

```text
CloudNative1/
├── gateway/          # Proyecto Spring Boot con Spring Cloud Gateway (puerto 8080)
│   ├── src/
│   └── pom.xml
├── client/           # Cliente web (archivos estáticos frontend)
│   └── index.html
└── docs/             # Documentación teórica, análisis de arquitectura y evidencias
    └── evidencias.md

Cómo Ejecutar el API Gateway Localmente Prerrequisitos
 JDK: Java 21 o superior
Build Tool: Apache Maven 3.8+
Cliente HTTP: Postman, Insomnia o cURL.

Pasos de Inicio: Clona el repositorio y posicionate en la carpeta del servicio gateway: Bash: cd gateway
Compila e inicia el servidor de Spring Boot: Bash: mvn spring-boot:run

El API Gateway estará corriendo y escuchando peticiones en: Plaintexthttp://localhost:8080


## 🔗 Rutas y Reescritura de Rutas (Partes A y B)

El Gateway actúa como punto único de entrada (Reverse Proxy) y redirige las peticiones hacia el servicio externo **JSONPlaceholder** (`https://jsonplaceholder.typicode.com`) utilizando la regla `RewritePath`:

| Método HTTP | Ruta Expuesta en Gateway | Ruta Destino (Backend) | Descripción del Recurso | Status Esperado |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/posts` | `/posts` | Consulta la colección completa de publicaciones. | `200 OK` |
| `GET` | `/api/v1/posts/{id}` | `/posts/{id}` | Obtiene un recurso individual por su ID. | `200 OK` |
| `POST` | `/api/v1/posts` | `/posts` | Crea un nuevo recurso enviando el Body en formato JSON. | `201 Created` |
| `PUT` | `/api/v1/posts/{id}` | `/posts/{id}` | Reemplaza o actualiza un recurso existente por su ID. | `200 OK` |
| `DELETE` | `/api/v1/posts/{id}` | `/posts/{id}` | Elimina el recurso especificado por su ID. | `200 OK` |

---

## ⚙️ Ejemplo de Configuración (`gateway/src/main/resources/application.yml`)

```yaml
server:
  port: 8080

spring:
  application:
    name: api-gateway
  cloud:
    gateway:
      routes:
        - id: posts-v1
          uri: [https://jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com)
          predicates:
            - Path=/api/v1/posts/**
          filters:
            - RewritePath=/api/v1/posts/(?<segment>.*), /posts/$\{segment}

📄 Evidencias para revisar las respuestas a las preguntas de análisis y el cumplimiento del Nivel 2 de Richardson:
 Consultar documento de evidencias (docs/evidencias.md)
