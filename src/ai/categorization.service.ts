import { Injectable, Logger } from '@nestjs/common';
import {
  CATEGORY_LABELS,
  CATEGORY_TO_LABEL,
  CategoryLabel,
  isCategoryLabel,
  LABEL_TO_CATEGORY,
} from '../common/constants/categories';
import { PrismaService } from '../prisma/prisma.service';
import { CategorizeTransactionDto } from './dto/categorize-transaction.dto';
import { CategorizationResultEntity } from './entities/categorization-result.entity';
import { GeminiService } from './gemini.service';

@Injectable()
export class CategorizationService {
  private readonly logger = new Logger(CategorizationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly gemini: GeminiService,
  ) {}

  async categorizeTransaction(
    transactionId: string,
    input: CategorizeTransactionDto,
  ): Promise<CategorizationResultEntity> {
    // get the last five corrections
    const corrections = await this.prisma.categoryCorrection.findMany({
      where: { transaction: { account: { userId: input.userId } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        correctedCategory: true,
        transaction: { select: { description: true } },
      },
    });

    // build short examples
    const examples = corrections.length
      ? corrections
          .map(
            (item) =>
              `'${item.transaction.description ?? 'No description'}' was corrected to '${CATEGORY_TO_LABEL[item.correctedCategory]}'`,
          )
          .join('\n')
      : 'No corrections yet.';

    const systemPrompt =
      `Return only one category: ${CATEGORY_LABELS.join(', ')}. ` +
      'Do not add an explanation.';
    const userPrompt = `Recent corrections:
${examples}

Type: ${input.type}
Amount: ${input.amount}
Description: ${input.description ?? 'No description'}
Category:`;

    let category: CategoryLabel = 'Transfers';
    let model: string | null = null;

    try {
      // ask Gemini for one category
      const result = await this.gemini.generateText(
        systemPrompt,
        userPrompt,
        30,
      );
      if (isCategoryLabel(result.text)) {
        category = result.text;
      }
      model = result.model;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(`Using Transfers category: ${message}`);
    }

    // save the category
    await this.prisma.transaction.update({
      where: { id: transactionId },
      data: { category: LABEL_TO_CATEGORY[category] },
    });

    return { category, model };
  }
}
