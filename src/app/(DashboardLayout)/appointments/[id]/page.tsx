'use client';

import { fetchAppointmentDetail, updateAppointmentStatus } from '../../../../../redux/profile/profileThunks';
import { useAppDispatch, useAppSelector } from '../../../../../redux/store/hook';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    FiArrowLeft,
    FiUser,
    FiCalendar,
    FiClock,
    FiMonitor,
    FiHome,
    FiPhone,
    FiMail,
    FiMapPin,
    FiFileText,
    FiUsers,
    FiCreditCard,
    FiCheckCircle,
    FiXCircle,
    FiActivity,
    FiClipboard,
    FiZap,
} from 'react-icons/fi';
import Prescription from './components/Prescription';
import { FaVideo } from "react-icons/fa6";
import { StartCall } from '../../../../../redux/videocall/videocallThunks';


function formatDate(dateStr?: string) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

function formatDateTime(dateStr?: string) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

const SectionCard = ({
    title,
    subtitle,
    icon,
    iconClassName,
    children,
    className = '',
}: {
    title: string;
    subtitle?: string;
    icon: React.ReactNode;
    iconClassName?: string;
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={`rounded-[28px] border  border-slate-100 bg-white p-5 shadow-sm ${className}`}>
            <div className="mb-4 flex items-center gap-2">
                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClassName || 'bg-primary/10 text-primary'
                        }`}
                >
                    {icon}
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-900">{title}</h3>
                    {subtitle ? <p className="text-xs text-slate-500">{subtitle}</p> : null}
                </div>
            </div>
            {children}
        </div>
    );
};

const InfoBlock = ({
    label,
    value,
    icon,
    valueClassName = 'text-sm font-bold text-slate-900',
}: {
    label: string;
    value: React.ReactNode;
    icon?: React.ReactNode;
    valueClassName?: string;
}) => {
    return (
        <div className="rounded-2xl bg-slate-50 p-4">
            <div className="mb-1 flex items-center gap-1.5">
                {icon}
                <p className="text-xs text-slate-400">{label}</p>
            </div>
            <p className={valueClassName}>{value}</p>
        </div>
    );
};

const AppointmentDetailPage = () => {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const appointmentId = params?.id;
    const dispatch = useAppDispatch();

    const { appointment, loading } = useAppSelector((state) => state.profile);

    const [localStatus, setLocalStatus] = useState<string>('');

    useEffect(() => {
        if (appointmentId) {
            dispatch(fetchAppointmentDetail(appointmentId));
        }
    }, [appointmentId, dispatch]);

    useEffect(() => {
        if (appointment?.status) {
            setLocalStatus(appointment.status);
        }
    }, [appointment]);

    const [callPayload, setCallPayload] = useState(null);


    // ✅ Just this — no socket needed here
    const startCallHandler = () => {
        router.push(`/appointments/${appointmentId}/video-call`);
    };


    const activeStatus = localStatus || appointment?.status;

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl animate-pulse space-y-5">
                    <div className="h-8 w-40 rounded-xl bg-slate-200" />
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                        <div className="xl:col-span-8 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="h-72 rounded-3xl border border-slate-100 bg-white" />
                                <div className="h-72 rounded-3xl border border-slate-100 bg-white" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="h-72 rounded-3xl border border-slate-100 bg-white" />
                                <div className="h-72 rounded-3xl border border-slate-100 bg-white" />
                            </div>
                            <div className="h-52 rounded-3xl border border-slate-100 bg-white" />
                        </div>
                        <div className="xl:col-span-4 space-y-5">
                            <div className="h-64 rounded-3xl border border-slate-100 bg-white" />
                            <div className="h-72 rounded-3xl border border-slate-100 bg-white" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!appointment) return null;

    const doc = appointment.doctor;

    const canTakeAction =
        activeStatus === 'BOOKED' ||
        activeStatus === 'PENDING' ||
        activeStatus === 'PAYMENT_PENDING';

    const handleComplete = async () => {
        await dispatch(updateAppointmentStatus({ appointmentId, status: 'COMPLETED', })).unwrap();
    };

    const handleCancel = async () => {
        await dispatch(updateAppointmentStatus({ appointmentId, status: 'CANCELLED', })).unwrap();
    };

    return (
        <div className="min-h-screen">
            <div className="mx-auto space-y-5">
                <div className="flex items-center justify-between gap-3">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-primary/30 hover:text-primary"
                    >
                        <FiArrowLeft size={18} />
                    </button>
                    {
                        appointment.consultation_type === 'ONLINE' &&
                        <div onClick={startCallHandler} className="flex items-center gap-1 px-5 py-3.5 rounded-xl bg-primary text-white  cursor-pointer  transition ">
                            <FaVideo /> <div>Start</div>
                        </div>
                    }
                </div>


                <div className="grid grid-cols-1 xl:grid-cols-8 gap-5">
                    <div className="xl:col-span-8 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <SectionCard
                                title="Doctor Information"
                                subtitle="Assigned medical professional"
                                icon={<FiUser size={17} />}
                                iconClassName="bg-primary/10 text-primary"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-primary/10">
                                        <img
                                            src={
                                                doc?.profile_image_url ||
                                                'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1200&auto=format&fit=crop'
                                            }
                                            alt={doc?.full_name || 'Doctor'}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-base font-bold text-slate-900">{doc?.full_name || '—'}</p>
                                        <p className="text-sm text-slate-500">{doc?.clinic_name || '—'}</p>
                                        <p className="mt-1 inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                                            {doc?.experience ? `${doc.experience} yrs experience` : 'Experience not available'}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 space-y-3">
                                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                                        <FiMail className="shrink-0 text-primary" size={16} />
                                        <p className="break-all text-sm text-slate-700">{doc?.email || '—'}</p>
                                    </div>

                                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                                        <FiPhone className="shrink-0 text-primary" size={16} />
                                        <p className="text-sm text-slate-700">{doc?.phone_number || '—'}</p>
                                    </div>

                                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                                        <FiMapPin className="shrink-0 text-primary" size={16} />
                                        <p className="text-sm text-slate-700">{doc?.city || doc?.clinic_city || '—'}</p>
                                    </div>

                                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                                        <FiHome className="shrink-0 text-primary" size={16} />
                                        <p className="text-sm text-slate-700">
                                            {doc?.clinic_name || '—'}
                                            {doc?.clinic_city ? `, ${doc.clinic_city}` : ''}
                                        </p>
                                    </div>
                                </div>
                            </SectionCard>

                            <SectionCard
                                title="Appointment Schedule"
                                subtitle="Booking timing and mode"
                                icon={<FiCalendar size={17} />}
                                iconClassName="bg-blue-100 text-blue-700"
                            >
                                <div className="space-y-3">
                                    <InfoBlock
                                        label="Appointment Date"
                                        value={formatDate(appointment.appointment_date)}
                                        icon={<FiCalendar size={13} />}
                                    />
                                    <InfoBlock
                                        label="Appointment Time"
                                        value={appointment.appointment_time || '—'}
                                        icon={<FiClock size={13} />}
                                    />
                                    <InfoBlock
                                        label="Consultation Type"
                                        value={appointment.consultation_type || '—'}
                                        icon={
                                            appointment.consultation_type === 'ONLINE' ? (
                                                <FiMonitor size={13} />
                                            ) : (
                                                <FiHome size={13} />
                                            )
                                        }
                                        valueClassName={`text-sm font-bold ${appointment.consultation_type === 'ONLINE'
                                            ? 'text-sky-600'
                                            : 'text-violet-600'
                                            }`}
                                    />
                                    <InfoBlock
                                        label="Created At"
                                        value={formatDateTime(appointment.created_at)}
                                        icon={<FiActivity size={13} />}
                                    />
                                </div>
                            </SectionCard>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <SectionCard
                                title="Patient Information"
                                subtitle="Primary appointment holder"
                                icon={<FiUsers size={17} />}
                                iconClassName="bg-indigo-100 text-indigo-700"
                            >
                                <div className="grid grid-cols-2 gap-3">
                                    <InfoBlock
                                        label="Patient Name"
                                        value={appointment.patient_name || '—'}
                                        icon={<FiUser size={14} className="text-primary" />}
                                    />
                                    <InfoBlock
                                        label="Age"
                                        value={appointment.patient_age ? `${appointment.patient_age} years` : '—'}
                                        icon={<FiCalendar size={14} className="text-primary" />}
                                    />
                                    <InfoBlock
                                        label="Gender"
                                        value={appointment.patient_gender || '—'}
                                        icon={<FiUsers size={14} className="text-primary" />}
                                    />
                                    <InfoBlock
                                        label="Fee"
                                        value={`₹${appointment.final_amount || doc?.consultation_fee || '—'}`}
                                        icon={<FiCreditCard size={14} className="text-primary" />}
                                    />
                                </div>
                            </SectionCard>

                            <SectionCard
                                title="Payment Summary"
                                subtitle="Fee and payment details"
                                icon={<FiCreditCard size={17} />}
                                iconClassName="bg-emerald-100 text-emerald-700"
                            >
                                <div className="space-y-3">
                                    <div className="rounded-2xl bg-slate-50 p-4">
                                        <p className="text-xs text-slate-400">Final Amount</p>
                                        <p className="mt-1 text-2xl font-bold text-slate-900">
                                            ₹{appointment.final_amount || doc?.consultation_fee || '—'}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <InfoBlock
                                            label="Payment Status"
                                            value={appointment.payment_status || '—'}
                                            valueClassName={`text-sm font-bold ${appointment.payment_status === 'PAID' ? 'text-emerald-600' : 'text-rose-600'
                                                }`}
                                        />
                                        <InfoBlock
                                            label="Booking Status"
                                            value={activeStatus?.replace(/_/g, ' ')}
                                            valueClassName="text-sm font-bold text-slate-800"
                                        />
                                    </div>
                                </div>
                            </SectionCard>

                        </div>

                        {/* <SectionCard
                            title="Prescription"
                            subtitle="uploaded Prescription or generated Prescription "
                            icon={<FiFileText size={17} />}
                            iconClassName="bg-fuchsia-100 text-fuchsia-700"
                        >
                            {appointment.history_meds && appointment.history_meds.length > 0 ? (
                                <div className="space-y-3">
                                    {appointment.history_meds.map((item: any, index: number) => (
                                        <div
                                            key={item.id || index}
                                            className="rounded-2xl border border-primary/15 bg-primary/5 p-4 transition hover:bg-primary/10"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                        <FiFileText size={18} />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold text-slate-900">
                                                            Prescription {index + 1}
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            Uploaded by {item.uploaded_by || '—'}
                                                        </p>
                                                        <p className="mt-1 text-xs text-slate-400">
                                                            {new Date(item.created_at).toLocaleString('en-IN', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>

                                                <a
                                                    href={item.file_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-white text-primary transition hover:bg-primary/10"
                                                    title="Open file"
                                                >
                                                    <FiExternalLink size={16} />
                                                </a>
                                            </div>

                                            <div className="mt-4 flex flex-wrap gap-2">
                                                <a
                                                    href={item.file_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
                                                >
                                                    <FiEye size={15} />
                                                    View Prescription
                                                </a>

                                                <button
                                                    type="button"
                                                    onClick={() => router.push(`/doctor-admin/prescriptions/${item.id}`)}
                                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                                                >
                                                    <FiArrowUpRight size={15} />
                                                    Open Detail Page
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-sm text-slate-500">
                                        No document has been attached for this appointment.
                                    </p>
                                </div>
                            )}
                        </SectionCard> */}

                        <SectionCard
                            title="Prescription"
                            subtitle="uploaded Prescription or generated Prescription "
                            icon={<FiFileText size={17} />}
                            iconClassName="bg-fuchsia-100 text-fuchsia-700"
                        >
                            <Prescription />
                        </SectionCard>



                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <SectionCard
                                title="Symptoms / Notes"
                                subtitle="Patient-provided information"
                                icon={<FiClipboard size={17} />}
                                iconClassName="bg-amber-100 text-amber-700"
                            >
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="whitespace-pre-line break-words text-sm leading-7 text-slate-700">
                                        {appointment.symptoms || 'No symptoms or notes were added for this appointment.'}
                                    </p>
                                </div>
                            </SectionCard>

                            <SectionCard
                                title="Appointment Action"
                                subtitle="Mark this booked appointment as completed or cancelled"
                                icon={<FiZap size={18} />}
                                iconClassName="bg-primary/10 text-primary"
                                className="xl:sticky xl:top-5"
                            >
                                <div className="space-y-3">
                                    <button
                                        onClick={handleComplete}
                                        disabled={!canTakeAction}
                                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                                    >
                                        <FiCheckCircle size={18} />
                                        {'Mark as Completed'}
                                    </button>

                                    <button
                                        onClick={handleCancel}
                                        disabled={!canTakeAction}
                                        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                                    >
                                        <FiXCircle size={18} />
                                        {'Cancel Appointment'}
                                    </button>
                                </div>

                                {!canTakeAction && (
                                    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                                        <p className="text-xs font-medium text-slate-600">
                                            Action is disabled because this appointment already has a final status.
                                        </p>
                                    </div>
                                )}
                            </SectionCard>

                        </div>
                    </div>


                </div>
            </div>

        </div>
    );
};

export default AppointmentDetailPage;