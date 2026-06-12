import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../services/helper";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Modal,
  TextField,
} from "@mui/material";

import Logo from "/Images/favi.png";

const pages = ["Environment", "About"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

const Navbar = ({ location, setLocation, setAirQualityData }) => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userData, setUserData] = useState({ name: "", email: "" });

  const { id } = useParams();

  useEffect(() => {
    // Check token on mount
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/"; // Redirect to login if no token
      return;
    }

    // Fetch user data with token
    const fetchUserData = async () => {
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
        window.location.href = "/"; // Redirect if error fetching user data
      }
    };
    fetchUserData();
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserData({ name: "", email: "" });
    window.location.href = "/"; // Redirect to login after logout
  };

  // Refactor: useCallback for the search request
  const handleSearchSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!location || location.length < 3) {
        alert("Please enter a valid city name.");
        return;
      }
      try {
        const response = await axios.get(`${BASE_URL}/air-quality`, {
          params: { city: location },
        });
        if (response.status === 200) {
          setAirQualityData(response.data);
          setSearchOpen(false); // close modal after successful fetch
        }
      } catch (error) {
        console.error("Error fetching air quality data:", error);
      }
    },
    [location, setAirQualityData] // Dependencies for useCallback
  );

  return (
    <>
      <AppBar position="static" sx={{ background: "linear-gradient(92deg, #09090b 6%, #131320 80%)", borderBottom: "1px solid #1b1f24" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Avatar alt="Logo" src={Logo} variant="rounded" sx={{ mr: 2 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/home"
              sx={{
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
                mr: 2,
              }}
            >
              Air Vision
            </Typography>

            <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
              {pages.map((page) => (
                <Button key={page} onClick={() => (window.location.href = `/${page.toLowerCase()}`)} sx={{ my: 2, mx: 2, color: "white", display: "block" }}>
                  {page}
                </Button>
              ))}
            </Box>

            {/* User Profile */}
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={(e) => setAnchorElUser(e.currentTarget)} sx={{ p: 0 }}>
                  <Avatar sx={{ backgroundColor: "#156abf" }}>{userData.name[0] || "U"}</Avatar>
                </IconButton>
              </Tooltip>
              <Menu sx={{ mt: "45px" }} anchorEl={anchorElUser} open={Boolean(anchorElUser)} onClose={() => setAnchorElUser(null)}>
                {settings.map((setting) => {
                  const path = `/${setting.toLowerCase()}`;
                  return (
                    <MenuItem
                      key={setting}
                      onClick={() => {
                        setAnchorElUser(null);
                        if (setting === "Logout") {
                          handleLogout();
                        } else {
                          window.location.href = path;
                        }
                      }}
                    >
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  );
                })}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Search City Modal */}
      <Modal open={searchOpen} onClose={() => setSearchOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: 300,
          }}
        >
          <Typography variant="h6" mb={2}>
            Enter City
          </Typography>
          <form onSubmit={handleSearchSubmit}>
            <TextField
              label="City"
              fullWidth
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" fullWidth type="submit">
              Search
            </Button>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default Navbar;
