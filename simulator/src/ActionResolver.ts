export class ActionResolver {
  static roll(atk: number, def: number): { success: boolean; isCrit: boolean } {
    const isCrit = Math.random() < 0.2;

    if (isCrit) {
      return { success: true, isCrit: true };
    }

    const winChance = atk / (atk + def || 1);

    const success = Math.random() < winChance;

    return {
      success,
      isCrit: false,
    };
  }
}
