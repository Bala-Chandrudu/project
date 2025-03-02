"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { Clock } from "lucide-react"
import toast from "react-hot-toast"

interface LeaveApplication {
  id: number
  start_date: string
  end_date: string
  reason: string
  user_name: string
  registration_number: string
  phone: string
  created_at: string
}

interface DashboardProps {
  userId: string
  onClose: () => void
  newApplication?: { startDate: string; endDate: string; phone: string; reason: string } // Added to accept new application data
}

export function Dashboard({ userId, onClose, newApplication }: DashboardProps) {
  const [applications, setApplications] = useState<LeaveApplication[]>([])
  const [loading, setLoading] = useState(true)

  // Format date and time in a user-friendly way
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  // Format date only (for leave period)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  useEffect(() => {
    if (newApplication) {
      const newLeaveApplication: LeaveApplication = {
        id: Date.now(), // Temporary ID, replace with actual ID if needed
        start_date: newApplication.startDate,
        end_date: newApplication.endDate,
        reason: newApplication.reason,
        user_name: "Default User", // Placeholder for actual user name
        registration_number: "Default Registration", // Placeholder for actual registration number
        phone: newApplication.phone,
        created_at: new Date().toISOString(), // Set current date as created_at
      }
      setApplications((prev) => [newLeaveApplication, ...prev]) // Add new application to the state
    }
    fetchApplications()
  }, [userId, newApplication])

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from("leave_applications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) throw error
      setApplications(data || [])
    } catch (error: any) {
      toast.error("Failed to fetch leave applications")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Leave Applications History</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            Close
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Clock className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No leave applications found</div>
        ) : (
          <div className="overflow-auto flex-1">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Registration Number
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Phone
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Leave Period
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Reason
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Submitted On
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((application, index) => (
                  <tr key={application.id ? application.id.toString() : index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{application.user_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {application.registration_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{application.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(application.start_date)} - {formatDate(application.end_date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{application.reason}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(application.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

