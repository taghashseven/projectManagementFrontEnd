import store from "./features/store";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ProjectPage from "./pages/ProjectPage";
import LoginPage from "./pages/LoginPage";
import { Provider } from "react-redux";
import UserDashboard from "./pages/UserDashboard";
import PrivateRoute from "./PrivateRoute";
import SettingsPage from "./pages/SettingsPage";
import { DarkModeProvider } from "./context/DarkModeContext";
function App() {
  return (
    <DarkModeProvider>
       <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/userdashboard"
              element={
                <PrivateRoute>
                  <UserDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/projects/:projectId"
              element={
                <PrivateRoute>
                  <ProjectPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <SettingsPage />
                </PrivateRoute>
              }
            />v
          </Routes>
        </div>
      </Router>
    </Provider>
  </DarkModeProvider>
  );
}

export default App;
