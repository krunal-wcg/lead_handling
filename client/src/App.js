import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Router from "./routes/Router";
import "sweetalert2/src/sweetalert2.scss";

function App() {
  return (
    <>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </>
  );
}

export default App;
