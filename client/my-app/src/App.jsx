import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { store } from "./redux/store";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import Sidebar from "./components/Sidebar";
import EmptyDashboard from "./pages/EmptyDashboard";
import DashboardWithClubs from "./pages/DashboardWithClubs";
import ExplorePage from "./pages/ExplorePage";
import ClubLayout from "./components/ClubLayout"; // ✅ New Layout for My Clubs
import ClubDetails from "./components/ClubDetails.jsx";
import ClubAnnouncements from "./components/ClubAnnouncements.jsx";
import ClubEvents from "./components/ClubEvents.jsx";
import ClubDiscussions from "./components/ClubDiscussions.jsx";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("jwtToken");
  return token ? children : <Navigate to="/login" replace />;
}

function DashboardWrapper() {
  const location = useLocation();
  const userClubsFromState = location.state?.userJoinedClubs || [];
  const userClubsFromRedux = useSelector((state) => state.user.userJoinedClubs) || [];

  const userClubs = userClubsFromState.length > 0 ? userClubsFromState : userClubsFromRedux;

  return userClubs.length > 0 ? <DashboardWithClubs userClubs={userClubs} /> : <EmptyDashboard />;
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* ✅ Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* ✅ Protected Routes (Require Login) */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <ProtectedLayout>
                  <DashboardWrapper />
                </ProtectedLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/explore"
            element={
              <PrivateRoute>
                <ProtectedLayout>
                  <ExplorePage />
                </ProtectedLayout>
              </PrivateRoute>
            }
          />

          {/* ✅ My Clubs (Ensures Sidebar is present) */}
          <Route path="/my-clubs" element={<ClubLayout />}>
            <Route path=":clubId/details" element={<ClubDetails />} />
            <Route path=":clubId/announcements" element={<ClubAnnouncements />} />
            <Route path=":clubId/events" element={<ClubEvents />} />
            <Route path=":clubId/discussions" element={<ClubDiscussions />} />
          </Route>

          {/* ✅ Catch-All Route for 404 */}
          <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>
      </Router>
    </Provider>
  );
}

function ProtectedLayout({ children }) {
  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden" }}>
      <Sidebar />
      <div style={{ flexGrow: 1, padding: "10px", marginLeft: "210px", overflowY: "auto" }}>
        {children}
      </div>
    </div>
  );
}

export default App;