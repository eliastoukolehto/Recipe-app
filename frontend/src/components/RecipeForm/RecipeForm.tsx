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

const emptyServing = {
  amount: 0,
  unit: '',
  per: 0,
}

const RecipeForm = () => {
  // This component could use refactoring to increase readability

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
    serving: emptyServing,
    prepareTime: 0,
  }

  const validationSchema = Yup.object<RecipeFromInputs>().shape({
    name: Yup.string().required('Name required').max(100, 'Name is too long'),
    description: Yup.string(),
    ingredientCategories: Yup.array().of(Yup.object({
      name: Yup.string().max(20, 'Too long'),
      ingredients: Yup.array().of(Yup.object({
        amount: Yup.number().nullable().transform((value, original) => (original === '' ? undefined : value)).min(0).max(10000),
        unit: Yup.string().max(10),
        name: Yup.string().required('Ingredients must have a name').max(20, 'Ingredient name too long'),
      })),
    }).required()).required(),
    steps: Yup.array().of(Yup.string().required('Step can\'t be empty').max(1000, 'Too long')).min(1, 'at least one step required'),
    serving: Yup.object({
      amount: Yup.number().required('Servings required').min(1, 'Servings must be more than 1').max(100, 'Servings must be less than 100'),
      per: Yup.number().required('Per person required').min(0, 'Serving per person must be more than 0').max(1000, 'Serving per person must be less than 1000'),
      unit: Yup.string().required('Unit required').max(10, 'Unit too long'),
    }).default(undefined).nullable(),
    prepareTime: Yup.number().nullable().transform((value, original) => ((original === '' || original === 0) ? undefined : value)).max(3000, 'Too large').min(0, 'Too small'),
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
                                error={Boolean(formik.errors.steps?.[Index])}
                                helperText={formik.errors.steps?.[Index]}
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
                          {formik.values.steps.length < 10 && (
                            <IconButton data-testid="addStepButton" onClick={() => ArrayHelpers.push('')}>
                              <AddIcon />
                            </IconButton>
                          )}
                        </Grid>
                      </div>
                    )}

                  </FieldArray>
                </Grid>
                {formik.values.serving && (
                  <div>
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
                          error={Boolean(formik.errors.serving?.amount)}
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
                          error={Boolean(formik.errors.serving?.per)}
                          value={formik.values.serving.per}
                          onChange={formik.handleChange}
                        />
                      </Grid>
                      <Grid size={4}>
                        <TextField
                          label="Unit"
                          name="serving.unit"
                          fullWidth
                          error={Boolean(formik.errors.serving?.unit)}
                          value={formik.values.serving.unit}
                          onChange={formik.handleChange}
                        />
                      </Grid>
                      {Boolean(formik.errors.serving) && (
                        <FormHelperText error data-testid="servingError">
                          {formik.errors.serving?.amount === undefined
                            ? (formik.errors.serving?.per === undefined
                                ? formik.errors.serving?.unit
                                : formik.errors.serving?.per)
                            : formik.errors.serving?.amount}
                        </FormHelperText>
                      )}
                      <Grid size={12}>
                        <Button
                          variant="contained"
                          color="warning"
                          onClick={() => formik.setFieldValue('serving', undefined)}
                        >
                          Remove serving
                        </Button>
                      </Grid>
                    </Grid>
                  </div>
                )}
                {!formik.values.serving && (
                  <Button
                    variant="contained"
                    onClick={() => formik.setFieldValue('serving', emptyServing)}
                  >
                    Add serving
                  </Button>
                )}
                <br />
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
                      error={Boolean(formik.errors.prepareTime)}
                      helperText={formik.errors.prepareTime}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid size={12}>
            {!formik.isValid && (
              <FormHelperText error>Check form values</FormHelperText>
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
