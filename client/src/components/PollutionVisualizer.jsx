import React, { useEffect, useState } from "react"
import { Box, Typography, Paper } from "@mui/material"
import { motion, AnimatePresence } from "framer-motion"

export default function PollutionVisualizer() {
  const [aqiLevel, setAqi] = useState(150)

  useEffect(() => {
    const storedAqi = localStorage.getItem("aqi");
    if (storedAqi) {
      setAqi(storedAqi);
    }
    else {
      setAqi(300)
    }
  }, [])

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return ["#00e400", "#00b400"]
    if (aqi <= 100) return ["#ffff00", "#d4d400"]
    if (aqi <= 150) return ["#ff7e00", "#d66700"]
    if (aqi <= 200) return ["#ff0000", "#d60000"]
    if (aqi <= 300) return ["#8f3f97", "#6f2f77"]
    return ["#7e0023", "#5e0013"]
  }

  const getAQIStatus = (aqi) => {
    if (aqi <= 50) return "Good"
    if (aqi <= 100) return "Moderate"
    if (aqi <= 150) return "Unhealthy for Sensitive Groups"
    if (aqi <= 200) return "Unhealthy"
    if (aqi <= 300) return "Very Unhealthy"
    return "Hazardous"
  }

  const [baseColor, glowColor] = getAQIColor(aqiLevel)

  return (
    <Box sx={{ height: "100%", position: "relative" }}>
      <Typography variant="h5" gutterBottom sx={{ color: "#fff", mb: 2, textAlign: "center" }}>
      Current AQI Level
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
          position: "relative",
        }}
      >
        {/* Background pulse effect */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
          }}
          style={{
            position: "absolute",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${glowColor} 0%, rgba(0,0,0,0) 70%)`,
          }}
        />

        {/* Main orb */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
          }}
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background: `radial-gradient(circle at 30% 30%, ${baseColor} 0%, ${glowColor} 100%)`,
            boxShadow: `0 0 30px ${glowColor}`,
            position: "relative",
            zIndex: 2,
          }}
        />

        {/* Floating particles */}
        <AnimatePresence>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 0,
                scale: 0,
                x: 0,
                y: 0,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: Math.sin(i * 60) * 50,
                y: Math.cos(i * 60) * 50,
              }}
              transition={{
                duration: 3,
                delay: i * 0.2,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 1,
              }}
              style={{
                position: "absolute",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: baseColor,
                filter: `blur(2px)`,
              }}
            />
          ))}
        </AnimatePresence>

        {/* AQI Information */}
        <Box
          sx={{
            mt: 4,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color: baseColor,
              textShadow: `0 0 10px ${glowColor}`,
              fontWeight: "bold",
            }}
          >
            {aqiLevel}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: baseColor,
              mt: 1,
            }}
          >
            {getAQIStatus(aqiLevel)}
          </Typography>
          
        </Box>
      </Box>
    </Box>
  )
}

