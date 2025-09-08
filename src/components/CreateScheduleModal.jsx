import React, { useState } from "react";

const CreateScheduleModal = ({ users, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    nurseId: "",
    date: "",
    shift: "",
  });

  const shiftOptions = [
    "เช้า (06:00-14:00)",
    "บ่าย (14:00-22:00)",
    "ดึก (22:00-06:00)",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.nurseId && formData.date && formData.shift) {
      onSubmit(formData.nurseId, formData.date, formData.shift);
    }
  };

  const isFormValid = formData.nurseId && formData.date && formData.shift;
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-medium text-gray-900">สร้างเวรใหม่</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                👩‍⚕️ เลือกพยาบาล <span className="text-red-500">*</span>
              </label>
              <select
                name="nurseId"
                value={formData.nurseId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">กรุณาเลือกพยาบาล</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📅 วันที่ <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                min={today}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🕐 ช่วงเวลา <span className="text-red-500">*</span>
              </label>
              <select
                name="shift"
                value={formData.shift}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">กรุณาเลือกช่วงเวลา</option>
                {shiftOptions.map((shift) => (
                  <option key={shift} value={shift}>
                    {shift}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                💡 เวรที่สร้างจะถูกมอบหมายให้พยาบาลที่เลือกทันที
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 p-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              สร้างเวร
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateScheduleModal;
