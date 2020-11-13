import { ActionType, InventoryAndScore } from './game';

export const parseOrder = () => {
  var inputs: string[] = readline().split(' ');
  const actionId: number = parseInt(inputs[0]); // the unique ID of this spell or recipe
  const actionType: ActionType = inputs[1] as ActionType; // in the first league: BREW; later: CAST, OPPONENT_CAST, LEARN, BREW
  const delta0: number = parseInt(inputs[2]); // tier-0 ingredient change
  const delta1: number = parseInt(inputs[3]); // tier-1 ingredient change
  const delta2: number = parseInt(inputs[4]); // tier-2 ingredient change
  const delta3: number = parseInt(inputs[5]); // tier-3 ingredient change
  const price: number = parseInt(inputs[6]); // the price in rupees if this is a potion
  const tomeIndex: number = parseInt(inputs[7]); // in the first two leagues: always 0; later: the index in the tome if this is a tome spell, equal to the read-ahead tax
  const taxCount: number = parseInt(inputs[8]); // in the first two leagues: always 0; later: the amount of taxed tier-0 ingredients you gain from learning this spell
  const castable: boolean = inputs[9] !== '0'; // in the first league: always 0; later: 1 if this is a castable player spell
  const repeatable: boolean = inputs[10] !== '0'; // for the first two leagues: always 0; later: 1 if this is a repeatable player spell
  return {
    id: actionId,
    type: actionType,
    ingredients: [delta0, delta1, delta2, delta3],
    price,
    castable,
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
