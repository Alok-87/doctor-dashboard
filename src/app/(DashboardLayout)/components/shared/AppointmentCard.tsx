'use client';

import { FiCalendar, FiClock, FiUser, FiMonitor, FiHome, FiChevronRight, FiDollarSign } from 'react-icons/fi';
import { FaUserInjured } from 'react-icons/fa';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

interface AppointmentCardProps {
  appt: any;
  onViewDetails: (id: string) => void;
}

const AppointmentCard = ({ appt, onViewDetails }: AppointmentCardProps) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group p-5">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <FiUser className="text-primary" size={16} />
          </div>
          <div>
            <p className="text-xs font-bold text-primary">#{appt.id}</p>
            <h3 className="text-sm font-bold text-slate-800 leading-tight">
              {appt.doctor?.full_name ?? 'Doctor'}
            </h3>
          </div>
        </div>

        <span
          className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
            appt.status === 'PAYMENT_PENDING'
              ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
              : appt.status === 'BOOKED'
              ? 'bg-blue-50 text-primary border-blue-200'
              : appt.status === 'COMPLETED'
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-red-50 text-red-600 border-red-200'
          }`}
        >
          {appt.status?.replace(/_/g, ' ')}
        </span>
      </div>

      <div className="py-4 border-b border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 text-slate-400">
            <FiCalendar size={15} />
          </div>
          <div>
            <p className="text-xs text-slate-400">Appointment Date</p>
            <p className="text-sm font-semibold text-slate-700 mt-0.5">
              {formatDate(appt.appointment_date)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 text-slate-400">
            <FiClock size={15} />
          </div>
          <div>
            <p className="text-xs text-slate-400">Time</p>
            <p className="text-sm font-semibold text-slate-700 mt-0.5">
              {appt.appointment_time}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 text-slate-400">
            {appt.consultation_type === 'ONLINE' ? <FiMonitor size={15} /> : <FiHome size={15} />}
          </div>
          <div>
            <p className="text-xs text-slate-400">Consultation</p>
            <p className="text-sm font-semibold mt-0.5 text-primary">
              {appt.consultation_type}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 text-slate-400">
            <FiDollarSign size={15} />
          </div>
          <div>
            <p className="text-xs text-slate-400">Final Amount</p>
            <p className="text-sm font-semibold text-slate-700 mt-0.5">
              ₹{appt.final_amount || appt.total_amount}
            </p>
          </div>
        </div>
      </div>

      <div className="pt-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-md text-black">
            <FaUserInjured size={18} className="text-slate-400" />
            {appt.patient_name}
          </span>
        </div>

        <button
          onClick={() => onViewDetails(appt.id)}
          className="flex items-center gap-1 text-sm font-semibold text-primary transition cursor-pointer"
        >
          View Details
          <FiChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};

export default AppointmentCard;