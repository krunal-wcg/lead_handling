import { toast } from "react-hot-toast";

var object = {
  style: {
    background: "#183D3D",
    padding: "16px",
    color: "#FAF1E4",
  },
  // icon: "👏",
  duration: 4000,
  position: "top-center",
};

export const getSuccessToast = (message) => toast.success(message, object);
export const getErrorToast = (message) => toast.error(message, object);
