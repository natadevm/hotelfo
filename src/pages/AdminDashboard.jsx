import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Divider,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SearchIcon from "@mui/icons-material/Search";

function AdminDashboard() {
  const [menu, setMenu] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");
  const API_BASE = "https://hotelserver-q5lo.onrender.com/api/menu";

  const fetchMenu = async () => {
    try {
      const res = await axios.get(API_BASE);
      setMenu(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // Image Preview Logic
  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (imageFile) data.append("image", imageFile);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      if (editId) {
        await axios.put(`${API_BASE}/${editId}`, data, config);
        setEditId(null);
      } else {
        await axios.post(API_BASE, data, config);
      }

      resetForm();
      fetchMenu();
    } catch (err) {
      alert("Action failed. Check console.");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", price: "", description: "", category: "" });
    setImageFile(null);
    setEditId(null);
  };

  const startEdit = (item) => {
    setEditId(item._id);
    setFormData({
      name: item.name,
      price: item.price,
      description: item.description,
      category: item.category,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this item permanently?")) {
      try {
        await axios.delete(`${API_BASE}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchMenu();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Filter Logic
  const categories = ["All", ...new Set(menu.map((item) => item.category))];
  const filteredMenu = menu.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography variant="h3" fontWeight="800" color="primary" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your restaurant menu items and pricing
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* LEFT SIDE: FORM */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={4}
            sx={{ p: 3, borderRadius: 3, position: "sticky", top: 24 }}
          >
            <Typography variant="h6" fontWeight="700" gutterBottom>
              {editId ? "Edit Menu Item" : "Add New Product"}
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
            >
              <TextField
                fullWidth
                label="Product Name"
                variant="outlined"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <TextField
                fullWidth
                label="Price"
                type="number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
              <TextField
                fullWidth
                label="Category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
              />
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />

              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                sx={{ borderStyle: "dashed", py: 1.5 }}
              >
                {imageFile ? "Change Image" : "Upload Image"}
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
              </Button>

              {previewUrl && (
                <Box sx={{ position: "relative" }}>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{
                      width: "100%",
                      borderRadius: 12,
                      height: 160,
                      objectFit: "cover",
                    }}
                  />
                </Box>
              )}

              <Button
                fullWidth
                variant="contained"
                type="submit"
                size="large"
                sx={{ py: 1.5, fontWeight: "bold" }}
              >
                {editId ? "Update Item" : "Save Item"}
              </Button>
              {editId && (
                <Button
                  fullWidth
                  variant="text"
                  color="inherit"
                  onClick={resetForm}
                >
                  Cancel Editing
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* RIGHT SIDE: LIST & FILTERS */}
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              placeholder="Search dishes..."
              size="small"
              sx={{ flexGrow: 1, bgcolor: "white" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              select
              size="small"
              label="Category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              sx={{ minWidth: 120, bgcolor: "white" }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Grid container spacing={2}>
            {filteredMenu.map((item) => (
              <Grid item xs={12} sm={6} key={item._id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    transition: "0.3s",
                    "&:hover": { boxShadow: 6 },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      p: 2,
                      alignItems: "flex-start",
                      gap: 2,
                    }}
                  >
                    <Avatar
                      variant="rounded"
                      src={item.image}
                      sx={{ width: 80, height: 80, boxShadow: 1 }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="body2"
                        color="primary"
                        fontWeight="bold"
                        sx={{ textTransform: "uppercase", fontSize: 10 }}
                      >
                        {item.category}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontSize: "1.1rem", lineHeight: 1.2, my: 0.5 }}
                      >
                        {item.name}
                      </Typography>
                      <Typography variant="subtitle1" fontWeight="800">
                        ${item.price}
                      </Typography>
                    </Box>
                  </Box>
                  <CardContent sx={{ pt: 0 }}>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {item.description}
                    </Typography>
                  </CardContent>
                  <Divider light />
                  <CardActions sx={{ justifyContent: "flex-end", px: 2 }}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => startEdit(item)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(item._id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {filteredMenu.length === 0 && (
            <Typography
              align="center"
              sx={{ mt: 4, py: 8, bgcolor: "#f5f5f5", borderRadius: 4 }}
            >
              No items found. Try a different search!
            </Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default AdminDashboard;
