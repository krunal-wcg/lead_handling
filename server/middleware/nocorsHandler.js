const allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  // // res.header(
  // //   "Access-Control-Allow-Methods",
  // //   "GET,HEAD,OPTIONS,POST,PUT, DELETE"
  // // );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header(
  //   "Access-Control-Allow-Headers",
  //   "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  // );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Request-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  next();
};

module.exports = allowCrossDomain;
