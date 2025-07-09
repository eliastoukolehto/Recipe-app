import { Button, Grid2 as Grid, Paper, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { RecipeListItem } from '../types/recipe'
import LikeInteraction from './LikeInteraction'

const RecipeList = ({ recipes }: { recipes: RecipeListItem[] }) => {
  return (
    <>
      <Grid container spacing={2}>
        {recipes.map((recipe, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
            <Paper sx={{ aspectRatio: 1, padding: 2 }}>
              <Grid container direction="column" spacing={2} sx={{ aspectRatio: 1, justifyContent: 'space-between' }}>
                <Grid size={12}>
                  <Typography noWrap variant="h6">{recipe.name}</Typography>
                </Grid>
                <Grid size="grow">
                  <Typography sx={{ overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: '3',
                    WebkitBoxOrient: 'vertical',
                  }}
                  >
                    {recipe.description}
                  </Typography>
                </Grid>
                <Grid size="auto">
                  <Grid container direction="row" sx={{ alignItems: 'center' }}>
                    <Grid size="grow">
                      <Button component={Link} to={`recipes/${recipe.id}`} variant="outlined">
                        View
                      </Button>
                    </Grid>
                    <LikeInteraction recipe={recipe} showlikes={true} />
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default RecipeList
