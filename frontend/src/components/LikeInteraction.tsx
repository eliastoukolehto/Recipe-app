import { Grid2 as Grid, IconButton, Tooltip, Typography, Zoom } from '@mui/material'
import { Recipe, RecipeListItem } from '../types/recipe'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { useMutation } from '@apollo/client'
import { ADD_RECIPE_LIKE, REMOVE_RECIPE_LIKE } from '../graphql/queries/recipeQueries'
import { useEffect, useState } from 'react'
import { useAppSelector } from '../hooks'

const LikeInteraction = ({ recipe, showlikes }: { recipe: Recipe | RecipeListItem, showlikes: boolean }) => {
  const user = useAppSelector(state => state.user)
  const [likes, setLikes] = useState<number>(recipe.totalLikes)
  const [likedByUser, setLikedByUser] = useState<boolean>(recipe.likedByCurrentUser)
  const [tooltipTitle, setTooltipTitle] = useState<string>('')
  const [tooltipOpen, setTooltpOpen] = useState<boolean>(false)
  const [addRecipeLike] = useMutation(ADD_RECIPE_LIKE)
  const [removeRecipeLike] = useMutation(REMOVE_RECIPE_LIKE)

  useEffect(() => {
    setLikedByUser(recipe.likedByCurrentUser)
    setLikes(recipe.totalLikes)
  }, [recipe])

  const handleAddLike = async () => {
    if (!user) {
      setTooltipTitle('Login to add Likes!')
      setTooltpOpen(true)
      setTimeout(() => {
        setTooltpOpen(false)
      }, 5000)
    }
    else {
      await addRecipeLike({ variables: { id: recipe.id } })
      setLikes(likes + 1)
      setLikedByUser(true)
      setTooltipTitle('Recipe Liked!')
      setTooltpOpen(true)
      setTimeout(() => {
        setTooltpOpen(false)
      }, 5000)
    }
  }

  const handleRemoveLike = async () => {
    await removeRecipeLike({ variables: { id: recipe.id } })
    setLikes(likes - 1)
    setLikedByUser(false)
  }

  return (
    <>
      <Tooltip
        title={tooltipTitle}
        open={tooltipOpen}
        disableHoverListener
        disableFocusListener
        disableTouchListener
        slots={{ transition: Zoom }}
        placement="top"
        arrow
      >
        <Grid>
          {likedByUser && (
            <IconButton onClick={handleRemoveLike} color="primary">
              <FavoriteIcon />
            </IconButton>
          )}
          {!likedByUser && (
            <IconButton onClick={handleAddLike} color="primary">
              <FavoriteBorderIcon />
            </IconButton>
          )}
        </Grid>
      </Tooltip>
      {showlikes && (
        <Grid>
          <Typography>{likes}</Typography>
        </Grid>
      )}
    </>
  )
}

export default LikeInteraction
