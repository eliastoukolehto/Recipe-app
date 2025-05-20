import { Button, FormHelperText, Grid2 as Grid, IconButton, TextField, Typography } from '@mui/material'
import { FieldArray, FieldArrayRenderProps, FormikProvider, getIn, useFormikContext } from 'formik'
import { IngredientCategory, RecipeFromInputs } from '../../types/recipe'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

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
                    <Grid size={3}>
                      <TextField
                        label="Amount"
                        name={`ingredientCategories[${cIndex}].ingredients[${iIndex}].amount`}
                        type="number"
                        fullWidth
                        error={Boolean(getIn(formik.errors, `ingredientCategories[${cIndex}].ingredients[${iIndex}].amount`))}
                        value={formik.values.ingredientCategories[cIndex].ingredients[iIndex].amount}
                        onChange={formik.handleChange}
                      />
                    </Grid>
                    <Grid size={3}>
                      <TextField
                        label="Unit"
                        name={`ingredientCategories[${cIndex}].ingredients[${iIndex}].unit`}
                        fullWidth
                        error={Boolean(getIn(formik.errors, `ingredientCategories[${cIndex}].ingredients[${iIndex}].unit`))}
                        value={formik.values.ingredientCategories[cIndex].ingredients[iIndex].unit}
                        onChange={formik.handleChange}
                      />
                    </Grid>
                    <Grid size={5}>
                      <TextField
                        label="Name"
                        name={`ingredientCategories[${cIndex}].ingredients[${iIndex}].name`}
                        fullWidth
                        error={Boolean(getIn(formik.errors, `ingredientCategories[${cIndex}].ingredients[${iIndex}].name`))}
                        value={formik.values.ingredientCategories[cIndex].ingredients[iIndex].name}
                        onChange={formik.handleChange}
                      />
                    </Grid>
                    <Grid size={1}>
                      {category.ingredients.length > 1 && (
                        <IconButton onClick={() => iArrayHelpers.remove(iIndex)}>
                          <RemoveIcon />
                        </IconButton>
                      )}
                    </Grid>
                    {getIn(formik.errors, `ingredientCategories[${cIndex}].ingredients[${iIndex}].name`) && (
                      <FormHelperText error data-testid="ingredientNameError">{getIn(formik.errors, `ingredientCategories[${cIndex}].ingredients[${iIndex}].name`)}</FormHelperText>
                    )}
                  </Grid>
                </div>
              ))}
            </Grid>
            <Grid size={12}>
              {formik.values.ingredientCategories[cIndex].ingredients.length < 20 && (
                <IconButton data-testid="addIngredientButton" onClick={() => iArrayHelpers.push(JSON.parse(JSON.stringify(emptyIngredient)))}>
                  <AddIcon />
                </IconButton>
              )}
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
                          error={getIn(formik.errors, `ingredientCategories[${cIndex}].name`)}
                          helperText={getIn(formik.errors, `ingredientCategories[${cIndex}].name`)}
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
                  {formik.values.ingredientCategories.length < 10 && (
                    <Button
                      variant="contained"
                      onClick={() => cArrayHelpers.push(JSON.parse(JSON.stringify(emptyIngredientCategory)))}
                    >
                      New category
                    </Button>
                  )}
                </Grid>
              </Grid>
            )}
          </FieldArray>
        </Grid>
      </Grid>
    </FormikProvider>
  )
}
