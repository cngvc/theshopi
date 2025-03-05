import express, { Router } from 'express';

class ChatRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    return this.router;
  }
}

export const chatRoutes = new ChatRoutes();
