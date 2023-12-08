
const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});


const leads = {
  "36f83f82-8f9b-4b07-8207-73c3a3a48a31": {user: null},
  "b823c0f0-88d8-4b6b-93e7-2e051b5c8856": {user: null},
  "c5ee05c0-4fe5-4a27-9a53-7db5d2a3a611": {user: null},
  "cd8462e2-13d2-4b69-b3f0-0bcce9d44bfa": {user: null},
  "f7912e9f-73c7-4e94-87f1-08a5a46e3e49": {user: null},
  "d137f9fe-96b1-48f9-8b1d-20b723d136bc": {user: null},
  "5da652d2-ef57-4e4b-95d2-4d315e731ff3": {user: null},
  "d751f33b-6ac8-4cfb-a537-78b5b7ec0d1c": {user: null},
  "21a46d5a-8d5a-474d-8757-9e888a20e1f0": {user: null},
  "99579fc3-7921-4b21-8220-8e1e7c929f91": {user: null},
};

const userLeads = {}; // Keep track of leads opened by each user
  let userId={};


io.on("connection", (socket) => {
  console.log(`A user connected ${socket.id}`);

  socket.on('requestInitialData', () => {
    // Respond with the current leads data when requested
    socket.emit('initialData', leads);
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
    console.log("send " ,userId ,userLeads);
    io.emit("receiveAlert", {
      userId:userId,
      title: "Lead Update",
      text: "A new update for the lead you have open!",
      icon: "info",
      confirmButtonText: "OK",
    });
  });
  socket.on("disconnect", () => {
    console.log(`A user disconnected ${socket.id}` );
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

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
