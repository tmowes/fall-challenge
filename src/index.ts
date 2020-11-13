import { filterPossibleBrews, filterPossibleCasts } from './gameAILogic';
import { parseInventoryAndScore, parseOrder } from './input';
import { random } from './random';

// game loop
while (true) {
  const actionCount: number = parseInt(readline()); // the number of spells and recipes in play
  let turnActions = [];
  for (let i = 0; i < actionCount; i++) {
    turnActions.push(parseOrder());
  }
  const { inventory: myInventory, score: myScore } = parseInventoryAndScore();
  const { inventory: eInventory, score: eScore } = parseInventoryAndScore();
  // console.error(turnActions.map(action => JSON.stringify(action)).join(', \n'));
  const possibleBrew = filterPossibleBrews(turnActions, myInventory);
  const possibleCast = filterPossibleCasts(turnActions, myInventory);

  if (possibleBrew.length > 0) {
    console.log(`BREW ${possibleBrew[0].id}`);
  } else if (possibleCast.length > 0) {
    const randomIndex = Math.ceil(random() * (possibleCast.length - 1));
    console.log(`CAST ${possibleCast[randomIndex].id}`);
  } else {
    console.log('REST');
  }
  // Write an action using console.log()
  // To debug: console.error('Debug messages...');
  // in the first league: BREW <id> | WAIT; later: BREW <id> | CAST <id> [<times>] | LEARN <id> | REST | WAIT
}
