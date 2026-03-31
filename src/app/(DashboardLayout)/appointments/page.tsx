'use client';

import { fetchAppointments } from '../../../../redux/profile/profileThunks';
import { useAppDispatch, useAppSelector } from '../../../../redux/store/hook';
import { useEffect, useRef, useState } from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { FiCalendar } from 'react-icons/fi';

import AppointmentCard from '../components/shared/AppointmentCard';
import AppointmentCardSkeleton from '../components/shared/AppointmentCardSkeleton';

const AppointmentsPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { appointments, loading, meta } = useAppSelector((state) => state.profile);
  const totalPages = meta?.totalPages;

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');

  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search_term') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  const searchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    dispatch(fetchAppointments({ status, page, limit: 5 }));
  }, [dispatch, page, status]);
  
  return (
    <div className="min-h-screen">
      <div className="mx-auto">
        <div className="mx-auto max-w-6xl space-y-3 pb-3 pt-2 sm:px-0">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center sm:text-left">
            My Appointments
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-white p-3 rounded-lg shadow-sm border">
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-gray-50 flex-1">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search Appointment number..."
                className="bg-transparent outline-none flex-1 text-sm"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setTimeout(() => searchRef.current?.focus(), 0);
                }}
              />
            </div>

            <select
              className="border rounded-lg px-3 py-2 bg-gray-50 text-gray-700 text-sm w-full sm:w-48"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Status</option>
              <option value="PAYMENT_PENDING">Payment Pending</option>
              <option value="BOOKED">Booked</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <AppointmentCardSkeleton key={i} />
            ))}
          </div>
        ) : appointments?.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <FiCalendar className="mx-auto text-slate-300 mb-3" size={40} />
            <p className="text-slate-500 font-medium">No appointments found</p>
            <p className="text-slate-400 text-sm mt-1">Try changing the filter above</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {appointments?.map((appt: any) => (
              <AppointmentCard
                key={appt.id}
                appt={appt}
                onViewDetails={(id) => router.push(`/appointments/${id}`)}
              />
            ))}
          </div>
        )}

        {!loading && appointments?.length > 0 && (
          <div className="flex justify-center mt-8">
            <Stack spacing={2}>
              <Pagination
                count={totalPages ?? 1}
                page={page}
                onChange={(_, value) => setPage(value)}
                shape="rounded"
                variant="outlined"
                color="primary"
              />
            </Stack>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;