import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Avatar,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://hotelserver-q5lo.onrender.com/api/auth/login",
        formData,
      );
      localStorage.setItem("token", res.data.token);
      alert("Login Success!");
      navigate("/admin");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            backgroundColor: "white",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Avatar
              sx={{
                bgcolor: "#4facfe",
                width: 56,
                height: 56,
                margin: "0 auto",
              }}
            >
              <LockOutlinedIcon />
            </Avatar>
            <Typography variant="h5" mt={1}>
              Admin Login
            </Typography>
          </Box>
          <Box component="form" onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Username"
              margin="normal"
              variant="outlined"
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              variant="outlined"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: 2,
                backgroundColor: "#4facfe",
                "&:hover": { backgroundColor: "#00f2fe" },
              }}
            >
              Login
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;
