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

### **📌 Notes:**

- Ensure **Docker** and **Docker Compose** are installed before running the script.
- Node version: 20
- [Bun](https://bun.sh/) _(like yarn)_
- Container manager UI: [OrbStack](https://orbstack.dev)
