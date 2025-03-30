import { balanceController } from '@gateway/controllers/balance/balance.controller';
import express, { Router } from 'express';

class BalanceRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/balance/', balanceController.getCurrentUserBalance);
    this.router.post('/balance/deposit', balanceController.depositBalance);
    this.router.post('/balance/withdraw', balanceController.withdrawBalance);
    this.router.post('/balance/transfer', balanceController.transferBalance);
    return this.router;
  }
}

export const balanceRoutes = new BalanceRoutes();
