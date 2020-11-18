export type ActionType = 'BREW' | 'CAST' | 'OPPONENT_CAST' | 'WAIT' | 'REST' | 'LEARN';

export interface Action {
  id: number;
  type: ActionType;
  ingredients: Inventory;
  price: number;
  castable: boolean;
  repeatable: boolean;
  tomeIndex: number;
  taxCount: number;
}
export interface InventoryAndScore {
  inventory: Inventory;
  score: number;
}

export type Inventory = [number, number, number, number];

export interface IsPossible {
  ingredients: Inventory;
  inventory: Inventory;
}
