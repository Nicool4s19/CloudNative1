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