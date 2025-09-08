import React, { useState } from "react";
import { Calendar, Plus, Check, X, AlertCircle } from "lucide-react";

const HeadNurseDashboard = ({
  user,
  shifts,
  leaveRequests,
  onCreateShift,
  onApproveLeave,
  onRejectLeave,
}) => {
  const [newShiftDate, setNewShiftDate] = useState("");
  const [newShiftType, setNewShiftType] = useState("morning");
  const [newShiftNurse, setNewShiftNurse] = useState("");

  const handleCreateShift = () => {
    if (!newShiftDate || !newShiftType || !newShiftNurse) {
      alert("กรุณากรอกข้อมูลเวรให้ครบทุกช่อง");
      return;
    }
    onCreateShift({
      id: Date.now(),
      date: newShiftDate,
      shift: newShiftType,
      nurseId: newShiftNurse,
      note: "",
    });
    setNewShiftDate("");
    setNewShiftType("morning");
    setNewShiftNurse("");
    alert("สร้างเวรเรียบร้อยแล้ว");
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* หัวข้อ dashboard */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          ยินดีต้อนรับ, {user?.name}
        </h1>
        <p className="text-gray-600">แดชบอร์ดหัวหน้าพยาบาล</p>
      </div>

      {/* สร้างเวร */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <Plus className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">สร้างเวรใหม่</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              วันที่
            </label>
            <input
              type="date"
              value={newShiftDate}
              onChange={(e) => setNewShiftDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              กะ
            </label>
            <select
              value={newShiftType}
              onChange={(e) => setNewShiftType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="morning">กะเช้า</option>
              <option value="afternoon">กะบ่าย</option>
              <option value="night">กะดึก</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              พยาบาล
            </label>
            <input
              type="text"
              placeholder="กรอก username พยาบาล"
              value={newShiftNurse}
              onChange={(e) => setNewShiftNurse(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleCreateShift}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            สร้างเวร
          </button>
        </div>
      </div>

      {/* ตารางเวรทั้งหมด */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">
            ตารางเวรทั้งหมด
          </h2>
        </div>
        <div className="space-y-4">
          {shifts.length === 0 ? (
            <p className="text-gray-500 text-center py-6">ยังไม่มีเวร</p>
          ) : (
            shifts.map((shift) => (
              <div
                key={shift.id}
                className="border border-gray-200 rounded-lg p-4 flex justify-between items-start"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">{shift.date}</h3>
                  <p className="text-sm text-gray-600">
                    {shift.shift === "morning"
                      ? "กะเช้า (08:00-16:00)"
                      : shift.shift === "afternoon"
                      ? "กะบ่าย (16:00-00:00)"
                      : "กะดึก (00:00-08:00)"}
                  </p>
                  <p className="text-sm text-gray-600">
                    พยาบาล: {shift.nurseId}
                  </p>
                </div>
                {shift.note && (
                  <p className="text-sm text-blue-700">{shift.note}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* คำขอลา */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-orange-600" />
          <h2 className="text-xl font-semibold text-gray-800">คำขอลา</h2>
        </div>
        <div className="space-y-4">
          {leaveRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-6">ยังไม่มีคำขอลา</p>
          ) : (
            leaveRequests.map((request) => (
              <div
                key={request.id}
                className="border border-gray-200 rounded-lg p-4 flex justify-between items-start"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {request.date}
                  </h3>
                  <p className="text-sm text-gray-600">{request.shift}</p>
                  <p className="text-sm text-gray-600">
                    พยาบาล: {request.nurseName}
                  </p>
                  <p className="text-sm text-gray-700 mt-2">
                    <strong>เหตุผล:</strong> {request.reason}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  {request.status === "pending" ? (
                    <>
                      <button
                        onClick={() => onApproveLeave(request.id)}
                        className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm flex items-center gap-1"
                      >
                        <Check className="w-4 h-4" /> อนุมัติ
                      </button>
                      <button
                        onClick={() => onRejectLeave(request.id)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm flex items-center gap-1"
                      >
                        <X className="w-4 h-4" /> ปฏิเสธ
                      </button>
                    </>
                  ) : (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {getStatusText(request.status)}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HeadNurseDashboard;
