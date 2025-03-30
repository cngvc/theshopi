import { IBalance, IBalanceTransaction } from '@cngvc/shopi-types';
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

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => BalanceTransactionModel, (transactions) => transactions.balance, { cascade: true })
  private _transactions!: BalanceTransactionModel[];

  get transactions(): IBalanceTransaction[] {
    return (this._transactions ?? []) as IBalanceTransaction[];
  }
}
