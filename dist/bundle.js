const isPossibleActions = ({ inventory, ingredients }) => {
    if (ingredients.reduce((a, b) => a + b) + inventory.reduce((a, b) => a + b) > 10) {
        return false;
    }
    else {
        for (let i = 0; i < 4; i++) {
            if (inventory[i] + ingredients[i] < 0) {
                return false;
            }
        }
        return true;
    }
};
const filterPossibleBrews = (actions, inventory) => {
    return actions
        .filter(({ type }) => type === 'BREW')
        .filter(({ ingredients }) => isPossibleActions({ ingredients, inventory }));
};
const filterPossibleCasts = (actions, inventory) => {
    return actions
        .filter(({ type, castable }) => type === 'CAST' && castable)
        .filter(({ ingredients }) => isPossibleActions({ ingredients, inventory }));
};
const filterPossibleLearns = (actions, inventory) => {
    return actions.filter(({ type }) => type === 'LEARN').filter(({ tomeIndex }) => tomeIndex <= inventory[0]);
};
const getDistanceToAction = ({ inventory, ingredients }) => {
    let difference = 0;
    for (let i = 0; i < 4; i++) {
        if (inventory[i] > -ingredients[i]) {
            continue;
        }
        else {
            difference += Math.abs(inventory[i] - -ingredients[i]);
        }
    }
    return difference;
};
const getCastLoss = (cast, brewActions, myInventory) => {
    const futureInventory = simulateInventoryAction(myInventory, cast);
    const futureDiff = brewActions
        .map(({ ingredients, price }) => getDistanceToAction({ inventory: futureInventory, ingredients }) * price)
        .reduce((a, b) => a + b);
    // console.error(`Difference:  ${futureDiff}`);
    return futureDiff;
};
const simulateInventoryAction = (inventory, cast) => {
    let futureInventory = [...inventory];
    console.error({ futureInventory });
    for (let i = 0; i < 4; i++) {
        futureInventory[i] += cast.ingredients[i];
    }
    return futureInventory;
};
const getBestCast = (turnActions, myInventory) => {
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
const getBestCastV2 = (turnActions, myInventory, depth) => {
    console.error(`My Inventory:${myInventory}, turnActions ${turnActions.map(({ id }) => id)} , depth:${depth}`);
    let brewActions = turnActions.filter(({ type }) => type === 'BREW');
    if (depth === 0) {
        const cast = getBestCast(turnActions, myInventory);
        if (cast) {
            return { cast, value: getCastLoss(cast, brewActions, myInventory) };
        }
        return null;
    }
    else {
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

const parseActions = () => {
    var inputs = readline().split(' ');
    const actionId = parseInt(inputs[0]);
    const actionType = inputs[1];
    const delta0 = parseInt(inputs[2]);
    const delta1 = parseInt(inputs[3]);
    const delta2 = parseInt(inputs[4]);
    const delta3 = parseInt(inputs[5]);
    const price = parseInt(inputs[6]);
    const tomeIndex = parseInt(inputs[7]);
    const taxCount = parseInt(inputs[8]);
    const castable = inputs[9] !== '0';
    const repeatable = inputs[10] !== '0';
    return {
        id: actionId,
        type: actionType,
        ingredients: [delta0, delta1, delta2, delta3],
        price,
        castable,
        repeatable,
        tomeIndex,
        taxCount,
    };
};
const parseInventoryAndScore = () => {
    var inputs = readline().split(' ');
    const inv0 = parseInt(inputs[0]);
    const inv1 = parseInt(inputs[1]);
    const inv2 = parseInt(inputs[2]);
    const inv3 = parseInt(inputs[3]);
    const score = parseInt(inputs[4]);
    return {
        inventory: [inv0, inv1, inv2, inv3],
        score: score,
    };
};

// let currentTurn = 0;
// game loop
while (true) {
    const actionCount = parseInt(readline());
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
//# sourceMappingURL=bundle.js.map
