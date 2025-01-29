const playerRoutes = require("./routes/players");
const teamRoutes = require("./routes/teams");

app.use("/players", playerRoutes);
app.use("/teams", teamRoutes);