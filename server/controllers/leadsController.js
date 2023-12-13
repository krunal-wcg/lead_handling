const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const Leads = require("../models/leadsModel");
const Chart = require("../models/chartModel");
const User = require("../models/userModel");

/**
 * @desc Create Lead
 * @route POST /api/leads/create
 * @access public
 */
const createLead = asyncHandler(async (req, res) => {
  const { name, email, role, city, country, phone } = req.body;

  if (!name || !email || !role || !city || !country || !phone) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  const leadAvailable = await Leads.findOne({ email });

  if (leadAvailable) {
    res.status(400);
    throw new Error("lead already available!");
  }

  const lead = await Leads.create({ name, email, role, city, country, phone });
  const chart = await Chart.create({
    leadId: lead?._id,
    leadName: name,
    lead: [],
  });

  if (lead) {
    res.status(201).json({
      message: "Lead generated successfully ✅",
      lead,
    });
  } else {
    res.status(400);
    throw new Error("Lead data is not valid");
  }
  res.json({ message: "Lead generated successfully ✅" });
});

/**
 * @desc get all Leads
 * @route GET /api/leads
 * @access private
 **/
const leads = asyncHandler(async (req, res) => {
  const leads = await Leads.find();
  res.status(200).json({ leads: leads }); // Sending the access token as a JSON response
});

/**
 * @desc get Lead
 * @route GET /api/leads/:id
 * @access private
 **/
const getLead = asyncHandler(async (req, res) => {
  // Finding a Lead by its ID
  const lead = await Leads.findById(req.params.id);
  if (lead) {
    res.status(201).json({
      message: "Lead fetched successfully ✅",
      data: lead,
    });
  } else {
    res.status(400);
    throw new Error("Lead not found");
  }
});

/**
 * @desc Update Lead
 * @route PUT /api/leads/:id
 * @access private
 **/
const updateLead = asyncHandler(async (req, res) => {
  const lead = await Leads.findById(req.params.id);
  if (!lead) {
    res.status(404);
    throw new Error("Lead not Found");
  }

  const updatedLead = await Leads.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true } // Returning the updated lead after the update
  );
  res.status(200).json(updatedLead); // Sending the access token as a JSON response
});

/**
 * @desc Delete lead by ID
 * @route DELETE /api/leads/:id
 * @access private (Requires authentication)
 **/
const deleteLead = asyncHandler(async (req, res) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  // Delete a lead by its ID
  const lead = await Leads.findById(req.params.id);
  if (!lead) {
    res.status(404); // Responding with a 404 status if the lead is not found
    throw new Error("Lead not Found");
  }

  // Checking if the logged-in lead has permission to delete the lead
  if (!jwt.decode(token).user.role) {
    res.status(403); // Responding with a 403 status if permission is denied
    throw new Error("User Don't have permission to delete Lead");
  }

  // Deleting the lead and sending the deleted lead as a response
  await Leads.deleteOne({ _id: req.params.id });
  res.status(200).json(lead); // Sending the deleted lead as a JSON response
});

/**
 * @desc Get all Chart data
 * @route GET /api/leads/chart
 * @access private
 **/
const getAllChartData = asyncHandler(async (req, res) => {
  const chartData = await Chart.find();
  res.status(200).json({ data: chartData });
});

/**
 * @desc Create Chart Data
 * @route POST /api/leads/chart
 * @access public
 */
const createChartData = asyncHandler(async (req, res) => {
  const { leadId, userId, totalSpentTime } = req.body;

  const leadAvailable = await Leads.findById(leadId);
  const userAvailable = await User.findById(userId);
  const chartAvailable = await Chart.findOne({ leadId: leadId });

  console.log(chartAvailable);
  if (chartAvailable) {
    res.status(400).json({
      message: "Data already available",
    });
    throw new Error("Lead already available!");
  }

  if (!leadAvailable) {
    res.status(400);
    throw new Error("lead not available!");
  }

  const chart = await Chart.create({
    leadId: leadId,
    leadName: leadAvailable?.name,
    lead: [
      {
        userId: userAvailable?._id,
        userName: userAvailable?.username,
        totalSpentTime: totalSpentTime,
      },
    ],
  });

  if (chart) {
    res.status(201).json({
      message: "Data created successfully ✅",
      chart,
    });
  } else {
    res.status(400);
    throw new Error("Lead data is not valid");
  }
});

/**
 * @desc Create Chart Data
 * @route POST /api/leads/chart
 * @access public
 */
const updateChartData = asyncHandler(async (req, res) => {
  const { userId, totalSpentTime } = req.body;
  var leadId = req.params.leadId;

  const leadAvailable = await Leads.findById(leadId);
  const userAvailable = await User.findById(userId);
  const chartAvailable = await Chart.findOne({ leadId: leadId });
  const userExists = await Chart.find(
    { "lead.userId": userId, leadId: leadId },
    { _id: 0, lead: { $elemMatch: { userId: userId } } }
  );

  if (!leadAvailable) {
    res.status(400);
    throw new Error("Lead not found!");
  }

  const updatedChartData = !!userExists.length
    ? await Chart.updateOne(
        {
          _id: chartAvailable?._id,
          "lead.userId": userId,
          "lead._id": userExists[0]?.lead[0]?._id,
        },
        {
          $set: {
            "lead.$.totalSpentTime":
              totalSpentTime + userExists[0]?.lead[0]?.totalSpentTime,
          },
        }
      )
    : await Chart.findByIdAndUpdate(
        chartAvailable?._id,
        {
          leadId: leadId,
          leadName: leadAvailable?.name,
          lead: [
            ...chartAvailable?.lead,
            {
              userId: userId,
              userName: userAvailable?.username,
              totalSpentTime: totalSpentTime || 0,
            },
          ],
        },
        { new: true }
      );

  res.status(200).json(updatedChartData);
});

module.exports = {
  createLead,
  leads,
  getLead,
  updateLead,
  deleteLead,
  getAllChartData,
  createChartData,
  updateChartData,
};
