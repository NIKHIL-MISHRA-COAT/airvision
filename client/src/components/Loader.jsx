import React from "react"
import { Box, CircularProgress, Typography } from "@mui/material"
import { motion } from "framer-motion"

const Loader = ({ size = 50, color = "#3ea6ff", text = "Loading..." }) => {
  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%">
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <CircularProgress size={size} style={{ color: color }} />
      </motion.div>
      {/* <Typography variant="body2" style={{ marginTop: 16, color: color }}>
        {text}
      </Typography> */}
    </Box>
  )
}

export default Loader

