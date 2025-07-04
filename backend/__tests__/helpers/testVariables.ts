export const recipeTestVariables = {
  name: 'breakfast porridge in the microwave',
  ingredientCategories: [{
    name: 'porridge',
    ingredients: [{
      name: 'four grain flakes',
      amount: 1,
      unit: 'dl',
    }, {
      name: 'water',
      amount: 2,
      unit: 'dl',
    }],
  }, {
    name: 'toppings',
    ingredients: [{
      name: 'salt',
      amount: 0.5,
      unit: 'tsp',
    }, {
      name: 'butter',
      amount: 25,
      unit: 'g',
    },
    {
      name: 'fresh berries',
      amount: 50,
      unit: 'g',
    }],
  }],
  steps: [
    'Mix porridge ingredients in a bowl',
    'Microwave at 800W for 3 minutes',
    'Top with salt and butter or berries',
  ],
}

export const recipeTestVariablesFull = {
  ...recipeTestVariables,
  description: 'high fiber porridge for breakfast',
  serving: {
    amount: 1,
    per: 3,
    unit: 'dl',
  },
  prepareTime: 5,
}
