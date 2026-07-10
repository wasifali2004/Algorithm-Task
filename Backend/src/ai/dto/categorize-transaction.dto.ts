import { TransactionType } from '../../generated/prisma/enums';

export class CategorizeTransactionDto {
  type: TransactionType;
  amount: string;
  description: string | null;
  userId: string;
}
