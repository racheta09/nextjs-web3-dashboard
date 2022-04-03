import { CircularProgress, Grid, Paper, Typography } from "@mui/material"
import React from "react"

const Datagrid = ({ title, value }) => {
  return (
    <Grid item xs={12} sm={6} md={4} lg={3} alignItems="center">
      <Paper
        elevation={24}
        alignItems="center"
        sx={{
          padding: "1rem",
          margin: "1rem",
          borderRadius: "0.5rem",
          backgroundColor: "rgba(0,0,0,0.1)",
          textAlign: "center",
          color: "white",
          fontSize: "1.5rem",
          fontWeight: "bold",
          letterSpacing: "0.1rem",
          border: "1px solid rgba(0,0,0,0.1)",
          boxShadow: "0px 0px 10px rgba(238,45,15,0.1)",
          "&:hover": {
            backgroundColor: "rgba(238,45,15,0.2)",
            cursor: "pointer",
            border: "1px solid rgba(238,45,15,0.2)",
            boxShadow: "0px 0px 10px rgba(238,45,15,0.2)",
          },
        }}
      >
        <Typography variant="subtitle1">{title}</Typography>
        { value ? <Typography variant="h6">{value}</Typography> : <CircularProgress color="inherit" size={20}/> }
      </Paper>
    </Grid>
  )
}

export default Datagrid
