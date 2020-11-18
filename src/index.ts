import { filterPossibleBrews, filterPossibleLearns, getBestCast, getBestCastV2 } from './gameAILogic';
import { parseInventoryAndScore, parseActions } from './input';

// let currentTurn = 0;
// game loop
while (true) {
  const actionCount: number = parseInt(readline());
  let turnActions = [];
  for (let i = 0; i < actionCount; i++) {
    turnActions.push(parseActions());
  }
  const { inventory: myInventory } = parseInventoryAndScore();
  const { inventory: eInventory, score: eScore } = parseInventoryAndScore();

  const possibleLearns = filterPossibleLearns(turnActions, myInventory);
  const possibleBrew = filterPossibleBrews(turnActions, myInventory);

  if (possibleLearns.length > 0) {
    const learnValues = possibleLearns.map(learn => ({
      learn,
      value: learn.ingredients.reduce((a, b) => a + b) - learn.tomeIndex,
    }));
    learnValues.sort((a, b) => b.value - a.value);
    if (learnValues[0].value >= 0) {
      console.log(`LEARN ${learnValues[0].learn.id}`);
      continue;
    }
  }

  if (possibleBrew.length > 0) {
    console.log(`BREW ${possibleBrew[0].id}`);
    continue;
  }

  const bestCast = getBestCast(turnActions, myInventory);
  const bestCastV2 = getBestCastV2(turnActions, myInventory, 2);

  if (bestCast) {
    console.log(`CAST ${bestCast.id}`);
    continue;
  }
  console.error('################REST##################');
  console.log('REST');
}
