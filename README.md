# CloudNative1 - API Gateway con Spring Cloud Gateway

Proyecto desarrollado para la asignatura **DSY1107**, enfocado en la implementación de un API Gateway centralizado mediante **Spring Cloud Gateway** (Spring Boot 3.2.3) y la validación del **Modelo de Madurez de Richardson (Nivel 2)**.

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
Cómo Ejecutar el API Gateway LocalmentePrerrequisitosJDK: Java 21 o superior.Build Tool: Apache Maven 3.8+.Cliente HTTP: Postman, Insomnia o cURL.Pasos de InicioClona el repositorio y posicionate en la carpeta del servicio gateway:Bashcd gateway
Compila e inicia el servidor de Spring Boot:Bashmvn spring-boot:run
El API Gateway estará corriendo y escuchando peticiones en:Plaintexthttp://localhost:8080
🔗 Rutas y Reescribo de Rutas (Partes A y B)El Gateway actúa como punto único de entrada (Reverse Proxy) y redirige las peticiones hacia el servicio externo JSONPlaceholder (https://jsonplaceholder.typicode.com) utilizando la regla RewritePath:Método HTTPRuta Expuesta en GatewayRuta Destino (Backend)Descripción del RecursoStatus EsperadoGET/api/v1/posts/postsConsulta la colección completa de publicaciones200 OKGET/api/v1/posts/{id}/posts/{id}Obtiene un recurso individual por su ID200 OKPOST/api/v1/posts/postsCrea un nuevo recurso enviando Body JSON201 CreatedPUT/api/v1/posts/{id}/posts/{id}Reemplaza/Actualiza un recurso existente200 OKDELETE/api/v1/posts/{id}/posts/{id}Elimina el recurso especificado200 OK⚙️ Ejemplo de Configuración (gateway/src/main/resources/application.yml)YAMLserver:
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
📄 Evidencias y Análisis TeóricoPara revisar las respuestas a las preguntas de análisis y el cumplimiento del Nivel 2 de Richardson:👉 Consultar documento de evidencias (docs/evidencias.md)
