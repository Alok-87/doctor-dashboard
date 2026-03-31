'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { FaRupeeSign } from 'react-icons/fa';
import { HiMiniXMark } from 'react-icons/hi2';
import { useAppDispatch } from '../../../../../../redux/store/hook';
import { payoutReq } from '../../../../../../redux/wallet/walletThunks';

type WithdrawForm = {
    amount: number;
};

type Props = {
    open: boolean;
    setOpenWithdrawModal: (value: boolean) => void;
};

const PayoutModal: React.FC<Props> = ({ open, setOpenWithdrawModal }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<WithdrawForm>();

    if (!open) return null;

    const dispatch = useAppDispatch();
    const onSubmit = async (data: WithdrawForm) => {
        try {
            await dispatch(payoutReq(data)).unwrap();
        } catch (error) {
            console.error('Payout failed:', error);
        } finally {
            // ✅ ALWAYS runs
            setOpenWithdrawModal(false);
            reset();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="w-full max-w-md rounded-3xl bg-gray-100 p-6 shadow-lg">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <FaRupeeSign className="text-primary" />
                        Withdraw Money
                    </h2>
                    <button onClick={() => setOpenWithdrawModal(false)}>
                        <HiMiniXMark size={22} className="text-slate-500 hover:text-black cursor-pointer" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-600">
                            Enter Amount
                        </label>

                        <div className="mt-2 flex items-center border rounded-xl px-3">
                            <FaRupeeSign className="text-slate-400" />
                            <input
                                type="number"
                                placeholder="500"
                                className="w-full p-3 outline-none"
                                {...register('amount', {
                                    required: 'Amount is required',
                                    valueAsNumber: true, // ✅ IMPORTANT FIX
                                    min: {
                                        value: 1,
                                        message: 'Amount must be greater than 0',
                                    },
                                })}
                            />
                        </div>

                        {errors.amount && (
                            <p className="text-xs text-red-500 mt-1">
                                {errors.amount.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-xl bg-primary text-white py-3 font-medium hover:bg-emerald-700 transition"
                    >
                        Withdraw
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PayoutModal;