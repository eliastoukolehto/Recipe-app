import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { notify } from '../../reducers/notificationReducer'
import { FieldArray, FormikProvider, useFormik } from 'formik'
import { RecipeFromInputs } from '../../types/recipe'
import * as Yup from 'yup'
import { Button, FormHelperText, Grid2 as Grid, IconButton, TextField, Typography } from '@mui/material'
import { IngredientCategoryForm } from './RecipeFormComponents'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { useMutation } from '@apollo/client'
import { ADD_RECIPE } from '../../graphql/queries/recipeQueries'

const emptyIngredient = {
  amount: 1,
  unit: 'g',
  name: '',
}

const emptyIngredientCategory = {
  name: '',
  ingredients: [JSON.parse(JSON.stringify(emptyIngredient))],
}

// TODO: replace forms with fewer fields and parse them, increasing performance and reducing bugs
// TODO: make serving field optional
const RecipeForm = () => {
  const user = useAppSelector(state => state.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [addRecipe] = useMutation(ADD_RECIPE)

  const handleSubmit = async (inputs: RecipeFromInputs) => {
    try {
      const values = validationSchema.cast(inputs)
      const { data } = await addRecipe({ variables: values })
      const recipeId = data.createRecipe.id
      dispatch(notify({ severity: 'success', message: `Adding recipe succeeded` }))
      navigate(`/recipes/${recipeId}`)
    }
    catch {
      dispatch(notify({ severity: 'error', message: `Adding recipe failed: unknown error` }))
    }
  }

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
    prepareTime: 0,
  }

  const validationSchema = Yup.object<RecipeFromInputs>().shape({
    name: Yup.string().required('Name required'),
    description: Yup.string(),
    ingredientCategories: Yup.array().of(Yup.object({
      name: Yup.string(),
      ingredients: Yup.array().of(Yup.object({
        amount: Yup.number().nullable().transform((value, original) => (original === '' ? undefined : value)),
        unit: Yup.string(),
        name: Yup.string().required('Ingredients must have a name'),
      })).min(1, 'At least one ingredient required'),
    }).required()).required(),
    steps: Yup.array().of(Yup.string().required('step can\'t be empty')).min(1, 'at least one step required'),
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
    validateOnChange: false,
    onSubmit: handleSubmit,
  })

  if (!user) {
    return <div>Only users who are logged in can add new recipes</div>
  }

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container direction="column" spacing={2}>
          <Grid size={12}>
            <Typography>Create new Recipe</Typography>
          </Grid>
          <Grid size={12}>
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
          <Grid size={12}>
            <TextField
              label="Description"
              name="description"
              multiline
              maxRows={4}
              minRows={2}
              fullWidth
              value={formik.values.description}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid container direction="row" spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <IngredientCategoryForm />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Grid container direction="column" spacing={0}>
                <Typography>Steps</Typography>
                <Grid size={12}>
                  <FieldArray name="steps">
                    {ArrayHelpers => (
                      <div>
                        {formik.values.steps.map((_steps, Index: number) => (
                          <Grid key={Index} container direction="column" spacing={2}>
                            <Grid size={12}>
                              <br />
                              <TextField
                                label="Step"
                                name={`steps[${Index}]`}
                                fullWidth
                                multiline
                                maxRows={4}
                                minRows={2}
                                error={Boolean(formik.errors.steps)}
                                value={formik.values.steps[Index]}
                                onChange={formik.handleChange}
                              />
                            </Grid>
                          </Grid>
                        ))}
                        <Grid container direction="row-reverse" spacing={2}>
                          {formik.values.steps.length > 1 && (
                            <IconButton onClick={() => ArrayHelpers.pop()}>
                              <RemoveIcon />
                            </IconButton>
                          )}
                          <IconButton onClick={() => ArrayHelpers.push('')}>
                            <AddIcon />
                          </IconButton>
                        </Grid>
                      </div>
                    )}

                  </FieldArray>
                </Grid>
                <Grid size={12}>
                  <Typography>Serving</Typography>
                  <br />
                </Grid>
                <Grid container direction="row" rowSpacing={2} columnSpacing={0} alignItems="center">
                  <Grid size={4}>
                    <TextField
                      label="Servings"
                      name="serving.amount"
                      type="number"
                      fullWidth
                      error={Boolean(formik.errors.serving)}
                      value={formik.values.serving.amount}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                  <Grid size={4}>
                    <TextField
                      label="Per person"
                      name="serving.per"
                      type="number"
                      fullWidth
                      error={Boolean(formik.errors.serving)}
                      value={formik.values.serving.per}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                  <Grid size={4}>
                    <TextField
                      label="Unit"
                      name="serving.unit"
                      fullWidth
                      error={Boolean(formik.errors.serving)}
                      value={formik.values.serving.unit}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                  {Boolean(formik.errors.serving) && (
                    <FormHelperText error>Required</FormHelperText>
                  )}
                </Grid>
                <Grid container direction="row" rowSpacing={2} columnSpacing={0} alignItems="center">
                  <Grid size={12}>
                    <Typography>Prepare time (minutes)</Typography>
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      label="Prepare time"
                      name="prepareTime"
                      type="number"
                      fullWidth
                      value={formik.values.prepareTime}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid size={12}>
            {!formik.isValid && (
              <FormHelperText error>Missing form values</FormHelperText>
            )}
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
