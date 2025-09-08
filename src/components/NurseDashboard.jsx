import React, { useState } from "react";
import { Calendar, Clock, AlertCircle } from "lucide-react";

const NurseDashboard = ({ user, shifts, leaveRequests, onRequestLeave }) => {
  const [selectedShift, setSelectedShift] = useState(null);
  const [leaveReason, setLeaveReason] = useState("");

  const myShifts = shifts.filter((shift) => shift.nurseId === user.username);
  const myLeaveRequests = leaveRequests.filter(
    (req) => req.nurseId === user.username
  );

  const handleRequestLeave = (shift) => setSelectedShift(shift);

  const submitLeaveRequest = () => {
    if (!leaveReason.trim()) {
      alert("กรุณากรอกเหตุผลการลา");
      return;
    }

    onRequestLeave({
      id: Date.now(),
      shiftId: selectedShift.id,
      nurseId: user.username,
      nurseName: user.name,
      date: selectedShift.date,
      shift: selectedShift.shift,
      reason: leaveReason,
      status: "pending",
      requestedAt: new Date().toLocaleString("th-TH"),
    });

    setSelectedShift(null);
    setLeaveReason("");
    alert("ส่งคำขอลาเรียบร้อยแล้ว");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "รอพิจารณา";
      case "approved":
        return "อนุมัติ";
      case "rejected":
        return "ไม่อนุมัติ";
      default:
        return status;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ตารางเวร */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              ตารางเวรของฉัน
            </h2>
          </div>
          <div className="space-y-4">
            {myShifts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>ยังไม่มีเวรที่ได้รับมอบหมาย</p>
              </div>
            ) : (
              myShifts.map((shift) => {
                const hasLeaveRequest = myLeaveRequests.some(
                  (req) => req.shiftId === shift.id
                );
                const leaveRequest = myLeaveRequests.find(
                  (req) => req.shiftId === shift.id
                );

                return (
                  <div
                    key={shift.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {shift.date}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {shift.shift === "morning"
                              ? "กะเช้า (08:00-16:00)"
                              : shift.shift === "afternoon"
                              ? "กะบ่าย (16:00-00:00)"
                              : "กะดึก (00:00-08:00)"}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        {hasLeaveRequest ? (
                          <div className="space-y-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                leaveRequest.status
                              )}`}
                            >
                              {getStatusText(leaveRequest.status)}
                            </span>
                            {leaveRequest.status === "pending" && (
                              <p className="text-xs text-gray-500">
                                รอการอนุมัติ
                              </p>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => handleRequestLeave(shift)}
                            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition duration-200 flex items-center gap-2"
                          >
                            <AlertCircle className="w-4 h-4" />
                            ขอลา
                          </button>
                        )}
                      </div>
                    </div>

                    {shift.note && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>หมายเหตุ:</strong> {shift.note}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ประวัติการลา */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-6 h-6 text-orange-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              ประวัติการขอลา
            </h2>
          </div>
          <div className="space-y-4">
            {myLeaveRequests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>ยังไม่เคยขอลา</p>
              </div>
            ) : (
              myLeaveRequests.map((request) => (
                <div
                  key={request.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {request.date}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {request.shift === "morning"
                          ? "กะเช้า"
                          : request.shift === "afternoon"
                          ? "กะบ่าย"
                          : "กะดึก"}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {getStatusText(request.status)}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 mt-3">
                    <p className="text-sm text-gray-700">
                      <strong>เหตุผล:</strong> {request.reason}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      ขอเมื่อ: {request.requestedAt}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedShift && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              ขอลาในเวร
            </h3>
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-blue-800 mb-2">รายละเอียดเวร</h4>
              <p className="text-sm text-blue-700">
                วันที่: {selectedShift.date}
              </p>
              <p className="text-sm text-blue-700">
                เวร:{" "}
                {selectedShift.shift === "morning"
                  ? "กะเช้า (08:00-16:00)"
                  : selectedShift.shift === "afternoon"
                  ? "กะบ่าย (16:00-00:00)"
                  : "กะดึก (00:00-08:00)"}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                เหตุผลการลา *
              </label>
              <textarea
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="กรุณาระบุเหตุผลการลา..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedShift(null);
                  setLeaveReason("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                ยกเลิก
              </button>
              <button
                onClick={submitLeaveRequest}
                className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition duration-200 flex items-center justify-center gap-2"
              >
                <AlertCircle className="w-4 h-4" />
                ส่งคำขอ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NurseDashboard;
