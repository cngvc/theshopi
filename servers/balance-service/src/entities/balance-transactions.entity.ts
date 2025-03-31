import { BalanceType, IBalance, IBalanceTransaction } from '@cngvc/shopi-types';
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BalanceModel } from './balance.entity';

@Entity('balance_transactions')
export class BalanceTransactionModel extends BaseEntity implements IBalanceTransaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  authId!: string;

  @Column({ type: 'uuid', nullable: true })
  orderPublicId!: string;

  @Column({ type: 'uuid', nullable: true })
  paymentPublicId!: string;

  @ManyToOne(() => BalanceModel, (balance) => balance.transactions, { nullable: true })
  private _balance!: BalanceModel;

  get balance(): IBalance {
    return this._balance as IBalance;
  }

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: 'enum', enum: BalanceType })
  transactionType!: BalanceType;

  @CreateDateColumn()
  createdAt!: Date;
}
