import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../services/helper";
import axios from "axios";
import { Box, Typography, Grid } from "@mui/material";
import "../styles/home.css";
import Features from "../components/Feature";
import Typewriter from "typewriter-effect";

const Home = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/home/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setUserData(response.data.user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        window.location.href = "/";
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <>
    <div>
       <header className="home-header">
        {userData.name && <Navbar Avatar={userData.name} />}
      </header>
    </div>
    <div className="home-container">
     

      <main className="home-main">
        
        <Grid
          container
          spacing={4}
          alignItems="center"
          justifyContent="center"
          className="landing-section"
        >
          {/* Left Side - Text Section */}
          <Grid item xs={12} md={6}>
            <Box className="left-section">
              <Typography variant="h3" className="welcome-title" gutterBottom>
                Welcome, <span className="highlight">{userData.name}</span> 👋
              </Typography>

              <Typography variant="h5" className="sub-title" gutterBottom>
                <Typewriter
                  options={{
                    strings: [
                      "Empowering real-time air quality insights 🌍",
                      "Track. Breathe. Live healthier 🌱",
                      "Your environment, visualized intelligently 💨",
                    ],
                    autoStart: true,
                    loop: true,
                    delay: 50,
                  }}
                />
              </Typography>

              <Typography variant="body1" className="description" paragraph>
                AirVision is your intelligent air quality companion — visualizing
                pollution levels, predicting environmental risks, and helping you
                make informed decisions for a healthier tomorrow.
              </Typography>

              <Typography variant="body2" className="tagline">
                Breathe better. Live smarter.
              </Typography>
            </Box>
          </Grid>

          {/* Right Side - Image Section */}
          <Grid item xs={12} md={6}>
            <Box className="right-section">
              <img
                src="/Images/factory.jpg"
                alt="Air Quality Illustration"
                className="landing-image"
              />
            </Box>
          </Grid>
        </Grid>

        <Features />
      </main>

      <footer className="home-footer">
        <Footer />
      </footer>
    </div>
    </>
  );
};

export default Home;
