import React from "react";
import { MdClose, MdSend } from "react-icons/md";

const PasswordResetModal = ({
  showPasswordReset,
  resetPasswordEmail,
  resetLoading,
  setShowPasswordReset,
  setResetPasswordEmail,
  handleSendPasswordReset,
}) => {
  if (!showPasswordReset) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Send Password Reset</h3>
          <button
            onClick={() => setShowPasswordReset(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <MdClose size={24} />
          </button>
        </div>

        <p className="text-gray-600 mb-4">
          Enter the user's email address to send them a password reset link.
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            User Email
          </label>
          <input
            type="email"
            value={resetPasswordEmail}
            onChange={(e) => setResetPasswordEmail(e.target.value)}
            placeholder="user@example.com"
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowPasswordReset(false)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSendPasswordReset}
            disabled={resetLoading || !resetPasswordEmail}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {resetLoading ? (
              <div className="mr-2 animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
            ) : (
              <MdSend size={18} />
            )}
            Send Reset Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetModal;
