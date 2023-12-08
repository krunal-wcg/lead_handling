const express = require("express");
const {
  createLead,
  leads,
  getLead,
  updateLead,
  deleteLead,
} = require("../controllers/leadsController");
const validateToken = require("../middleware/validateTokenHandler");
const adminValidationToken = require("../middleware/adminValidationHandler");

const router = express.Router();

router.post("/create", adminValidationToken, createLead);

router.get("/", leads);

router.get("/:id", validateToken, getLead);

router.delete("/:id", validateToken, deleteLead);

router.put("/:id", validateToken, updateLead);

module.exports = router;
