const expressAsyncHandler = require("express-async-handler"); // Importing the express-async-handler library to handle asynchronous errors
const jwt = require("jsonwebtoken"); // Importing the jsonwebtoken library for working with JWTs

// Defining a middleware function using expressAsyncHandler
const adminValidationToken = expressAsyncHandler(async (req, res, next) => {
  let token; // Declaring a variable to hold the token value
  let authHeader = req.headers.Authorization || req.headers.authorization; // Retrieving the authorization header from the request

  // Checking if the authorization header exists and starts with "Bearer"
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1]; // Extracting the token part after "Bearer"

    // Verifying the token using jwt.verify method
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        // If there's an error in verification
        res.status(401); // Set response status to 401 (Unauthorized)
        throw new Error("user is not authorized"); // Throwing an error indicating unauthorized access
      }
      if (decoded?.user?.role) {
        next(); // Proceeding to the next middleware or route handler
      } else {
        res.status(401); // Set response status to 401 (Unauthorized)
        throw new Error("user is not authorized"); // Throwing an error indicating unauthorized access
      }
    });

    if (!token) {
      res.status(401); // Set response status to 401 (Unauthorized)
      throw new Error("User is not Authorized or token is missing"); // Throwing an error indicating unauthorized access or missing token
    }
  }
});

// Exporting the middleware for use in other parts of the application
module.exports = adminValidationToken;
