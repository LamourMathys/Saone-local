require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const productRoutes = require("./routes/productsroute");
const authsRoutes = require("./routes/authsroute");
const producersRoutes = require("./routes/producersroute");
const eventsRoutes = require("./routes/eventsroute");
const categoriesRoutes = require("./routes/categoriesroute");
const usersRoutes = require("./routes/usersroute");
const ordersRoutes = require("./routes/ordersroute");
const orderitemsRoutes = require("./routes/orderitemsroute");
const favoritesRoutes = require("./routes/favoritesroute");
const eventparticipantsRoutes = require("./routes/eventparticipantsroute");
const refreshRoutes = require("./routes/refresh");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "Serveur opérationnel" });
});

app.use("/api/products", productRoutes);
app.use("/api/auth", authsRoutes);
app.use("/api/refresh", refreshRoutes);
app.use("/api/producers", producersRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/orderitems", orderitemsRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/eventparticipants", eventparticipantsRoutes);

app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
