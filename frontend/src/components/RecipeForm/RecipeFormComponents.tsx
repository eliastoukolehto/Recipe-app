import { Button, Grid2 as Grid, IconButton, TextField, Typography } from '@mui/material'
import { FieldArray, FieldArrayRenderProps, FormikProvider, useFormikContext } from 'formik'
import { IngredientCategory, RecipeFromInputs } from '../../types/recipe'
import { Add, Remove } from '@mui/icons-material'

const emptyIngredient = {
  amount: 1,
  unit: 'g',
  name: '',
}

const emptyIngredientCategory = {
  name: '',
  ingredients: [JSON.parse(JSON.stringify(emptyIngredient))],
}

const IngredientForm = ({ cIndex, category, cArrayHelpers }: { cIndex: number, category: IngredientCategory, cArrayHelpers: FieldArrayRenderProps }) => {
  const formik = useFormikContext<RecipeFromInputs>()

  return (
    <FormikProvider value={formik}>
      <Typography>Ingredients</Typography>
      <FieldArray name={`ingredientCategories[${cIndex}].ingredients`}>
        {iArrayHelpers => (
          <Grid container direction="column" spacing={2}>
            <Grid size={12}>
              {category.ingredients.map((_ingredient, iIndex) => (
                <div key={iIndex}>
                  <br />
                  <Grid container direction="row" spacing={0} alignItems="center">
                    <Grid size={2}>
                      <TextField
                        label="Amount"
                        name={`ingredientCategories[${cIndex}].ingredients[${iIndex}].amount`}
                        fullWidth
                        value={formik.values.ingredientCategories[cIndex].ingredients[iIndex].amount}
                        onChange={formik.handleChange}
                      />
                    </Grid>
                    <Grid size={3}>
                      <TextField
                        label="Unit"
                        name={`ingredientCategories[${cIndex}].ingredients[${iIndex}].unit`}
                        fullWidth
                        value={formik.values.ingredientCategories[cIndex].ingredients[iIndex].unit}
                        onChange={formik.handleChange}
                      />
                    </Grid>
                    <Grid size={6}>
                      <TextField
                        label="Name"
                        name={`ingredientCategories[${cIndex}].ingredients[${iIndex}].name`}
                        fullWidth
                        value={formik.values.ingredientCategories[cIndex].ingredients[iIndex].name}
                        onChange={formik.handleChange}
                      />
                    </Grid>
                    <Grid size={1}>
                      {category.ingredients.length > 1 && (
                        <IconButton onClick={() => iArrayHelpers.remove(iIndex)}>
                          <Remove />
                        </IconButton>
                      )}
                    </Grid>
                  </Grid>
                </div>
              ))}
            </Grid>
            <Grid size={12}>
              <IconButton onClick={() => iArrayHelpers.push(JSON.parse(JSON.stringify(emptyIngredient)))}>
                <Add />
              </IconButton>
            </Grid>
            <Grid size={12}>
              {formik.values.ingredientCategories.length > 1 && (
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => cArrayHelpers.remove(cIndex)}
                >
                  Remove category
                </Button>
              )}
            </Grid>
          </Grid>
        )}
      </FieldArray>
    </FormikProvider>
  )
}

export const IngredientCategoryForm = () => {
  const formik = useFormikContext<RecipeFromInputs>()

  return (
    <FormikProvider value={formik}>
      <Grid container direction="column" spacing={2}>
        <Grid size={12}>
          <Typography>Ingredient categories</Typography>
        </Grid>
        <Grid size={12}>
          <FieldArray name="ingredientCategories">
            {cArrayHelpers => (
              <Grid container direction="column" spacing={2}>
                <Grid size={12}>
                  {formik.values.ingredientCategories.map((category: IngredientCategory, cIndex: number) => (
                    <Grid key={cIndex} container direction="column" spacing={2}>
                      <Grid size={12}>
                        <TextField
                          label="Category name"
                          name={`ingredientCategories[${cIndex}].name`}
                          fullWidth
                          value={formik.values.ingredientCategories[cIndex].name}
                          onChange={formik.handleChange}
                        />
                      </Grid>
                      <Grid size={12}>
                        <IngredientForm cIndex={cIndex} category={category} cArrayHelpers={cArrayHelpers} />
                      </Grid>
                      <br />
                    </Grid>
                  ))}
                </Grid>
                <Grid size={12}>
                  <Button
                    variant="contained"
                    onClick={() => cArrayHelpers.push(JSON.parse(JSON.stringify(emptyIngredientCategory)))}
                  >
                    New category
                  </Button>
                </Grid>
              </Grid>
            )}
          </FieldArray>
        </Grid>
      </Grid>
    </FormikProvider>
  )
}
