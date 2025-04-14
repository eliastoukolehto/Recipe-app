import { useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'
import { GET_RECIPE } from '../graphql/queries/recipeQueries'
import { Avatar, Divider, Grid2 as Grid, Stack, Typography } from '@mui/material'
import { Recipe } from '../types/recipe'

const RecipePage = () => {
  const { recipeId } = useParams()
  const { data: result, loading } = useQuery(GET_RECIPE, { variables: { id: Number(recipeId) } })
  const recipe = result?.recipe as Recipe

  if (loading || !result) {
    return (<div>Recipe not found</div>)
  }

  return (
    <Grid container direction="column" spacing={2}>
      <Grid size={12}>
        <Typography variant="h4" align="center">{recipe.name}</Typography>
      </Grid>
      {recipe.description && (
        <Grid size={12}>
          <Typography variant="subtitle1" align="center">{recipe.description}</Typography>
        </Grid>
      )}
      <Grid size={12}>
        <Stack direction="row" sx={{ justifyContent: 'space-evenly' }}>
          <Typography variant="subtitle1">
            <span>By: </span>
            <span>{recipe.user.username}</span>
          </Typography>
          {recipe.serving && (
            <Typography variant="subtitle1">
              <span>Serving </span>
              <span>{recipe.serving.per}</span>
              <span> </span>
              <span>{recipe.serving.unit}</span>
              <span> for </span>
              <span>{recipe.serving.amount}</span>
            </Typography>
          )}
          {recipe.prepareTime && (
            <Typography variant="subtitle1">
              <span>Prepare time: </span>
              <span>{recipe.prepareTime}</span>
              <span> minutes</span>
            </Typography>
          )}
        </Stack>
      </Grid>
      <Grid size={12}>
        <Grid container direction="row" spacing={10}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Grid size={12}>
              <Typography variant="h5" align="center">Ingredients</Typography>
            </Grid>
            {recipe.ingredientCategories.map((category, index) => (
              <Grid container direction="column" spacing={2} key={index}>
                {category.name && (
                  <Grid size={12}>
                    <Typography variant="h6">{category.name}</Typography>
                  </Grid>
                )}
                <Grid size={12}>
                  {category.ingredients.map((ingredient, index) => (
                    <span key={index}>
                      <Grid container direction="row" spacing={2}>
                        <Grid size={6}>
                          <Typography variant="subtitle2">
                            <span>{ingredient.amount}</span>
                            <span> </span>
                            <span>{ingredient.unit}</span>
                          </Typography>
                        </Grid>
                        <Grid size={6}>
                          <Typography variant="subtitle2">{ingredient.name}</Typography>
                        </Grid>
                      </Grid>
                      <Divider />
                    </span>
                  ))}
                </Grid>
              </Grid>
            ))}
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Grid container direction="column" spacing={2}>
              <Grid size={12}>
                <Typography variant="h5" align="center">Steps</Typography>
              </Grid>
              <Grid>
                {recipe.steps.map((step, index) => (
                  <div key={index}>
                    <Grid container direction="row" spacing={4}>
                      <Grid size={1}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>{index + 1}</Avatar>
                      </Grid>
                      <Grid size={10}>
                        <Typography variant="subtitle2">{step}</Typography>
                      </Grid>
                    </Grid>
                    <br />
                  </div>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default RecipePage
