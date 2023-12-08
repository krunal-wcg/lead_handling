const express = require("express");
const {
  registerUser,
  loginUser,
  allUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");
const adminValidationToken = require("../middleware/adminValidationHandler");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/", adminValidationToken, allUsers);

router.get("/:id", validateToken, getUser);

router.delete("/:id", validateToken, deleteUser);

router.put("/:id", validateToken, updateUser);

module.exports = router;
