import { ActionType, Inventory, InventoryAndScore } from './game';

export const parseActions = () => {
  var inputs: string[] = readline().split(' ');
  const actionId: number = parseInt(inputs[0]);
  const actionType: ActionType = inputs[1] as ActionType;
  const delta0: number = parseInt(inputs[2]);
  const delta1: number = parseInt(inputs[3]);
  const delta2: number = parseInt(inputs[4]);
  const delta3: number = parseInt(inputs[5]);
  const price: number = parseInt(inputs[6]);
  const tomeIndex: number = parseInt(inputs[7]);
  const taxCount: number = parseInt(inputs[8]);
  const castable: boolean = inputs[9] !== '0';
  const repeatable: boolean = inputs[10] !== '0';
  return {
    id: actionId,
    type: actionType,
    ingredients: [delta0, delta1, delta2, delta3] as Inventory,
    price,
    castable,
    repeatable,
    tomeIndex,
    taxCount,
  };
};

export const parseInventoryAndScore = (): InventoryAndScore => {
  var inputs: string[] = readline().split(' ');
  const inv0: number = parseInt(inputs[0]);
  const inv1: number = parseInt(inputs[1]);
  const inv2: number = parseInt(inputs[2]);
  const inv3: number = parseInt(inputs[3]);
  const score: number = parseInt(inputs[4]);
  return {
    inventory: [inv0, inv1, inv2, inv3],
    score: score,
  };
};
