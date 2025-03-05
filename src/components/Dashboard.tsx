"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { Clock } from 'lucide-react'
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
}

export function Dashboard({ userId, onClose }: DashboardProps) {
  const [applications, setApplications] = useState<LeaveApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [totalDays, setTotalDays] = useState(0)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from("leave_applications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) throw error
      setApplications(data || [])

      // Calculate total days
      if (data && data.length > 0) {
        const total = data.reduce((sum, app) => {
          return sum + calculateDays(app.start_date, app.end_date)
        }, 0)
        setTotalDays(total)
      }
    } catch (error: any) {
      toast.error("Failed to fetch leave applications")
    } finally {
      setLoading(false)
    }
  }

  // Calculate the number of days between two dates (inclusive)
  const calculateDays = (startDate: string, endDate: string): number => {
    const start = new Date(startDate)
    const end = new Date(endDate)

    // Reset time part to ensure we're only counting days
    start.setHours(0, 0, 0, 0)
    end.setHours(0, 0, 0, 0)

    // Calculate difference in milliseconds
    const diffTime = Math.abs(end.getTime() - start.getTime())

    // Convert to days and add 1 to include both start and end dates
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

    return diffDays
  }

  // Format date and time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/50 animate-pulse-slow"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-[10%] opacity-30">
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-indigo-400/30 rounded-full blur-3xl animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-1/3 h-1/3 bg-purple-400/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 right-1/3 w-1/4 h-1/4 bg-pink-400/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
          </div>
        </div>
      </div>
      
      {/* Modal content */}
      <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-2xl relative z-10 border border-white/20">
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
          <>
            <div className="bg-indigo-50/80 backdrop-blur-sm p-4 rounded-lg mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-indigo-800">Total Leave Days</h3>
                <p className="text-sm text-indigo-600">Sum of all leave applications</p>
              </div>
              <div className="text-3xl font-bold text-indigo-700">{totalDays} days</div>
            </div>

            <div className="overflow-x-auto rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 bg-white/90 backdrop-blur-sm">
                <thead className="bg-gray-50/90">
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
                      No. of Days
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
                <tbody className="bg-white/80 backdrop-blur-sm divide-y divide-gray-200">
                  {applications.map((application, index) => (
                    <tr key={application.id ? application.id.toString() : index} className="hover:bg-gray-50/90 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{application.user_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {application.registration_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{application.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(application.start_date).toLocaleDateString()} -{" "}
                        {new Date(application.end_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {calculateDays(application.start_date, application.end_date)}
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
          </>
        )}
      </div>
    </div>
  )
}
