// src/boot/mirage-server.js
import { createServer } from 'miragejs';

export function makeServer({ environment = 'development' } = {}) {
  let server = createServer({
    environment,
    routes() {
      this.namespace = 'api';
      console.log("Mirage namespace set to:", this.namespace);

      this.get('/admin/verify', () => {
        return { admin: true };  // Simulate an admin verification response
      });

    }
  });

  return server;
}

makeServer();
