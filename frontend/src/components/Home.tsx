import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { GET_RECIPES } from '../graphql/queries/recipeQueries'
import { Box, Button, Grid2 as Grid, Pagination, Paper, Typography } from '@mui/material'
import { RecipeListItem } from '../types/recipe'
import { Link } from 'react-router-dom'

const Home = () => {
  const [page, setPage] = useState<number>(0)
  const { data: result, loading, refetch } = useQuery(GET_RECIPES, { variables: { page } })
  const recipes = result?.recipes.rows as RecipeListItem[]
  const count = result?.recipes.count as number
  const perPage = 12 // hardcoded in backend

  useEffect(() => {
    refetch()
  }, [page])

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value - 1)
  }

  if (loading || !result) {
    return (<div>No recipes found</div>)
  }

  return (
    <>
      <div>
        <span>{count}</span>
        <span> recipes</span>
      </div>
      <br />
      <Grid container spacing={2}>
        {recipes.length === 0 && (
          <div>No recipes found</div>
        )}
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
                  <Button component={Link} to={`recipes/${recipe.id}`} variant="outlined">
                    View
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <br />
      <Box sx={{ justifyContent: 'center', display: 'flex' }}>
        <Pagination count={Math.ceil(count / perPage)} onChange={handlePageChange} />
      </Box>
    </>
  )
}

export default Home
