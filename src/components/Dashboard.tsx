import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface LeaveApplication {
  id: number;
  start_date: string;
  end_date: string;
  reason: string;
  user_name: string;
  registration_number: string;
  phone: string;
  created_at: string;
}

interface DashboardProps {
  userId: string;
  onClose: () => void;
}

export function Dashboard({ userId, onClose }: DashboardProps) {
  const [applications, setApplications] = useState<LeaveApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalDays, setTotalDays] = useState(0);

  useEffect(() => {
    fetchApplications();
  }, [userId]);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('leave_applications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
      
      // Calculate total days
      if (data && data.length > 0) {
        const total = data.reduce((sum, app) => {
          return sum + calculateDays(app.start_date, app.end_date);
        }, 0);
        setTotalDays(total);
      }
    } catch (error: any) {
      toast.error('Failed to fetch leave applications');
    } finally {
      setLoading(false);
    }
  };

  // Calculate the number of days between two dates (inclusive)
  const calculateDays = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Reset time part to ensure we're only counting days
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    
    // Calculate difference in milliseconds
    const diffTime = Math.abs(end.getTime() - start.getTime());
    
    // Convert to days and add 1 to include both start and end dates
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    return diffDays;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Leave Applications History</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Clock className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No leave applications found
          </div>
        ) : (
          <>
            <div className="bg-indigo-50 p-4 rounded-lg mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-indigo-800">Total Leave Days</h3>
                <p className="text-sm text-indigo-600">Sum of all leave applications</p>
              </div>
              <div className="text-3xl font-bold text-indigo-700">{totalDays} days</div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registration Number
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Leave Period
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No. of Days
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted On
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((application, index) => (
                    <tr key={application.id ? application.id.toString() : index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {application.user_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {application.registration_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {application.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(application.start_date).toLocaleDateString()} - {new Date(application.end_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {calculateDays(application.start_date, application.end_date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {application.reason}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(application.created_at).toLocaleDateString()}
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
  );
}
