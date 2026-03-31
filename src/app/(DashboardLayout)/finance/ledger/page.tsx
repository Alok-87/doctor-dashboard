'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../redux/store/hook';
import { getLedger } from '../../../../../redux/wallet/walletThunks';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import {
  FaRupeeSign,
  FaUserInjured,
  FaCalendarAlt,
  FaClock,
  FaWallet,
  FaFileInvoiceDollar,
} from 'react-icons/fa';
import { MdPendingActions, MdDoneAll } from 'react-icons/md';
import { HiMiniXCircle } from 'react-icons/hi2';

const Page = () => {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    dispatch(getLedger({ page, limit }));
  }, [dispatch, page]);

  const { ledger, loading } = useAppSelector((state) => state.wallet);
  console.log('ledger', ledger);

  const totalPages = ledger?.meta?.totalPages ?? 1; 

  const totalReceivable = useMemo(() => {
    return (ledger?.data || []).reduce(
      (sum: number, item: any) => sum + Number(item.doctor_receivable || 0),
      0
    );
  }, [ledger]);

  const totalAppointmentFee = useMemo(() => {
    return (ledger?.data || []).reduce(
      (sum: number, item: any) => sum + Number(item.appointment_fee || 0),
      0
    );
  }, [ledger]);

  const totalCommission = useMemo(() => {
    return (ledger?.data || []).reduce(
      (sum: number, item: any) => sum + Number(item.platform_commission || 0),
      0
    );
  }, [ledger]);

  const formatDate = (date: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getAppointmentStatusStyle = (status: string) => {
    switch (status) {
      case 'BOOKED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getSettlementStatusStyle = (status: string) => {
    switch (status) {
      case 'SETTLED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PENDING':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <MdDoneAll size={18} />;
      case 'CANCELLED':
        return <HiMiniXCircle size={18} />;
      default:
        return <MdPendingActions size={18} />;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl space-y-6">

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Appointment Fee</p>
                <h3 className="mt-3 text-2xl font-bold text-slate-900">
                  ₹{Number(totalAppointmentFee || 0).toLocaleString('en-IN')}
                </h3>
              </div>
              <div className="rounded-2xl bg-violet-100 p-3 text-violet-600">
                <FaFileInvoiceDollar className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Doctor Receivable</p>
                <h3 className="mt-3 text-2xl font-bold text-emerald-700">
                  ₹{Number(totalReceivable || 0).toLocaleString('en-IN')}
                </h3>
              </div>
              <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600">
                <FaRupeeSign className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Platform Commission</p>
                <h3 className="mt-3 text-2xl font-bold text-amber-700">
                  ₹{Number(totalCommission || 0).toLocaleString('en-IN')}
                </h3>
              </div>
              <div className="rounded-2xl bg-amber-100 p-3 text-amber-600">
                <FaRupeeSign className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Ledger Entries</p>
                <h3 className="mt-3 text-2xl font-bold text-slate-900">
                  0
                </h3>
              </div>
              <div className="rounded-2xl bg-sky-100 p-3 text-sky-600">
                <FaWallet className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Ledger History</h2>
              <p className="text-sm text-slate-500">
                Appointment-based receivable and settlement entries
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                Receivable: ₹{Number(totalReceivable || 0).toLocaleString('en-IN')}
              </div>
              <div className="rounded-xl bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700">
                Commission: ₹{Number(totalCommission || 0).toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-44 animate-pulse rounded-3xl border border-slate-200 bg-slate-100"
                />
              ))}
            </div>
          ) : !ledger || ledger.data.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center">
              <p className="text-sm text-slate-500">No ledger entries found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ledger?.data?.map((item: any) => (
                <div
                  key={item.appointment_id}
                  className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="flex min-w-0 items-start gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                          item.appointment?.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-600'
                            : item.appointment?.status === 'CANCELLED'
                            ? 'bg-rose-100 text-rose-600'
                            : 'bg-amber-100 text-amber-600'
                        }`}
                      >
                        {getStatusIcon(item.appointment?.status)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-semibold text-slate-900">
                            Appointment Settlement
                          </h3>

                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${getSettlementStatusStyle(
                              item.settlement_status
                            )}`}
                          >
                            {item.settlement_status}
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                          <span className="inline-flex items-center gap-2">
                            <FaUserInjured className="text-slate-400" size={13} />
                            {item.appointment?.patient_name || 'Unknown Patient'}
                          </span>

                          <span className="inline-flex items-center gap-2">
                            <FaCalendarAlt className="text-slate-400" size={13} />
                            {formatDate(item.appointment?.appointment_date)}
                          </span>

                          <span className="inline-flex items-center gap-2">
                            <FaClock className="text-slate-400" size={13} />
                            {item.appointment?.appointment_time || '-'}
                          </span>
                        </div>

                        <p className="mt-3 text-sm text-slate-500">
                          <span className="font-medium text-slate-600">Created:</span>{' '}
                          {formatDate(item.created_at)}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          <span className="font-medium text-slate-600">Wallet Credit Date:</span>{' '}
                          {item.wallet_credit_date ? formatDate(item.wallet_credit_date) : 'Not credited yet'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:w-[420px]">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">Appointment Fee</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          ₹{Number(item.appointment_fee || 0).toLocaleString('en-IN')}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">Doctor Receivable</p>
                        <p className="mt-1 text-sm font-semibold text-emerald-700">
                          ₹{Number(item.doctor_receivable || 0).toLocaleString('en-IN')}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">Platform Commission</p>
                        <p className="mt-1 text-sm font-semibold text-amber-700">
                          ₹{Number(item.platform_commission || 0).toLocaleString('en-IN')}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">Promotional Expense</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          ₹{Number(item.promotional_expense || 0).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && ledger && ledger.data.length > 0 && (
            <div className="mt-8 flex justify-center">
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
    </div>
  );
};

export default Page;