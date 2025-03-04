import React from 'react';
import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { LogOut, Calendar, LayoutDashboard, UserCog } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { LeaveApplication } from "./LeaveApplication";
import { Dashboard } from "./Dashboard";
import { ProfileEditor } from "./ProfileEditor";
import collegeBackground from "../assets/lbrce.jpg"

interface WelcomePageProps {
  user: User;
  onSignOut: () => void;
}

export function WelcomePage({ user, onSignOut }: WelcomePageProps) {
  const [showLeaveApplication, setShowLeaveApplication] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [userData, setUserData] = useState(user);

  // Format date and time in a user-friendly way
  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleProfileUpdate = (updatedMetadata: any) => {
    setUserData({
      ...userData,
      user_metadata: {
        ...userData.user_metadata,
        ...updatedMetadata
      }
    });
    setShowProfileEditor(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative">
        {/* Background image with reduced opacity */}
        <div 
          className="absolute inset-0 z-0" 
          style={{ 
            backgroundImage: `url(${collegeBackground})`, 
            backgroundSize: "cover",
            opacity: 0.15  // Reduced opacity here
          }}
        ></div>
        
        {/* Content with relative positioning to appear above the background */}
        <div className="relative z-10">
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <button
              onClick={onSignOut}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 shadow-md"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
            
            <button
              onClick={() => setShowProfileEditor(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md"
            >
              <UserCog className="h-5 w-5" />
              <span>Edit Profile</span>
            </button>
          </div>

          <div className="py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome, {userData.user_metadata.name}!</h1>
              <p className="text-xl text-gray-600">Registration Number: {userData.user_metadata.registration_number}</p>
            </div>

            <div className="mt-12 bg-white rounded-lg shadow-xl p-8 max-w-3xl mx-auto">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Profile</h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <p className="mt-1 text-lg font-semibold text-gray-900">{userData.user_metadata.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Registration Number</label>
                      <p className="mt-1 text-lg font-semibold text-gray-900">{userData.user_metadata.registration_number}</p>
                    </div>
                    {userData.user_metadata.email && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">{userData.user_metadata.email}</p>
                      </div>
                    )}
                    {userData.user_metadata.department && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Department</label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">{userData.user_metadata.department}</p>
                      </div>
                    )}
                    {userData.user_metadata.year && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Year</label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">{userData.user_metadata.year}</p>
                      </div>
                    )}
                    {userData.user_metadata.section && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Section</label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">{userData.user_metadata.section}</p>
                      </div>
                    )}
                    {userData.user_metadata.parent_phone && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Parent Phone</label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">{userData.user_metadata.parent_phone}</p>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Account Created</label>
                      <p className="mt-1 text-lg font-semibold text-gray-900">{formatDateTime(userData.created_at)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Last Sign In</label>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {formatDateTime(userData.last_sign_in_at || userData.created_at)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex justify-center space-x-4">
                  <button
                    onClick={() => setShowLeaveApplication(true)}
                    className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                  >
                    <Calendar className="h-5 w-5" />
                    <span>Apply for Leave</span>
                  </button>
                  <button
                    onClick={() => setShowDashboard(true)}
                    className="flex items-center space-x-2 px-6 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors shadow-md"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showLeaveApplication && (
        <LeaveApplication
          userId={userData.id}
          userName={userData.user_metadata.name}
          registrationNumber={userData.user_metadata.registration_number}
          parentPhone={userData.user_metadata.parent_phone}
          onClose={() => setShowLeaveApplication(false)}
          onSubmit={() => {
            setShowLeaveApplication(false);
            setShowDashboard(true);
          }}
        />
      )}

      {showDashboard && <Dashboard userId={userData.id} onClose={() => setShowDashboard(false)} />}

      {showProfileEditor && (
        <ProfileEditor
          userData={userData.user_metadata}
          onClose={() => setShowProfileEditor(false)}
          onSave={handleProfileUpdate}
        />
      )}

      <Toaster position="top-right" />
    </div>
  );
}



