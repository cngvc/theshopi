import { BalanceType, IBalanceTransaction } from '@cngvc/shopi-types';
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BalanceModel } from './balance.entity';

@Entity('balance_transactions')
export class BalanceTransactionModel extends BaseEntity implements IBalanceTransaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  authId!: string;

  @ManyToOne(() => BalanceModel, (balance) => balance.transactions)
  balance!: BalanceModel;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: 'enum', enum: BalanceType })
  transactionType!: BalanceType;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}
