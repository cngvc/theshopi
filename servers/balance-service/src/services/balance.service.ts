class BalanceService {
  getCurrentUserBalance(authId: string) {
    return 0;
  }
  depositBalance(authId: string, amount: number) {}
  withdrawBalance(authId: string, amount: number) {}
  transferBalance(authId: string, amount: number) {}
  payOrder(authId: string, amount: number, orderPublicId: string) {}
  async updateUserBalance(authId: string, amount: number): Promise<void> {}
}

export const balanceService = new BalanceService();
