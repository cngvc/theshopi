import { IBalance } from '@cngvc/shopi-types';
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { BalanceTransactionModel } from './balance-transactions.entity';

@Entity('balances')
export class BalanceModel extends BaseEntity implements IBalance {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', unique: true })
  authId!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance!: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  @OneToMany(() => BalanceTransactionModel, (transaction) => transaction.balance, { cascade: true })
  transactions: BalanceTransactionModel[] = [];
}
