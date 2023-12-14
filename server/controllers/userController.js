const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

/**
 * @desc Register a user
 * @route POST /api/users/register
 * @access public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered!");
  }

  //Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password: ", hashedPassword);
  const user = await User.create({
    name: "",
    username,
    email,
    password: hashedPassword,
    isAdmin: false, // true
  });

  console.log(`User created ${user}`);
  if (user) {
    res
      .status(201)
      .json({
        data: { _id: user.id, email: user.email },
        message: "Register the user",
      });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
});

//@desc Login user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!(email || username) || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const findByEmail = await User.findOne({ email });
  const findByUsername = await User.findOne({ username });
  var user = findByEmail || findByUsername;
  // compare password with hashedPassword
  if (
    (findByEmail || findByUsername) &&
    (await bcrypt.compare(password, user.password))
  ) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          id: user.id,
          role: user.isAdmin,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "24h" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("email or password is not valid");
  }
});

/**
 * @desc get all Users
 * @route GET /api/users/getAll
 * @access private
 **/
const allUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password -isAdmin -__v");
  res.status(200).json({ users: users }); // Sending the access token as a JSON response
});

/**
 * @desc get User
 * @route GET /api/user//:id
 * @access private
 **/
const getUser = asyncHandler(async (req, res) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  // Finding a user by its ID
  const user = await User.findById(req.params.id).select(
    "-password -isAdmin -__v"
  );
  if (!user) {
    res.status(404); // Responding with a 404 status if the user is not found
    throw new Error("User not Found");
  }

  if (user) {
    res.status(200).json({ user: user }); // Sending the access token as a JSON response
  }
});

/**
 * @desc Update User
 * @route PUT /api/users/:id
 * @access private
 **/
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select(
    "-password -isAdmin -__v"
  );
  if (!user) {
    res.status(404);
    throw new Error("User not Found");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true } // Returning the updated user after the update
  );
  res.status(200).json(updatedUser); // Sending the access token as a JSON response
});

/**
 * @desc Delete User by ID
 * @route DELETE /api/users/:id
 * @access private (Requires authentication)
 **/
const deleteUser = asyncHandler(async (req, res) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  // Finding a user by its ID
  const user = await User.findById(req.params.id).select(
    "-password -isAdmin -__v"
  );
  if (!user) {
    res.status(404); // Responding with a 404 status if the user is not found
    throw new Error("User not Found");
  }

  // Checking if the logged-in user has permission to delete the user
  if (!jwt.decode(token)?.user?.role) {
    res.status(403); // Responding with a 403 status if permission is denied
    throw new Error("User Don't have permission to delete other User");
  }

  // Deleting the user and sending the deleted user as a response
  await User.deleteOne({ _id: req.params.id });
  res.status(200).json(user); // Sending the deleted user as a JSON response
});

module.exports = {
  registerUser,
  loginUser,
  allUsers,
  getUser,
  updateUser,
  deleteUser,
};
