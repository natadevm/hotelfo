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
import EditIcon from "@mui/icons-material/Edit"; // Import Edit Icon

function AdminDashboard() {
  const [menu, setMenu] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
  });
  const [editId, setEditId] = useState(null); // Track if we are editing

  const token = localStorage.getItem("token");

  const fetchMenu = async () => {
    const res = await axios.get("http://localhost:5000/api/menu");
    setMenu(res.data);
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // Handle Form Submission (Both Add and Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // UPDATE Logic
        await axios.put(`http://localhost:5000/api/menu/${editId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditId(null);
      } else {
        // ADD Logic
        await axios.post("http://localhost:5000/api/menu", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchMenu();
      setFormData({ name: "", price: "", description: "", category: "" });
    } catch (err) {
      alert("Action failed. Check console.");
    }
  };

  // Prepare form for editing
  const startEdit = (item) => {
    setEditId(item._id);
    setFormData({
      name: item.name,
      price: item.price,
      description: item.description,
      category: item.category,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this item?")) {
      await axios.delete(`http://localhost:5000/api/menu/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMenu();
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>

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
              }}
            >
              Cancel
            </Button>
          )}
        </Box>
      </Paper>

      <Table component={Paper}>
        <TableBody>
          {menu.map((item) => (
            <TableRow key={item._id}>
              <TableCell>
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
