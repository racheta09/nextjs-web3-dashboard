import { Box, FormControlLabel, Switch } from '@mui/material'
import React, { useState } from 'react'

const ThemeSwitch = () => {
    const [light, setLight] = useState(0)
  return (
      <Box>
          <FormControlLabel label="Light Mode" control={<Switch checked={light} onChange={(event) => setLight(event.target.checked)} />} />
    </Box>
  )
}

export default ThemeSwitch