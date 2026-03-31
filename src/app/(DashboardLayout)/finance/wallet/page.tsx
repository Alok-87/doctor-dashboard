'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../redux/store/hook';
import { getLedger, getWallet } from '../../../../../redux/wallet/walletThunks';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import {
    Wallet,
    ArrowDownLeft,
    ArrowUpRight,
    Lock,
    Unlock,
    Receipt,
} from 'lucide-react';
import { FaCoins } from 'react-icons/fa';
import PayoutModal from './components/PayoutModal';

const Page = () => {
    const dispatch = useAppDispatch();
    const [page, setPage] = useState(1);
    const [openWithdrawModal, setOpenWithdrawModal] = useState(false);
    const limit = 5;

    useEffect(() => {
        dispatch(getWallet({ page, limit }));
    }, [dispatch, page]);

    const { wallet, loading } = useAppSelector((state) => state.wallet);

    const totalPages = wallet?.meta.totalPages ?? 1;
    const transactions = wallet?.transactions ?? [];

    const totalCredit = useMemo(() => {
        return transactions
            .filter((item: any) => item.type === 'CREDIT')
            .reduce((sum: number, item: any) => sum + Number(item.amount || 0), 0);
    }, [transactions]);

    const totalDebit = useMemo(() => {
        return transactions
            .filter((item: any) => item.type === 'DEBIT')
            .reduce((sum: number, item: any) => sum + Number(item.amount || 0), 0);
    }, [transactions]);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getTypeStyles = (type: string) => {
        if (type === 'CREDIT') {
            return {
                badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                iconWrap: 'bg-emerald-100 text-emerald-600',
                icon: <ArrowDownLeft size={18} />,
            };
        }

        return {
            badge: 'bg-rose-50 text-rose-700 border-rose-200',
            iconWrap: 'bg-rose-100 text-rose-600',
            icon: <ArrowUpRight size={18} />,
        };
    };

    return (
        <div className="min-h-screen">
            <div className="mx-auto max-w-7xl space-y-6">

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Available Balance</p>
                                <h3 className="mt-3 text-3xl font-bold text-slate-900">
                                    ₹{Number(wallet?.balance || 0).toLocaleString('en-IN')}
                                </h3>
                            </div>
                            <div className="rounded-2xl bg-blue-100 p-3 text-blue-600">
                                <Wallet className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="mt-5 pt-5 border-t border-slate-100">
                            <button
                                onClick={() => setOpenWithdrawModal(true)}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
                            >
                                <Receipt className="h-4 w-4" />
                                Withdraw Funds
                            </button>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Wallet Status</p>
                                <h3 className="mt-3 text-2xl font-bold text-slate-900">
                                    {wallet?.is_frozen ? 'Frozen' : 'Active'}
                                </h3>
                            </div>
                            <div
                                className={`rounded-2xl p-3 ${wallet?.is_frozen
                                    ? 'bg-rose-100 text-rose-600'
                                    : 'bg-emerald-100 text-emerald-600'
                                    }`}
                            >
                                {wallet?.is_frozen ? (
                                    <Lock className="h-5 w-5" />
                                ) : (
                                    <Unlock className="h-5 w-5" />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Total Credits</p>
                                <h3 className="mt-3 text-2xl font-bold text-emerald-700">
                                    ₹{Number(totalCredit || 0).toLocaleString('en-IN')}
                                </h3>
                            </div>
                            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600">
                                <ArrowDownLeft className="h-5 w-5" />
                            </div>
                        </div>
                    </div>

                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
                    <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Recent Transactions</h2>
                            <p className="text-sm text-slate-500">Latest wallet credit and debit activity</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <div className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                                Credit: ₹{Number(totalCredit || 0).toLocaleString('en-IN')}
                            </div>
                            <div className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
                                Debit: ₹{Number(totalDebit || 0).toLocaleString('en-IN')}
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((item) => (
                                <div
                                    key={item}
                                    className="h-40 sm:h-32 animate-pulse rounded-3xl border border-slate-200 bg-slate-100"
                                />
                            ))}
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                            <p className="text-sm text-slate-500">No transactions found.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {transactions.map((txn: any) => {
                                const isCredit = txn.type === 'CREDIT';
                                const isExpired =
                                    txn.type === 'DEBIT' ||
                                    String(txn.description || '').toLowerCase().includes('expired');

                                const iconWrapClass = isCredit
                                    ? 'bg-emerald-100 text-emerald-600'
                                    : isExpired
                                        ? 'bg-orange-100 text-orange-500'
                                        : 'bg-rose-100 text-rose-600';

                                const amountClass = isCredit
                                    ? 'text-emerald-600'
                                    : isExpired
                                        ? 'text-orange-500'
                                        : 'text-rose-600';


                                return (
                                    <div
                                        key={txn.id}
                                        className="w-full border-b border-slate-200 bg-white px-3 py-5 sm:px-4 md:px-5"
                                    >
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                                                <div
                                                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${iconWrapClass}`}
                                                >
                                                    {<FaCoins size={16} />}
                                                </div>

                                                <div className="min-w-0">
                                                    <h3 className="text-md font-semibold leading-tight text-slate-900">
                                                        Transaction
                                                    </h3>

                                                    <p className="mt-1 text-md font-semibold    text-slate-500">
                                                        {formatDate(txn.created_at)}
                                                    </p>

                                                    <p className="mt-1 break-words text-sm text-slate-500">
                                                        <span className="font-medium text-slate-600">note :</span>{' '}
                                                        {txn.description || 'No description available'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="shrink-0 pl-14 text-left sm:pl-0 sm:text-right space-y-2">
                                                <p className={`text-md font-semibold ${amountClass}`}>
                                                    {isCredit ? '+' : ''}
                                                    {Number(txn.amount || 0).toFixed(2)}
                                                </p>
                                                {txn.settlement_proof && (
                                                    <a
                                                        href={txn.settlement_proof}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95"
                                                    >
                                                        <Receipt className="h-3.5 w-3.5" />
                                                        View Receipt
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {!loading && transactions.length > 0 && (
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
            <PayoutModal
                open={openWithdrawModal}
                setOpenWithdrawModal={setOpenWithdrawModal}
            />

        </div>
    );
};

export default Page;