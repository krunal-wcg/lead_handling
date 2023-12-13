const express = require("express");
const {
  createLead,
  leads,
  getLead,
  updateLead,
  deleteLead,
  createChartData,
  updateChartData,
  getAllChartData,
} = require("../controllers/leadsController");
const validateToken = require("../middleware/validateTokenHandler");
const adminValidationToken = require("../middleware/adminValidationHandler");

const router = express.Router();

router.post("/create", adminValidationToken, createLead);

router.get("/", leads);

router.get("/:id", validateToken, getLead);

router.delete("/:id", validateToken, deleteLead);

router.put("/:id", validateToken, updateLead);

router.get("/chart/all", validateToken, getAllChartData);
router.post("/chart", validateToken, createChartData);
router.put("/chart/:leadId", validateToken, updateChartData);

module.exports = router;
