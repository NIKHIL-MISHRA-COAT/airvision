import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

export default function PollutionVisualizer({ aqi }) {
  const [aqiLevel, setAqiLevel] = useState(50); // Default "Good"

  useEffect(() => {
    if (aqi !== undefined) {
      // Normalize AQI if needed, or use as-is
      setAqiLevel(aqi);
    }
  }, [aqi]);
    const normalizeAQI = (aqi) => (aqi / 5) * 500;

  const getAQIColor = (aqi) => {
    const nAQI  = normalizeAQI(aqi);
    if (nAQI <= 50) return ["#00e400", "#00b400"];
    if (nAQI <= 100) return ["#ffff00", "#d4d400"];
    if (nAQI <= 150) return ["#ff7e00", "#d66700"];
    if (nAQI <= 200) return ["#ff0000", "#d60000"];
    if (nAQI <= 300) return ["#8f3f97", "#6f2f77"];
    return ["#7e0023", "#5e0013"];
  };

  const getAQIStatus = (aqi) => {
    const nAQI  = normalizeAQI(aqi);
    if (nAQI <= 50) return "Good";
    if (nAQI <= 100) return "Moderate";
    if (nAQI <= 150) return "Unhealthy for Sensitive Groups";
    if (nAQI <= 200) return "Unhealthy";
    if (nAQI <= 300) return "Very Unhealthy";
    return "Hazardous";
  };

  const [baseColor, glowColor] = getAQIColor(aqiLevel);

  return (
    <Box sx={{ height: "100%", position: "relative" }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ color: "#fff", mb: 4, textAlign: "center" }}
      >
        Current Air Quality
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
          position: "relative",
        }}
      >
        {/* Background glow */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
          style={{
            position: "absolute",
            width: "220px",
            height: "220px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${glowColor} 0%, rgba(0,0,0,0) 70%)`,
          }}
        />

        {/* Main orb */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
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
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: Math.sin((i * 60 * Math.PI) / 180) * 50,
                y: Math.cos((i * 60 * Math.PI) / 180) * 50,
              }}
              transition={{
                duration: 3,
                delay: i * 0.2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
              style={{
                position: "absolute",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: baseColor,
                filter: "blur(2px)",
              }}
            />
          ))}
        </AnimatePresence>

        {/* AQI Info */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography
            variant="h2"
            sx={{ color: baseColor, textShadow: `0 0 10px ${glowColor}`, fontWeight: "bold" }}
          >
            {aqiLevel.toFixed(2)}
          </Typography>
          <Typography variant="h6" sx={{ color: baseColor, mt: 1 }}>
            {getAQIStatus(aqiLevel)}
          </Typography>
          <Typography variant="body2" sx={{ color: "#fff", opacity: 0.8, mt: 2 }}>
            Current AQI Level
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
