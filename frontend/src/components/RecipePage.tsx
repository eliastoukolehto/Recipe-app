import { useMutation, useQuery } from '@apollo/client'
import { useNavigate, useParams } from 'react-router-dom'
import { DELETE_RECIPE, GET_RECIPE } from '../graphql/queries/recipeQueries'
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid2 as Grid, IconButton, Menu, MenuItem, Paper, Stack, Typography } from '@mui/material'
import { Recipe } from '../types/recipe'
import { useAppDispatch, useAppSelector } from '../hooks'
import EditIcon from '@mui/icons-material/Edit'
import { useState } from 'react'
import { notify } from '../reducers/notificationReducer'

const RecipePage = () => {
  const { recipeId } = useParams()
  const { data: result, loading } = useQuery(GET_RECIPE, { variables: { id: Number(recipeId) } })
  const recipe = result?.recipe as Recipe

  if (loading) {
    return (<div>Recipe loading...</div>)
  }

  if (!result) {
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
        <InteractionBar recipe={recipe} />
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

const InteractionBar = ({ recipe }: { recipe: Recipe }) => {
  const user = useAppSelector(state => state.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [deleteRecipe] = useMutation(DELETE_RECIPE)

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const open = Boolean(anchorEl)

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = async () => {
    handleDialogClose()
    try {
      await deleteRecipe({ variables: { id: recipe.id } })
      dispatch(notify({ severity: 'success', message: `Deleting recipe succeeded` }))
      navigate(`/`)
    }
    catch {
      dispatch(notify({ severity: 'error', message: `Deleting recipe failed: unknown error` }))
    }
  }

  const [dialogOpen, setDialogOpen] = useState<boolean>(false)

  const handleDialogOpen = () => {
    handleClose()
    setDialogOpen(true)
  }
  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  return (
    <Paper elevation={1} sx={{ padding: 2 }}>
      <Stack direction="row" spacing={4}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-evenly', flexGrow: 1, flexWrap: 'wrap' }}>
          <Typography variant="subtitle1">
            {`By: ${recipe.user.username}`}
          </Typography>
          {recipe.serving && (
            <Typography variant="subtitle1">
              {`Serving ${recipe.serving.per} ${recipe.serving.unit} for ${recipe.serving.amount}`}
            </Typography>
          )}
          {recipe.prepareTime && (
            <Typography variant="subtitle1">
              {`Prepare time: ${recipe.prepareTime} minutes`}
            </Typography>
          )}
        </Stack>
        {user && user.id === recipe.user.id && (
          <span>
            <IconButton color="primary" sx={{ justifySelf: 'right' }} onClick={handleOpen} aria-label="editButton">
              <EditIcon />
            </IconButton>
            <Menu
              open={open}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              onClose={handleClose}
            >
              <MenuItem onClick={handleDialogOpen}>Delete</MenuItem>
            </Menu>
          </span>
        )}
      </Stack>

      <Dialog closeAfterTransition={false} onClose={handleDialogClose} open={dialogOpen}>
        <DialogTitle>Delete Recipe</DialogTitle>
        <DialogContent>
          <Typography>
            {`Do you want to delete recipe "${recipe.name}"?`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete}>Yes</Button>
          <Button onClick={handleDialogClose}>No</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}

export default RecipePage
