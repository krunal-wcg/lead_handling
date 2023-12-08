const express = require("express");
const http = require("http");
const connectDb = require("./config/dbConnection");
const allowCrossDomain = require("./middleware/nocorsHandler");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

connectDb();
app.use(express.json());
app.use(allowCrossDomain);
app.use("/api/leads", require("./routes/leadsRoutes"));
app.use("/api/users", require("./routes/usersRoutes"));

const leads = {
  "c5a38f4e-97be-4bb9-a0bf-172cc4856e01": {user: null},
  "e5c0f002-51a1-4d06-b0b9-64f11d2f08b8": {user: null},
  "35f6f7bb-997f-4d8d-b77b-942a2a7fc555": {user: null},
  "b994b13e-64a4-4d90-9b96-83b7ed42d8e9": {user: null},
  "f031a9c7-13f8-484d-944d-b232212e693d": {user: null},
  "0a246e9c-7e96-459f-b33e-576c4fb5c738": {user: null},
  "39f1c0c4-3d24-4ea5-8fb7-b2a1c4382cfe": {user: null},
  "b4d20c0b-2ff2-4688-bd54-ee03c308a12a": {user: null},
  "03ef1e9e-ff70-442b-9ab3-95a16c7e888f": {user: null},
  "dd98f95b-7ad4-4e16-8b25-28cdeca0db9f": {user: null},
};


const userLeads = {}; // Keep track of leads opened by each user
let userId = {};

io.on("connection", (socket) => {
  console.log(`A user connected ${socket.id}`);

  socket.on("requestInitialData", () => {
    // Respond with the current leads data when requested
    socket.emit("initialData", leads);
  });

  socket.on("openLead", (leadId, userId) => {
    if (!leads[leadId]) {
      socket.emit("invalidLead", `Lead ${leadId} does not exist.`);
    } else if (leads[leadId].user) {
      socket.emit(
        "leadAlreadyOpened",
        `Lead ${leadId} is already opened by ${leads[leadId].user}.`
      );
    } else if (userLeads[userId]) {
      socket.emit(
        "userAlreadyHasLead",
        `You already have an open lead. Close it before opening a new one.`
      );
    } else {
      leads[leadId].user = userId;
      userLeads[userId] = leadId;
      socket.emit("leadOpened", { leadId, userId });
      socket.broadcast.emit("updateLeads", leads);
    }
  });

  socket.on("closeLead", (leadId, userId) => {
    console.log(leadId, userId);
    if (userLeads[userId] === leadId) {
      leads[leadId].user = null;
      userLeads[userId] = null;
      socket.emit("leadClosed", leadId);
      socket.broadcast.emit("updateLeads", leads);
    }
  });

  socket.on("sendAlertToUser", (userId) => {
    // Send an alert to the specified user
    console.log("send ", userId, userLeads);
    io.emit("receiveAlert", {
      userId: userId,
      title: "Lead Update",
      text: "A new update for the lead you have open!",
      icon: "info",
      confirmButtonText: "OK",
    });
  });
  socket.on("disconnect", () => {
    console.log(`A user disconnected ${socket.id}`);
    const userId = Object.keys(userLeads).find(
      (key) => userLeads[key] === socket.id
    );
    console.log(userId);
    if (userId) {
      const leadId = userLeads[userId];
      leads[leadId].user = null;
      userLeads[userId] = null;
      socket.broadcast.emit("updateLeads", leads);
    }
  });
});

const PORT = process.env.PORT || 3001;

app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
