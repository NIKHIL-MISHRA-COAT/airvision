// import React from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent } from '@mui/material';
import "../styles/home.css";
// import realTime from "/Images/realtic:\Users\JAY RANE\Downloads\11669328_20945911.jpgme.jpg"
const featuresList = [
  {
    title: 'Real-time Air Quality',
    desc: 'Access up-to-the-minute air pollution data across multiple cities worldwide.',
    img: '/Images/realtime.jpg',
  },
  {
    title: 'Interactive Maps',
    desc: 'Explore environmental data visually with dynamic, user-friendly map tools.',
    img: '/Images/inter.jpg',
  },
  {
    title: 'Pollution Trends',
    desc: 'Analyze historic and current pollution trends with detailed charts and reports.',
    img: '/Images/poll.jpg',
  },
  {
    title: 'Multi-Layer Data',
    desc: 'Switch between heatmaps, wind flow, UV index, and more with easy toggles.',
    img: '/Images/multi.jpg',
  },
  {
    title: 'Personalized Alerts',
    desc: 'Receive notifications based on your favorite locations and air quality thresholds.',
    img: '/Images/alert.jpg',
  },
  {
    title: 'User-Friendly Design',
    desc: 'Built with clean interfaces and intuitive controls for easy navigation.',
    img:   '/Images/user.jpg',
  },
];

export default function Features() {
  return (
    <Box  className="features-section"sx={{ py: 6, bgcolor: '#f4f6f8' }}>
      <Typography variant="h4" align="center" sx={{ mb: 5, fontWeight: 'bold', color: '#1976d2' }}>
        Key Features of AirVision
      </Typography>
      <Grid container spacing={4} justifyContent="center" sx={{ px: { xs: 2, md: 8 } }}>
        {featuresList.map(({ title, desc, img }, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                width: 500,
                height: 550,
                boxShadow:"10px 0px 10px  rgba(31, 63, 83, 0.1)",
                mx: 'auto', 
                transition: 'transform 0.3s ease, box-shadow 0.3s ease', 
                '&:hover': { 
                  transform: 'translateY(-8px)', 
                  boxShadow: 10,
                } 
              }}
              elevation={3}
            >
              <CardMedia
                component="img"
                height="76%"
                image={img}
                alt={title}
                loading="lazy"
              />
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: '600' }}>
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                  {desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
