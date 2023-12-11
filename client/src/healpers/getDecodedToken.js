import { jwtDecode } from "jwt-decode";
export const decodedToken = () => {
  var token = localStorage.getItem("token");

  const decoded = jwtDecode(token);
  return decoded;
};
