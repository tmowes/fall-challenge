interface GameState {
  // current game state
}

export type ActionType =
  | 'BREW'
  | 'CAST'
  | 'OPPONENT_CAST'
  | 'WAIT'
  | 'REST'
  | 'LEARN';

export interface Action {
  id: number;
  type: ActionType;
  ingredients: number[];
  price: number;
  castable: boolean;
}
export interface InventoryAndScore {
  inventory: Inventory;
  score: number;
}

export type Inventory = [number, number, number, number];
