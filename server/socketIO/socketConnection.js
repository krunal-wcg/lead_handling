const Leads = require("../models/leadsModel");

const userLeads = {}; // Keep track of leads opened by each user
const leads = {};

const socketConnect = async (io, socket) => {
  // Group orders by status within the last week
  const leadsResult = await Leads?.aggregate([
    {
      $group: {
        _id: "$_id",
      },
    },
  ]);

  // Iterate through the array and create an object with the desired format
  !Object.keys(leads)?.length &&
    leadsResult
      ?.map((e) => e?._id?.toString())
      ?.forEach((item) => {
        leads[item] = { user: null };
      });

  console.log(`A user connected ${socket?.id}`);

  socket.on("requestInitialData", async () => {
    // Respond with the current leads data when requested
    await socket.emit("initialData", leads);
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
    if (userLeads[userId] === leadId) {
      leads[leadId].user = null;
      userLeads[userId] = null;
      socket.emit("leadClosed", leadId);
      socket.broadcast.emit("updateLeads", leads);
    }
  });

  socket.on("sendAlertToUser", (targetUserId, leadId, senderId) => {
    //  targetUserId  AA ,leadId ,senderId BB  AA snend the alrer
    io.emit("receiveAlert", {
      targetUserId: targetUserId,
      leadId: leadId,
      senderId: senderId,
      title: "Lead Update",
      text: "A new update for the lead you have open!",
      icon: "info",
      confirmButtonText: "OK",
    });
  });
  socket.on("alertConfirmed", (targetUserId, leadId, senderId) => {
    //  targetUserId  AA ,leadId ,senderId BB  BB confirm alert and send response
    
    io.emit("confirmAlert", {
      confirmId: targetUserId,
      leadId: leadId,
      alertId: senderId,
      title: "Lead Update",
      text: "user close the lead want to open it ",
      icon: "info",
      confirmButtonText: "OK",
    });
  });
  socket.on("disconnect", () => {
    console.log(`A user disconnected ${socket?.id}`);
    const userId = Object.keys(userLeads).find(
      (key) => userLeads[key] === socket?.id
    );
    if (userId) {
      const leadId = userLeads[userId];
      leads[leadId].user = null;
      userLeads[userId] = null;
      socket.broadcast.emit("updateLeads", leads);
    }
  });
};
module.exports = socketConnect;
