import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Chip,
  Divider,
  Skeleton,
  Stack,
  Tabs,
  Tab,
} from "@mui/material";

function Home() {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");

  // URL for the restaurant image
  const restaurantImageUrl =
    "https://images.pexels.com/photos/262918/pexels-photo-262918.jpeg";

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/menu")
      .then((res) => {
        setMenuItems(res.data);
        setFilteredItems(res.data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleCategoryChange = (event, newValue) => {
    setCategory(newValue);
    if (newValue === "All") {
      setFilteredItems(menuItems);
    } else {
      setFilteredItems(menuItems.filter((item) => item.category === newValue));
    }
  };

  const categories = [
    "All",
    ...new Set(menuItems.map((item) => item.category)),
  ];

  return (
    <Box>
      {/* --- HERO SECTION --- */}
      <Box
        sx={{
          height: { xs: "250px", md: "400px" },
          width: "100%",
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${restaurantImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          textAlign: "center",
          px: 2,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 900,
            fontSize: { xs: "2.5rem", md: "4rem" },
            textShadow: "2px 2px 10px rgba(0,0,0,0.5)",
          }}
        >
          THE FLAVOR HUB
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 300 }}>
          Experience culinary excellence in every bite
        </Typography>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            mb: 4,
            borderBottom: 1,
            borderColor: "divider",
            position: "sticky",
            top: 0,
            bgcolor: "white",
            zIndex: 10,
          }}
        >
          <Tabs
            value={category}
            onChange={handleCategoryChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ py: 1 }}
          >
            {categories.map((cat) => (
              <Tab key={cat} label={cat} value={cat} sx={{ fontWeight: 700 }} />
            ))}
          </Tabs>
        </Box>

        {/* --- MENU GRID --- */}
        <Grid container spacing={3}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Skeleton variant="rounded" height={150} />
                </Grid>
              ))
            : filteredItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item._id}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      transition: "0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: 4,
                      },
                    }}
                  >
                    <CardContent>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="h6" fontWeight={800}>
                          {item.name}
                        </Typography>
                        <Typography fontWeight={900} color="primary">
                          ${item.price}
                        </Typography>
                      </Stack>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ my: 1, minHeight: "40px" }}
                      >
                        {item.description}
                      </Typography>
                      <Chip
                        label={item.category}
                        size="small"
                        variant="outlined"
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default Home;
