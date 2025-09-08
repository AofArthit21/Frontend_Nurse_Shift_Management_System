import React, { useState } from "react";
import CreateScheduleModal from "./CreateScheduleModal";
import LeaveRequestList from "./LeaveRequestList";

const NurseManagerHome = ({
  user,
  users,
  schedules,
  leaveRequests,
  onLogout,
  onCreateSchedule,
  onLeaveDecision,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState("schedules");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getNurseName = (nurseId) => {
    const nurse = users.find((u) => u.id === nurseId);
    return nurse ? nurse.name : "ไม่ทราบชื่อ";
  };

  const groupSchedulesByDate = () => {
    const grouped = {};
    schedules.forEach((schedule) => {
      const date = schedule.date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(schedule);
    });
    return grouped;
  };

  const pendingCount = leaveRequests.filter(
    (r) => r.status === "pending"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <span className="text-2xl mr-3">👩‍💼</span>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  ระบบจัดเวรพยาบาล
                </h1>
                <p className="text-sm text-gray-600">
                  หัวหน้าพยาบาล - {user.name}
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("schedules")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "schedules"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              📅 จัดการเวร
            </button>
            <button
              onClick={() => setActiveTab("leaves")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "leaves"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              📋 คำขอลา ({pendingCount})
            </button>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "schedules" && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                ตารางเวรทั้งหมด
              </h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                ➕ สร้างเวรใหม่
              </button>
            </div>

            <div className="bg-white rounded-lg shadow">
              {schedules.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {Object.entries(groupSchedulesByDate()).map(
                    ([date, daySchedules]) => (
                      <div key={date} className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          {formatDate(date)}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {daySchedules.map((schedule) => (
                            <div
                              key={schedule.id}
                              className="border border-gray-200 rounded-lg p-4"
                            >
                              <div className="flex items-center mb-2">
                                <span className="mr-2">👩‍⚕️</span>
                                <span className="font-medium text-gray-900">
                                  {getNurseName(schedule.nurseId)}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600">
                                {schedule.shift}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">ยังไม่มีเวรที่สร้างไว้</p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    สร้างเวรแรก
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "leaves" && (
          <LeaveRequestList
            leaveRequests={leaveRequests}
            users={users}
            onLeaveDecision={onLeaveDecision}
          />
        )}
      </div>

      {showCreateModal && (
        <CreateScheduleModal
          users={users}
          onSubmit={(nurseId, date, shift) => {
            onCreateSchedule(nurseId, date, shift);
            setShowCreateModal(false);
          }}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};

export default NurseManagerHome;
