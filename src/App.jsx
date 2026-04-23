import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar'
import Login from './components/Login'
import Home from './components/Home'
import SignUp from "./components/SignUp"
import UserDashboard from "./pages/UserDashboard";
import AuthorityDashboard from "./pages/AuthorityDashboard";
import MyIssues from "./pages/MyIssues";
import ReportIssue from "./pages/ReportIssue";
import AssignedIssues from "./pages/AssignedIssues";

const App = () => {
  return (
    <>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<><Navbar /><Home /></>} />
        <Route path="/login" element={<><Navbar /><Login /></>} />
        <Route path="/signup" element={<><Navbar /><SignUp /></>} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/authority-dashboard" element={<AuthorityDashboard />} />
        <Route path="/my-issues" element={<MyIssues />} />
        <Route path="/report-issue" element={<ReportIssue />} />
        <Route path="/assigned-issues" element={<AssignedIssues />} />
      </Routes>
    </>
  )
}

export default App;
