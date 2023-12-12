import { jwtDecode } from "jwt-decode";
export const decodedToken = () => {
  var token = localStorage?.getItem("token");

  if (token) {
    const decoded = jwtDecode(token);
    return decoded;
  }
};

/**
 *  {
 *     "user": {
 *         "username": String,
 *         "id": String,
 *         "role": Boolean
 *     },
 *     "iat": 1702290552,
 *     "exp": 1702376952
 *  }
 */
