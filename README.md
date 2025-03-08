# README

## 🚀 How to Start Services

### Backend

This project uses **Docker Compose** to manage services like MongoDB, MySQL, Redis, RabbitMQ, Elasticsearch, Kibana, etc.

### Frontend

Frameworks: [Next](https://nextjs.org/), [Next-Auth](https://authjs.dev/)
Package manager: [Bun](https://bun.sh/)

### **Start Required Services**

To start all necessary services, run the following command:

```sh
cd scripts && chmod +x *.sh && ./start-docker-containers.sh && ./start-services.sh
```

### **Stopping Services**

To stop all running services:

```sh
docker-compose down
```

_(-v flag for volumes if needed)_

---

### **🗂️ Service Domains**

| Service                   | Base URL                |
| ------------------------- | ----------------------- |
| **Gateway Service**       | `http://localhost:4000` |
| **Notification Service**  | `http://localhost:4001` |
| **Auth Service**          | `http://localhost:4002` |
| **Client (Frontend)**     | `http://localhost:3000` |
| **Chat Service**          | `http://localhost:4005` |
| **Users Service**         | `http://localhost:4003` |
| **Products Service**      | `http://localhost:4004` |
| **Online Status Service** | `http://localhost:4009` |
| **Socket Service**        | `http://localhost:4010` |
| **Cart Service**          | `http://localhost:4011` |

---

### **📌 Notes:**

- Ensure **Docker** and **Docker Compose** are installed before running the script.
- Node version: 20
- [Bun](https://bun.sh/) _(like yarn)_
- Container manager UI: [OrbStack](https://orbstack.dev)
