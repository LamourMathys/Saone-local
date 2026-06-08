require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
const productRoutes = require("./routes/productsroute");
const producersRoutes = require("./routes/producersroute");
const eventsRoutes = require("./routes/eventsroute");
const categoriesRoutes = require("./routes/categoriesroute");
const usersRoutes = require("./routes/usersroute")
const ordersRoutes = require("./routes/ordersroute")

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "Serveur opérationnel" });
});

app.use("/api/products", productRoutes);
app.use("/api/producers", producersRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/users", usersRoutes)
app.use("/api/orders", ordersRoutes)

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
