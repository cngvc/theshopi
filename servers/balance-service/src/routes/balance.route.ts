import { balanceSeedController } from '@balance/controllers/balance-seed.controller';
import { balanceController } from '@balance/controllers/balance.controller';
import express, { Router } from 'express';

class BalanceRoutes {
  router: Router;
  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/', balanceController.getCurrentUserBalance);
    this.router.post('/deposit', balanceController.depositBalance);
    this.router.post('/withdraw', balanceController.withdrawBalance);
    this.router.post('/transfer', balanceController.transferBalance);

    this.router.put('/seed/:count', balanceSeedController.createdSeeds);

    return this.router;
  }
}

export const balanceRoutes = new BalanceRoutes();
