const Leads = require("../models/leadsModel");
const Chart = require("../models/chartModel");

const userLeads = {}; // Keep track of leads opened by each user
const leads = {};
const leadTimers = {};
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
        leads[item] = { user: null ,username:null };
      });

  console.log(`A user connected ${socket?.id}`);

  socket.on("requestInitialData", async () => {
    // Respond with the current leads data when requested
    await socket.emit("initialData", leads);
  });

  socket.on("timeSpentData", async () => {
    let timeChange;
    // Respond with the current leads data when requested
    if (timeChange) {
      clearInterval(timeChange);
    }
    setInterval(async () => {
      var initialData = await Chart.find();
      socket.emit("timeRequest", initialData);
    }, 1000);
  });

  socket.on("openLead", (leadId, userId,username) => {
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
      leads[leadId].username=username;
      userLeads[userId] = leadId;
      socket.emit("leadOpened", { leadId, userId });
      socket.broadcast.emit("updateLeads", leads);

      // Store the opening time when the lead is opened
      leadTimers[leadId] = { start: Date.now(), timerId: null };

      // Start a timer for the lead
      leadTimers[leadId].timerId = setInterval(() => {
        io.emit("leadTimerUpdate", {
          leadId,
          elapsedTime: Date.now() - leadTimers[leadId].start,
        });
      }, 1000); // Update every 1000 milliseconds (1 second)
    }
  });

  socket.on("closeLead", async (leadId, userId) => {
    if (userLeads[userId] === leadId) {
      leads[leadId].user = null;
      leads[leadId].username = null;

      userLeads[userId] = null;
      await socket.emit("leadClosed", leadId);
      await socket.broadcast.emit("updateLeads", leads);

      // Stop the timer when the lead is closed
      if (leadTimers[leadId] && leadTimers[leadId].timerId) {
        clearInterval(leadTimers[leadId].timerId);
        leadTimers[leadId].timerId = null;
      }
      // Emit the total elapsed time when the lead is closed
      await io.emit("leadTimerClosed", {
        userId,
        leadId,
        elapsedTime: Date.now() - leadTimers[leadId].start,
      });

      // await io.emit("getChart");
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
      leads[leadId].username = null;
      userLeads[userId] = null;
      socket.broadcast.emit("updateLeads", leads);
    }
  });
};
module.exports = socketConnect;
