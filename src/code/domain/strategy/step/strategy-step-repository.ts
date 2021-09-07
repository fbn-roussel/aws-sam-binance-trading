import { SendOrderSide, StrategyStep, StrategyStepType } from '../model/strategy-step';

export interface StrategyStepRepository {
  save(step: StrategyStep): Promise<StrategyStep>;

  getLastByStrategyId(strategyId: string): Promise<StrategyStep | null>;

  getLastByStrategyIdAndType(strategyId: string, type: StrategyStepType): Promise<StrategyStep | null>;

  getLastSendOrderByStrategyIdAndOrderSide(strategyId: string, orderSide: SendOrderSide): Promise<StrategyStep | null>;
}
