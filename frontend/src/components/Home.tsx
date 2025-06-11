import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { GET_RECIPES } from '../graphql/queries/recipeQueries'
import { Box, IconButton, InputAdornment, Pagination, TextField, Typography } from '@mui/material'
import { RecipeListItem } from '../types/recipe'
import SearchIcon from '@mui/icons-material/Search'
import RecipeList from './RecipeList'

const Home = () => {
  const [page, setPage] = useState<number>(0)
  const [search, setSearch] = useState<string>('')
  const { data: result, loading, refetch } = useQuery(GET_RECIPES, { variables: { page } })
  const recipes = result?.recipes.rows as RecipeListItem[]
  const count = result?.recipes.count as number
  const perPage = 12 // hardcoded in backend

  useEffect(() => {
    refetch()
  }, [])

  const handleSearch = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    refetch({ page, search })
  }

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value - 1)
  }

  let recipeList

  if (loading) {
    recipeList = (
      <div>
        <br />
        Loading recipes...
      </div>
    )
  }
  else if (!result || count === 0) {
    recipeList = (
      <div>
        <br />
        No recipes found
      </div>
    )
  }
  else {
    recipeList = <RecipeList recipes={recipes} />
  }

  return (
    <>
      <form onSubmit={handleSearch}>
        <TextField
          label="search"
          type="search"
          fullWidth
          value={search}
          onChange={event => setSearch(event.target.value)}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton type="submit">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </form>
      {count > 0 && <Typography variant="subtitle1" style={{ padding: 14 }}>{`${count} recipes`}</Typography>}
      {recipeList}
      <br />
      {count > 0 && (
        <Box sx={{ justifyContent: 'center', display: 'flex' }}>
          <Pagination count={Math.ceil(count / perPage)} onChange={handlePageChange} />
        </Box>
      )}
    </>
  )
}

export default Home
