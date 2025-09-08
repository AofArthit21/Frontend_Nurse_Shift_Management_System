import React, { useState } from "react";
import Login from "./components/Login";
import NurseHome from "./components/NurseHome";
import NurseManagerHome from "./components/NurseManagerHome";

// Mock data - ในระบบจริงจะดึงจาก API
const mockUsers = [
  {
    id: 1,
    username: "nurse1",
    password: "password",
    role: "nurse",
    name: "พยาบาล สมหญิง",
  },
  {
    id: 2,
    username: "nurse2",
    password: "password",
    role: "nurse",
    name: "พยาบาล สมชาย",
  },
  {
    id: 3,
    username: "manager",
    password: "password",
    role: "manager",
    name: "หัวหน้าพยาบาล สมศรี",
  },
];

const mockSchedules = [
  {
    id: 1,
    nurseId: 1,
    date: "2025-09-01",
    shift: "เช้า (06:00-14:00)",
    status: "assigned",
  },
  {
    id: 2,
    nurseId: 1,
    date: "2025-09-02",
    shift: "บ่าย (14:00-22:00)",
    status: "assigned",
  },
  {
    id: 3,
    nurseId: 2,
    date: "2025-09-01",
    shift: "ดึก (22:00-06:00)",
    status: "assigned",
  },
  {
    id: 4,
    nurseId: 2,
    date: "2025-09-03",
    shift: "เช้า (06:00-14:00)",
    status: "assigned",
  },
];

const mockLeaveRequests = [
  {
    id: 1,
    nurseId: 1,
    scheduleId: 2,
    date: "2025-09-02",
    shift: "บ่าย (14:00-22:00)",
    reason: "มีธุระส่วนตัว",
    status: "pending",
  },
];

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users] = useState(mockUsers);
  const [schedules, setSchedules] = useState(mockSchedules);
  const [leaveRequests, setLeaveRequests] = useState(mockLeaveRequests);

  // Handle login
  const handleLogin = (username, password) => {
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  // Handle logout
  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Handle leave request
  const handleLeaveRequest = (scheduleId, reason) => {
    const schedule = schedules.find((s) => s.id === scheduleId);
    if (schedule) {
      const newRequest = {
        id: Date.now(),
        nurseId: currentUser.id,
        scheduleId: scheduleId,
        date: schedule.date,
        shift: schedule.shift,
        reason: reason,
        status: "pending",
      };
      setLeaveRequests([...leaveRequests, newRequest]);
    }
  };

  // Handle leave approval/rejection
  const handleLeaveDecision = (requestId, decision) => {
    setLeaveRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: decision } : req
      )
    );
  };

  // Handle new schedule creation
  const handleCreateSchedule = (nurseId, date, shift) => {
    const newSchedule = {
      id: Date.now(),
      nurseId: parseInt(nurseId),
      date,
      shift,
      status: "assigned",
    };
    setSchedules([...schedules, newSchedule]);
  };

  // If not logged in, show login page
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  // Show appropriate dashboard based on role
  return (
    <div className="min-h-screen bg-gray-50">
      {currentUser.role === "nurse" ? (
        <NurseHome
          user={currentUser}
          schedules={schedules.filter((s) => s.nurseId === currentUser.id)}
          leaveRequests={leaveRequests.filter(
            (r) => r.nurseId === currentUser.id
          )}
          onLogout={handleLogout}
          onLeaveRequest={handleLeaveRequest}
        />
      ) : (
        <NurseManagerHome
          user={currentUser}
          users={users.filter((u) => u.role === "nurse")}
          schedules={schedules}
          leaveRequests={leaveRequests}
          onLogout={handleLogout}
          onCreateSchedule={handleCreateSchedule}
          onLeaveDecision={handleLeaveDecision}
        />
      )}
    </div>
  );
}

export default App;
