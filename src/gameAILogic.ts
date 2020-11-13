import { Action, Inventory } from './game';

export const isPossibleActions = (
  action: Action,
  inventory: Inventory,
): boolean => {
  if (
    action.ingredients.reduce((a, b) => a + b) +
      inventory.reduce((a, b) => a + b) >
    10
  ) {
    return false;
  } else {
    for (let i = 0; i < 4; i++) {
      if (inventory[i] + action.ingredients[i] < 0) {
        return false;
      }
    }
    return true;
  }
};

export const filterPossibleBrews = (
  actions: Action[],
  inventory: Inventory,
): Action[] => {
  return actions
    .filter(action => action.type === 'BREW')
    .filter(action => isPossibleActions(action, inventory));
};

export const filterPossibleCasts = (
  actions: Action[],
  inventory: Inventory,
): Action[] => {
  return actions
    .filter(action => action.type === 'CAST' && action.castable)
    .filter(action => isPossibleActions(action, inventory));
};
