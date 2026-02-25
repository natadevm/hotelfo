import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Box,
  Chip,
  Tabs,
  Tab,
  Skeleton,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button as MuiButton,
} from "@mui/material";

const COLORS = {
  bg: "#fafaf9",
  primary: "#1e293b",
  accent: "#f59e0b",
  textSecondary: "#64748b",
};

function Home() {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const restaurantImageUrl =
    "https://images.pexels.com/photos/262918/pexels-photo-262918.jpeg";

  useEffect(() => {
    axios
      .get("https://hotelserver-q5lo.onrender.com/api/menu")
      .then((res) => {
        setMenuItems(res.data);
        setFilteredItems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleCategoryChange = (event, newValue) => {
    setCategory(newValue);
    if (newValue === "All") {
      setFilteredItems(menuItems);
    } else {
      setFilteredItems(menuItems.filter((item) => item.category === newValue));
    }
  };

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setOpenModal(false);
  };

  const categories = [
    "All",
    ...new Set(menuItems.map((item) => item.category)),
  ];

  return (
    <Box sx={{ bgcolor: COLORS.bg, minHeight: "100vh", pb: 10 }}>
      {/* HERO SECTION */}
      <Box
        sx={{
          height: { xs: "50vh", md: "60vh" },
          position: "relative",
          backgroundImage: `url(${restaurantImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(15,23,42,0.9), rgba(15,23,42,0.3))",
          },
        }}
      >
        <Box
          sx={{ position: "relative", zIndex: 1, textAlign: "center", px: 2 }}
        >
          <Typography
            variant="overline"
            sx={{ color: COLORS.accent, fontWeight: 700, letterSpacing: 4 }}
          >
            ESTABLISHED 2024
          </Typography>

          <Typography
            variant="h1"
            sx={{
              color: "#fff",
              fontWeight: 900,
              fontSize: { xs: "2rem", md: "4rem" },
              mb: 1,
            }}
          >
            THE FLAVOR HUB
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "rgba(255,255,255,0.8)",
              fontWeight: 300,
              fontStyle: "italic",
            }}
          >
            Experience culinary excellence in every bite
          </Typography>
        </Box>
      </Box>

      {/* FILTER BAR */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          backdropFilter: "blur(10px)",
          bgcolor: "rgba(255,255,255,0.9)",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
          mb: 4,
        }}
      >
        <Container>
          <Tabs
            value={category}
            onChange={handleCategoryChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              "& .MuiTabs-indicator": { bgcolor: COLORS.accent, height: 3 },
              "& .MuiTab-root": {
                py: 2,
                fontWeight: 600,
                color: COLORS.textSecondary,
                "&.Mui-selected": { color: COLORS.primary },
              },
            }}
          >
            {categories.map((cat) => (
              <Tab key={cat} label={cat} value={cat} />
            ))}
          </Tabs>
        </Container>
      </Box>

      {/* MENU GRID */}
      <Container>
        <Grid container spacing={3}>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  key={i}
                  sx={{ display: "flex" }}
                >
                  <Skeleton
                    variant="rounded"
                    sx={{ borderRadius: 4, width: "100%", height: 320 }}
                  />
                </Grid>
              ))
            : filteredItems.map((item) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  key={item._id}
                  sx={{ display: "flex" }}
                >
                  <Fade in timeout={500}>
                    <Card
                      elevation={0}
                      sx={{
                        borderRadius: 4,
                        bgcolor: "#fff",
                        display: "flex",
                        flexDirection: "column",
                        border: "1px solid rgba(0,0,0,0.05)",
                        width: "100%",
                        flexGrow: 1,
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-6px)",
                          boxShadow: "0 15px 30px rgba(0,0,0,0.08)",
                          "& .card-image": { transform: "scale(1.05)" },
                        },
                      }}
                    >
                      {/* IMAGE */}
                      <Box
                        sx={{
                          width: "100%",
                          aspectRatio: "1 / 1",
                          overflow: "hidden",
                        }}
                      >
                        <CardMedia
                          className="card-image"
                          component="img"
                          image={item.image}
                          alt={item.name}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.6s ease",
                          }}
                        />
                      </Box>

                      {/* CONTENT */}
                      <CardContent
                        sx={{
                          p: 2,
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 700, fontSize: "0.95rem" }}
                          >
                            {item.name}
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            sx={{ color: COLORS.accent, fontWeight: 700 }}
                          >
                            {item.price} Br
                          </Typography>
                        </Box>

                        {/* TRUNCATED DESCRIPTION */}
                        <Typography
                          variant="body2"
                          sx={{
                            color: COLORS.textSecondary,
                            mb: 2,
                            fontSize: "0.85rem",
                          }}
                        >
                          {item.description.split(" ").slice(0, 7).join(" ")}
                          {item.description.split(" ").length > 7 ? "..." : ""}
                        </Typography>

                        <Box sx={{ mt: "auto" }}>
                          <Chip
                            label="View Details"
                            size="small"
                            clickable
                            onClick={() => handleOpenModal(item)}
                            sx={{
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              "&:hover": {
                                bgcolor: COLORS.primary,
                                color: "#fff",
                              },
                            }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              ))}
        </Grid>
      </Container>

      {/* MODAL FOR DETAILS */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{selectedItem?.name}</DialogTitle>
        <DialogContent>
          <Box
            component="img"
            src={selectedItem?.image}
            alt={selectedItem?.name}
            sx={{ width: "100%", borderRadius: 2, mb: 2 }}
          />
          <DialogContentText sx={{ mb: 2 }}>
            {selectedItem?.description}
          </DialogContentText>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color: COLORS.accent }}
          >
            Price: {selectedItem?.price} Br
          </Typography>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleCloseModal}>Close</MuiButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Home;
