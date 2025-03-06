"use client"

import type React from "react"
import { useState } from "react"
import { Calendar, Clock, FileText, Phone, User, Hash, ListStart, BookOpen } from "lucide-react"
import { supabase } from "../lib/supabase"
import toast from "react-hot-toast"
import collegeBackground from "../assets/lbrce.jpg"

interface LeaveApplicationProps {
  userId: string
  userName: string
  registrationNumber: string
  parentPhone: string
  section?: string
  year?: string
  onClose: () => void
  onSubmit: () => void
}

export function LeaveApplication({
  userId,
  userName,
  registrationNumber,
  parentPhone,
  section,
  year,
  onClose,
  onSubmit,
}: LeaveApplicationProps) {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [phone, setPhone] = useState("")
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState("")
  const [sectionValue, setSectionValue] = useState(section || "")
  const [yearValue, setYearValue] = useState(year || "")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setResult("Sending...")

    try {
      // Create form data for web3forms
      const primaryAccessKey = "b5e57524-6364-48ed-bc09-118b1c940482"
      const secondaryAccessKey = "1d3d59e9-cdcc-482f-82f5-6ff36393f04e"

      // Create two identical form data objects, one for each key
      const createFormData = (accessKey: string) => {
        const formData = new FormData()
        formData.append("access_key", accessKey)
        formData.append("name", userName)
        formData.append("phone", phone)
        formData.append("message", reason)
        formData.append("start_date", startDate)
        formData.append("end_date", endDate)
        formData.append("registration_number", registrationNumber)
        formData.append("parent_phone", parentPhone)
        formData.append("section", sectionValue)
        formData.append("year", yearValue)
        return formData
      }

      // Submit to web3forms using both keys simultaneously with Promise.race
      const response = await Promise.race([
        fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: createFormData(primaryAccessKey),
        }).then((res) => ({ res, key: "primary" })),
        fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: createFormData(secondaryAccessKey),
        }).then((res) => ({ res, key: "secondary" })),
      ])

      console.log(`Using ${response.key} access key for this submission`)
      const data = await response.res.json()

      if (data.success) {
        // If web3forms submission is successful, save to Supabase
        const { error } = await supabase.from("leave_applications").insert([
          {
            user_id: userId,
            user_name: userName,
            registration_number: registrationNumber,
            start_date: startDate,
            end_date: endDate,
            reason,
            phone,
            section: sectionValue,
            year: yearValue,
          },
        ])

        if (error) throw error

        setResult("Form Submitted Successfully")
        toast.success("Leave application submitted successfully")
        onSubmit()
        onClose()
      } else {
        throw new Error(data.message)
      }
    } catch (error: any) {
      setResult(error.message)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      style={{ backgroundImage: `url(${collegeBackground})`, backgroundSize: "cover" }}
    >
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto ">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Apply for Leave</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Your Name</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                value={userName}
                readOnly
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Registration Number</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Hash className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="registration_number"
                value={registrationNumber}
                readOnly
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Section</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ListStart className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  name="section"
                  value={sectionValue}
                  onChange={(e) => setSectionValue(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Section</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Year of Study</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BookOpen className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  name="year"
                  value={yearValue}
                  onChange={(e) => setYearValue(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Parent Phone Number</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                name="parent_phone"
                value={parentPhone}
                readOnly
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Your Phone Number</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                name="phone"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter Your Number"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Write Your Message Here</label>
            <div className="mt-1 relative">
              <div className="absolute top-3 left-3">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                name="message"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter Your Message"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                rows={4}
              />
            </div>
          </div>

          {result && (
            <div
              className={`text-sm ${result === "Sending..." ? "text-gray-600" : result.includes("Successfully") ? "text-green-600" : "text-red-600"}`}
            >
              {result}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
            >
              {loading ? <Clock className="h-5 w-5 animate-spin" /> : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}



