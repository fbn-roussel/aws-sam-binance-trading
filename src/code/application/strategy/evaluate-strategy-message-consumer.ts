import { logger } from '../../configuration/log/logger';
import { Strategy } from '../../domain/strategy/model/strategy';
import { StrategyMessage } from '../../infrastructure/strategy/sqs-strategy-publisher';
import { GetStrategyService } from '../../domain/strategy/get-strategy-service';
import { UpdateStrategyService } from '../../domain/strategy/update-strategy-service';
import { EvaluateStrategyService } from '../../domain/strategy/evaluate-strategy-service';

export class EvaluateStrategyMessageConsumer {
  constructor(private getStrategyService: GetStrategyService, private updateStrategyService: UpdateStrategyService, private evaluateStrategyService: EvaluateStrategyService) {}

  async process(strategyMessage: StrategyMessage): Promise<void> {
    try {
      logger.info(strategyMessage, 'Evaluating strategy');
      const strategy = await this.#getStrategyById(strategyMessage.id);
      const strategyEvaluation = await this.evaluateStrategyService.evaluate(strategy);
      if (!strategyEvaluation.success) {
        await this.#updateStrategyStatusById(strategyMessage.id);
      }
      logger.info(strategyMessage, 'Strategy evaluated');
    } catch (error) {
      logger.error(strategyMessage, 'Unable to evaluate strategy');
      await this.#updateStrategyStatusById(strategyMessage.id);
      throw error;
    }
  }

  async #getStrategyById(id: string): Promise<Strategy> {
    const strategy = await this.getStrategyService.getById(id);
    if (!strategy) {
      throw new Error(`Unable to find strategy with ID '${id}'`);
    }
    return strategy;
  }

  async #updateStrategyStatusById(id: string): Promise<void> {
    await this.updateStrategyService.updateStatusById(id, 'Error');
  }
}
