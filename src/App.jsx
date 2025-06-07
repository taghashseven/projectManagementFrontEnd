import { useEffect, useState } from "react";
import store from "./features/store";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ProjectPage from "./pages/ProjectPage";
import LoginPage from "./pages/LoginPage";
import { Provider } from "react-redux";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* login page  */}
            {/* <Route path='/' element={LoginPage} /> */}

            <Route path="/" element={<LoginPage />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects/:projectId" element={<ProjectPage />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
