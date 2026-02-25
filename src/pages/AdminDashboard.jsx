import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  IconButton,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function AdminDashboard() {
  const [menu, setMenu] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
  });
  const [imageFile, setImageFile] = useState(null); // For file upload
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch menu items from backend
  const fetchMenu = async () => {
    try {
      const res = await axios.get(
        "https://hotelserver-q5lo.onrender.com/api/menu",
      );
      setMenu(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // Handle Add / Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("description", formData.description);
      if (imageFile) data.append("image", imageFile);

      if (editId) {
        await axios.put(
          `https://hotelserver-q5lo.onrender.com/api/menu/${editId}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
        setEditId(null);
      } else {
        await axios.post(
          "https://hotelserver-q5lo.onrender.com/api/menu",
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
      }

      setFormData({ name: "", price: "", description: "", category: "" });
      setImageFile(null);
      fetchMenu();
    } catch (err) {
      console.error(err);
      alert("Action failed. Check console.");
    }
  };

  // Prepare edit
  const startEdit = (item) => {
    setEditId(item._id);
    setFormData({
      name: item.name,
      price: item.price,
      description: item.description,
      category: item.category,
    });
    setImageFile(null); // Clear file input
  };

  // Delete menu
  const handleDelete = async (id) => {
    if (window.confirm("Delete this item?")) {
      try {
        await axios.delete(
          `https://hotelserver-q5lo.onrender.com/api/menu/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        fetchMenu();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>

      {/* Form */}
      <Paper sx={{ p: 3, mb: 4, backgroundColor: editId ? "#fff9c4" : "#fff" }}>
        <Typography variant="h6">
          {editId ? "Edit Item" : "Add New Item"}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}
        >
          <TextField
            size="small"
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <TextField
            size="small"
            label="Price"
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            required
          />
          <TextField
            size="small"
            label="Category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            required
          />
          <TextField
            size="small"
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />
          <TextField
            type="file"
            size="small"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          {imageFile && (
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Preview"
              style={{ width: 100, marginTop: 10, borderRadius: 5 }}
            />
          )}

          <Button
            variant="contained"
            type="submit"
            color={editId ? "secondary" : "primary"}
          >
            {editId ? "Update Item" : "Add Item"}
          </Button>
          {editId && (
            <Button
              variant="outlined"
              onClick={() => {
                setEditId(null);
                setFormData({
                  name: "",
                  price: "",
                  description: "",
                  category: "",
                });
                setImageFile(null);
              }}
            >
              Cancel
            </Button>
          )}
        </Box>
      </Paper>

      {/* Menu Table */}
      <Table component={Paper}>
        <TableBody>
          {menu.map((item) => (
            <TableRow key={item._id}>
              <TableCell>
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: 80, borderRadius: 5, marginRight: 10 }}
                  />
                )}
                <b>{item.name}</b>
              </TableCell>
              <TableCell>${item.price}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell sx={{ color: "gray" }}>{item.description}</TableCell>
              <TableCell align="right">
                <IconButton color="primary" onClick={() => startEdit(item)}>
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDelete(item._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}

export default AdminDashboard;
