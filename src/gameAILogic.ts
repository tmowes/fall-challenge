import { Action, Inventory, IsPossible } from './game';

export const isPossibleActions = ({ inventory, ingredients }: IsPossible) => {
  if (ingredients.reduce((a, b) => a + b) + inventory.reduce((a, b) => a + b) > 10) {
    return false;
  } else {
    for (let i = 0; i < 4; i++) {
      if (inventory[i] + ingredients[i] < 0) {
        return false;
      }
    }
    return true;
  }
};

export const filterPossibleBrews = (actions: Action[], inventory: Inventory): Action[] => {
  return actions
    .filter(({ type }) => type === 'BREW')
    .filter(({ ingredients }) => isPossibleActions({ ingredients, inventory }));
};

export const filterPossibleCasts = (actions: Action[], inventory: Inventory): Action[] => {
  return actions
    .filter(({ type, castable }) => type === 'CAST' && castable)
    .filter(({ ingredients }) => isPossibleActions({ ingredients, inventory }));
};

export const filterPossibleLearns = (actions: Action[], inventory: Inventory): Action[] => {
  return actions.filter(({ type }) => type === 'LEARN').filter(({ tomeIndex }) => tomeIndex <= inventory[0]);
};

export const getInventoryDifference = (firstInventory: Inventory, secondInventory: Inventory) => {
  let difference = 0;
  for (let i = 0; i < 4; i++) {
    difference += Math.abs(firstInventory[i] - secondInventory[i]);
  }
  return difference;
};

export const getDistanceToAction = ({ inventory, ingredients }: IsPossible) => {
  let difference = 0;
  for (let i = 0; i < 4; i++) {
    if (inventory[i] > -ingredients[i]) {
      continue;
    } else {
      difference += Math.abs(inventory[i] - -ingredients[i]);
    }
  }
  return difference;
};

export const getCastLoss = (cast: Action, brewActions: Action[], myInventory: Inventory) => {
  const futureInventory = simulateInventoryAction(myInventory, cast);
  const futureDiff = brewActions
    .map(({ ingredients, price }) => getDistanceToAction({ inventory: futureInventory, ingredients }) * price)
    .reduce((a, b) => a + b);
  // console.error(`Difference:  ${futureDiff}`);
  return futureDiff;
};

export const getBestBrew = (actions: Action[]): Action => {
  const brewActions = actions.filter(({ type }) => type === 'BREW');
  let bestBrew = brewActions[0];
  for (let i = 0; i < brewActions.length; i++) {
    if (brewActions[i].price > bestBrew.price) {
      bestBrew = brewActions[i];
    }
  }
  return bestBrew;
};

export const simulateInventoryAction = (inventory: Inventory, cast: Action) => {
  let futureInventory: Inventory = [...inventory];
  console.error({ futureInventory });

  for (let i = 0; i < 4; i++) {
    futureInventory[i] += cast.ingredients[i];
  }
  return futureInventory;
};

export const getBestCast = (turnActions: Action[], myInventory: Inventory) => {
  let possibleCast = filterPossibleCasts(turnActions, myInventory);

  let brewActions = turnActions.filter(({ type }) => type === 'BREW');

  const castValues = possibleCast.map(cast => ({ cast, value: getCastLoss(cast, brewActions, myInventory) }));

  const currentDiff = brewActions
    .map(({ ingredients, price }) => getDistanceToAction({ inventory: myInventory, ingredients }) * price)
    .reduce((a, b) => a + b);

  const viableCast = castValues.filter(({ value }) => value <= currentDiff);

  if (viableCast.length > 0) {
    let bestCast = viableCast[0];
    for (let i = 1; i < viableCast.length; i++) {
      if (viableCast[i].value < bestCast.value) {
        bestCast = viableCast[i];
      }
    }
    return bestCast.cast;
  }
  return null;
};

export const getBestCastV2 = (
  turnActions: Action[],
  myInventory: Inventory,
  depth: number,
): { cast: Action; value?: number } | null => {
  console.error(
    `My Inventory:${myInventory}, turnActions ${turnActions.map(({ id }) => id)} , depth:${depth}`,
  );
  let brewActions = turnActions.filter(({ type }) => type === 'BREW');
  if (depth === 0) {
    const cast = getBestCast(turnActions, myInventory);
    if (cast) {
      return { cast, value: getCastLoss(cast, brewActions, myInventory) };
    }
    return null;
  } else {
    let possibleCast = filterPossibleCasts(turnActions, myInventory);
    let bestCast = null;

    for (let i = 0; i < possibleCast.length; i++) {
      console.error(`SIMULATE: ${possibleCast[i].id}`);

      const futureInventory = simulateInventoryAction(myInventory, possibleCast[i]);
      const futureActions = [...turnActions].filter(({ id }) => id !== possibleCast[i].id);

      const futureBestCast = getBestCastV2(futureActions, futureInventory, depth - 1);
      if (futureBestCast !== null) {
        if (bestCast === null || futureBestCast.value < bestCast.value) {
          bestCast = { cast: possibleCast[i], value: futureBestCast.value };
        }
      }
    }
    console.error(`Returning the bestCast: ${JSON.stringify(bestCast)}`);

    return bestCast;
  }
};
