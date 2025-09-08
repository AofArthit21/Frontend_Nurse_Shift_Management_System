import React, { useState } from "react";

const LeaveRequestList = ({ leaveRequests, users, onLeaveDecision }) => {
  const [filter, setFilter] = useState("all");

  const getNurseName = (nurseId) => {
    const nurse = users.find((u) => u.id === nurseId);
    return nurse ? nurse.name : "ไม่ทราบชื่อ";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const filteredRequests = leaveRequests.filter((request) => {
    if (filter === "pending") return request.status === "pending";
    if (filter === "approved") return request.status === "approved";
    if (filter === "rejected") return request.status === "rejected";
    return true;
  });

  const pendingCount = leaveRequests.filter(
    (r) => r.status === "pending"
  ).length;

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">รายการขอลา</h2>

        <div className="flex space-x-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            ทั้งหมด ({leaveRequests.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              filter === "pending"
                ? "bg-yellow-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            รอดำเนินการ ({pendingCount})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              filter === "approved"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            อนุมัติแล้ว
          </button>
          <button
            onClick={() => setFilter("rejected")}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              filter === "rejected"
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            ปฏิเสธแล้ว
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        {filteredRequests.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <div key={request.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <span className="mr-2">👩‍⚕️</span>
                        <span className="font-medium text-gray-900">
                          {getNurseName(request.nurseId)}
                        </span>
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
                          ? "⏳ รอดำเนินการ"
                          : request.status === "approved"
                          ? "✅ อนุมัติ"
                          : "❌ ปฏิเสธ"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="text-sm text-gray-600">
                        📅 {formatDate(request.date)}
                      </div>
                      <div className="text-sm text-gray-600">
                        🕐 {request.shift}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-1">
                        เหตุผลการขอลา:
                      </div>
                      <div className="text-sm text-gray-600">
                        {request.reason}
                      </div>
                    </div>

                    {request.status === "pending" && (
                      <div className="flex space-x-3">
                        <button
                          onClick={() =>
                            onLeaveDecision(request.id, "approved")
                          }
                          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                          ✅ อนุมัติ
                        </button>
                        <button
                          onClick={() =>
                            onLeaveDecision(request.id, "rejected")
                          }
                          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                          ❌ ปฏิเสธ
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {filter === "all" && "ยังไม่มีรายการขอลา"}
              {filter === "pending" && "ไม่มีรายการที่รอดำเนินการ"}
              {filter === "approved" && "ไม่มีรายการที่อนุมัติแล้ว"}
              {filter === "rejected" && "ไม่มีรายการที่ปฏิเสธแล้ว"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveRequestList;
