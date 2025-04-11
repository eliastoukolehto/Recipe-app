/* import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks'
import { notify } from '../reducers/notificationReducer' */
import { FieldArray, FormikProvider, useFormik } from 'formik'
import { IngredientCategory, RecipeFromInputs } from '../types/recipe'
import * as Yup from 'yup'
import { Button, Grid2 as Grid, TextField, Typography } from '@mui/material'

const emptyIngredient = {
  amount: 1,
  unit: 'g',
  name: '',
}

const emptyIngredientCategory = {
  name: '',
  ingredients: [JSON.parse(JSON.stringify(emptyIngredient))],
}

const RecipeForm = () => {
  /* const user = useAppSelector(state => state.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate() */

  const handleSubmit = (values: RecipeFromInputs) => {
    console.log('values:', values)
  }
  // add after completed
  /* if (!user) {
    dispatch(notify({ severity: 'info', message: `Login before adding new recipes` }))
    navigate('/')
  } */

  const initialValues = {
    name: '',
    description: '',
    ingredientCategories: [emptyIngredientCategory],
    steps: [''],
    serving: {
      amount: 0,
      unit: '',
      per: 0,
    },
    preparetime: 0,
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name required'),
    description: Yup.string(),
    ingredientCategories: Yup.array().of(Yup.object({
      name: Yup.string(),
      ingredients: Yup.array().of(Yup.object({
        amount: Yup.number(),
        unit: Yup.string(),
        name: Yup.string().required('Ingredient must have a name'),
      })).min(1, 'At least one ingredient required'),
    }).required()).required(),
    steps: Yup.array().of(Yup.string()).min(1, 'at least one step required'),
    serving: Yup.object({
      amount: Yup.number().required('Required'),
      per: Yup.number().required('Required'),
      unit: Yup.string().required('Required'),
    }),
    prepareTime: Yup.number(),
  })

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  })

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container direction="column" spacing={2}>
          <Grid size={12}>
            <Typography>Create new Recipe</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Name"
              name="name"
              fullWidth
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Description"
              name="description"
              fullWidth
              value={formik.values.description}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid size={12}>
            <Typography>Ingredient categories</Typography>
          </Grid>
          <Grid size={12}>
            <FieldArray name="ingredientCategories">
              {cArrayHelpers => (
                <div>
                  {formik.values.ingredientCategories.map((category: IngredientCategory, cIndex: number) => (
                    <Grid key={cIndex} container direction="column" spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          label="Category name"
                          name={`ingredientCategories[${cIndex}].name`}
                          fullWidth
                          value={formik.values.ingredientCategories[cIndex].name}
                          onChange={formik.handleChange}
                        />
                      </Grid>
                      <Grid size={12}>
                        <Typography>Ingredients</Typography>
                      </Grid>
                      <FieldArray name={`ingredientCategories[${cIndex}].ingredients`}>
                        {iArrayHelpers => (
                          <div>
                            {category.ingredients.map((_ingredient, iIndex) => (
                              <Grid key={iIndex} container direction="column" spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                  <TextField
                                    label="Amount"
                                    name={`ingredientCategories[${cIndex}].ingredients[${iIndex}].amount`}
                                    fullWidth
                                    value={formik.values.ingredientCategories[cIndex].ingredients[iIndex].amount}
                                    onChange={formik.handleChange}
                                  />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                  <TextField
                                    label="Unit"
                                    name={`ingredientCategories[${cIndex}].ingredients[${iIndex}].unit`}
                                    fullWidth
                                    value={formik.values.ingredientCategories[cIndex].ingredients[iIndex].unit}
                                    onChange={formik.handleChange}
                                  />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                  <TextField
                                    label="Name"
                                    name={`ingredientCategories[${cIndex}].ingredients[${iIndex}].name`}
                                    fullWidth
                                    value={formik.values.ingredientCategories[cIndex].ingredients[iIndex].name}
                                    onChange={formik.handleChange}
                                  />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                  {category.ingredients.length > 1 && (
                                    <Button
                                      variant="contained"
                                      onClick={() => iArrayHelpers.remove(iIndex)}
                                    >
                                      Remove ingredient
                                    </Button>
                                  )}
                                </Grid>
                              </Grid>
                            ))}
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Button
                                variant="contained"
                                onClick={() => iArrayHelpers.push(JSON.parse(JSON.stringify(emptyIngredient)))}
                              >
                                New ingredient
                              </Button>
                            </Grid>
                            {formik.values.ingredientCategories.length > 1 && (
                              <Button
                                variant="contained"
                                onClick={() => cArrayHelpers.remove(cIndex)}
                              >
                                Remove category
                              </Button>
                            )}
                          </div>
                        )}
                      </FieldArray>
                    </Grid>
                  ))}
                  <Button
                    variant="contained"
                    onClick={() => cArrayHelpers.push(JSON.parse(JSON.stringify(emptyIngredientCategory)))}
                  >
                    New category
                  </Button>
                </div>
              )}

            </FieldArray>
          </Grid>
          <Grid size={12}>
            <Typography>Steps</Typography>
          </Grid>
          <Grid size={12}>
            <FieldArray name="steps">
              {ArrayHelpers => (
                <div>
                  {formik.values.steps.map((_steps, Index: number) => (
                    <Grid key={Index} container direction="column" spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          label="Step"
                          name={`steps[${Index}]`}
                          fullWidth
                          value={formik.values.steps[Index]}
                          onChange={formik.handleChange}
                        />
                      </Grid>
                      {formik.values.steps.length > 1 && (
                        <Button
                          variant="contained"
                          onClick={() => ArrayHelpers.remove(Index)}
                        >
                          Remove Step
                        </Button>
                      )}
                    </Grid>
                  ))}
                  <Button
                    variant="contained"
                    onClick={() => ArrayHelpers.push('')}
                  >
                    New step
                  </Button>
                </div>
              )}

            </FieldArray>
          </Grid>
          <Grid size={12}>
            <Typography>Serving</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Amount"
              name="serving.amount"
              fullWidth
              value={formik.values.serving.amount}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Per person"
              name="serving.per"
              fullWidth
              value={formik.values.serving.per}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Unit"
              name="serving.unit"
              fullWidth
              value={formik.values.serving.unit}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid size={12}>
            <Button type="submit" variant="contained">
              Create
            </Button>
          </Grid>
        </Grid>
      </form>
    </FormikProvider>
  )
}

export default RecipeForm
