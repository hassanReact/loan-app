'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';

// TypeScript interface for a Loan object
interface Loan {
  _id: string;
  user: string;
  amount: number;
  reason: string;
  documents: string[];
  status: 'pending' | 'approved' | 'rejected' | 'repaid';
  withdrawn: boolean;
  repaidAmount: number;
  createdAt: string;
  updatedAt: string;
  repaidAt?: string;
  purpose?: string;
  duration?: string;
}

export default function LoanStatusPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchLoans = async () => {
    try {
      const res = await axios.get('/api/loan/status');
      setLoans(res.data.loans);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch loans');
    }
  };

  const handleRepay = async (loanId: string) => {
    try {
      const res = await axios.put(`/api/loan/repay/${loanId}`);
      setMessage(res.data.message);
      fetchLoans(); // Refresh list after repayment
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to repay loan');
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Your Loan Applications</h2>

      {message && <p className="text-green-600 mb-4">{message}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {loans.length === 0 ? (
        <p>No loan applications found.</p>
      ) : (
        <div className="overflow-auto border rounded">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Purpose</th>
                <th className="px-4 py-2 text-left">Duration</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan._id} className="border-t">
                  <td className="px-4 py-2">Rs. {loan.amount}</td>
                  <td className="px-4 py-2">{loan.purpose || loan.reason}</td>
                  <td className="px-4 py-2">{loan.duration || '-'}</td>
                  <td className="px-4 py-2 capitalize text-blue-700">{loan.status}</td>
                  <td className="px-4 py-2">
                    {new Date(loan.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    {loan.status === 'approved' ? (
                      <button
                        onClick={() => handleRepay(loan._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Repay
                      </button>
                    ) : (
                      <span className="bg-gray-300 text-gray-700 px-3 py-1 rounded">
                        {loan.status === 'repaid' ? 'Repaid' : 'Not Approved'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
