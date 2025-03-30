import { AppDataSource } from '@balance/database';
import { BalanceTransactionModel } from '@balance/entities/balance-transactions.entity';
import { BalanceModel } from '@balance/entities/balance.entity';
import { BalanceType, DepositMethod, IBuyerDocument } from '@cngvc/shopi-types';
import { EntityManager, Repository } from 'typeorm';

class BalanceService {
  private balanceRepository: Repository<BalanceModel>;
  private transactionRepository: Repository<BalanceTransactionModel>;

  constructor() {
    this.balanceRepository = AppDataSource.getRepository(BalanceModel);
    this.transactionRepository = AppDataSource.getRepository(BalanceTransactionModel);
  }

  async getUserBalance(authId: string): Promise<number> {
    const balance = await this.balanceRepository.findOne({ where: { authId } });
    return balance ? balance.balance : 0;
  }

  async depositBalance(authId: string, amount: number, method: DepositMethod): Promise<void> {
    if (method === 'stripe') {
    }
    await this.updateUserBalance(authId, amount, BalanceType.deposit);
  }

  async withdrawBalance(authId: string, amount: number): Promise<void> {
    await this.updateUserBalance(authId, -amount, BalanceType.withdraw);
  }

  async transferBalance(fromAuthId: string, toAuthId: string, amount: number): Promise<void> {
    await AppDataSource.transaction(async (manager) => {
      await this.updateUserBalance(fromAuthId, -amount, BalanceType.transfer_out, manager);
      await this.updateUserBalance(toAuthId, amount, BalanceType.transfer_in, manager);
    });
  }

  async payOrder(authId: string, amount: number, orderPublicId: string): Promise<void> {
    await this.updateUserBalance(authId, -amount, BalanceType.order_payment, undefined, orderPublicId);
  }

  async updateUserBalance(
    authId: string,
    amount: number,
    transactionType: BalanceType,
    manager?: EntityManager,
    orderPublicId?: string
  ): Promise<void> {
    const balanceRepo = manager ? manager.getRepository(BalanceModel) : this.balanceRepository;
    const transactionRepo = manager ? manager.getRepository(BalanceTransactionModel) : this.transactionRepository;
    let balance = await balanceRepo.findOne({ where: { authId } });
    if (!balance) {
      balance = balanceRepo.create({ authId, balance: 0 });
    }
    if (balance.balance + amount < 0) {
      throw new Error('Insufficient funds');
    }
    balance.balance += amount;
    await balanceRepo.save(balance);
    const transaction = transactionRepo.create({
      authId,
      balance,
      amount,
      transactionType,
      orderPublicId
    });
    await transactionRepo.save(transaction);
  }

  async createSeeds(buyers: IBuyerDocument[]) {
    for (const buyer of buyers) {
      await this.depositBalance(buyer.authId, parseInt(`${Math.random() * 10000}`), DepositMethod.crypto);
    }
  }
}

export const balanceService = new BalanceService();
