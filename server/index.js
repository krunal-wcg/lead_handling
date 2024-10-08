const express = require("express");
const http = require("http");
const cors = require("cors");
const connectDb = require("./config/dbConnection");
const allowCrossDomain = require("./middleware/nocorsHandler");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv");
const socketConnect = require("./socketIO/socketConnection");

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const asyncFN = async () => {
  await connectDb();
  await io.on("connection", async (socket) => {
    await socketConnect(io, socket);
  });
};

asyncFN();

app.use(cors());
app.use(express.json());
app.use(allowCrossDomain);
app.get("/", function (req, res) {
  res.status(200).json({ title: "WCG Lead Handling!" }); // Sending the access token as a JSON response
});
app.use("/api/leads", require("./routes/leadsRoutes"));
app.use("/api/users", require("./routes/usersRoutes"));

const PORT = process.env.PORT || 3001;

app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server is 🏃🏃🏃 on PORT :  ${PORT} `);
});
