import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRouter from "./router/AppRouter";
import "./styles/index.css"; // Tailwind main styles

function App() {
  return (
      <Router>
        <div className="min-h-screen bg-gray-50">
          {/* Routes */}
          <AppRouter />

          {/* Toast notifications */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnHover
            draggable
            theme="colored"
          />
        </div>
      </Router>
  );
}

export default App;
