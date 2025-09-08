import React, { useState } from "react";
import LeaveRequestModal from "./LeaveRequestModal";

const NurseHome = ({
  user,
  schedules,
  leaveRequests,
  onLogout,
  onLeaveRequest,
}) => {
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const handleLeaveClick = (schedule) => {
    setSelectedSchedule(schedule);
    setShowLeaveModal(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <span className="text-2xl mr-3">👩‍⚕️</span>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  ระบบจัดเวรพยาบาล
                </h1>
                <p className="text-sm text-gray-600">พยาบาล - {user.name}</p>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Schedule Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                ตารางเวรของฉัน
              </h2>
            </div>
            <div className="p-6">
              {schedules.length > 0 ? (
                <div className="space-y-4">
                  {schedules.map((schedule) => {
                    const hasLeaveRequest = leaveRequests.some(
                      (req) => req.scheduleId === schedule.id
                    );

                    return (
                      <div
                        key={schedule.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-medium text-gray-900">
                              {formatDate(schedule.date)}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              🕐 {schedule.shift}
                            </div>
                          </div>
                          {!hasLeaveRequest && (
                            <button
                              onClick={() => handleLeaveClick(schedule)}
                              className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-md hover:bg-red-200 transition-colors"
                            >
                              ขอลา
                            </button>
                          )}
                        </div>

                        {hasLeaveRequest && (
                          <div className="mt-2 p-2 bg-yellow-50 rounded text-xs text-yellow-800">
                            มีการขอลาเวรนี้แล้ว
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>ยังไม่มีเวรที่ได้รับมอบหมาย</p>
                </div>
              )}
            </div>
          </div>

          {/* Leave Requests */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">รายการขอลา</h2>
            </div>
            <div className="p-6">
              {leaveRequests.length > 0 ? (
                <div className="space-y-4">
                  {leaveRequests.map((request) => (
                    <div
                      key={request.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium text-gray-900">
                          {formatDate(request.date)}
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            request.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : request.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {request.status === "pending"
                            ? "รอดำเนินการ"
                            : request.status === "approved"
                            ? "อนุมัติ"
                            : "ปฏิเสธ"}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        🕐 {request.shift}
                      </div>
                      <div className="text-sm text-gray-700">
                        <strong>เหตุผล:</strong> {request.reason}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>ยังไม่มีรายการขอลา</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Leave Request Modal */}
      {showLeaveModal && (
        <LeaveRequestModal
          schedule={selectedSchedule}
          onSubmit={(reason) => {
            onLeaveRequest(selectedSchedule.id, reason);
            setShowLeaveModal(false);
            setSelectedSchedule(null);
          }}
          onClose={() => {
            setShowLeaveModal(false);
            setSelectedSchedule(null);
          }}
        />
      )}
    </div>
  );
};

export default NurseHome;
