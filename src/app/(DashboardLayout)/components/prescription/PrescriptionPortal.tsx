import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../../../redux/store/store';
import { useAppSelector, useAppDispatch } from '../../../../../redux/store/hook';
import { getProfile } from '../../../../../redux/profile/profileThunks';
import { Button } from '../ui/button';
import { Select, Option } from '../ui/select';
import { Dialog, DialogBody, DialogTitle, DialogActions } from '../ui/dialog';
import { Text as AppText } from '../ui/text';
import { Input } from '../ui/input';
import GeneratePrescriptionButton from './GeneratePrescriptionButton';
import CustomDatePicker from '../ui/CustomDatePicker';
import SearchBar from '../ui/SearchBar';

interface PrescriptionPortalModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderNo: string;
    patient?: {
        name?: string;
        age?: string | number;
        gender?: string;
    };
    onGenerated?: (url: string) => void;
}

const TIME_SLOTS = ['Morning', 'Noon', 'Evening', 'Night'];

const PrescriptionPortalModal: React.FC<PrescriptionPortalModalProps> = ({
    isOpen,
    onClose,
    orderNo,
    patient,
    onGenerated,
}) => {
    const dispatch = useAppDispatch();
    const { user: profile, loading: userLoading } = useAppSelector((state) => state.profile);

    const [diagnosis, setDiagnosis] = useState('');
    const [remark, setRemark] = useState('');
    const [expireOn, setExpireOn] = useState<Date | null>(null);
    const [medicines, setMedicines] = useState<any[]>([]);

    const [doctorName, setDoctorName] = useState('');
    const [qualification, setQualification] = useState('');
    const [regNo, setRegNo] = useState('');
    const [signatureUrl, setSignatureUrl] = useState<string>('');

    useEffect(() => {
        if (isOpen && !profile) {
            dispatch(getProfile());
        }
    }, [isOpen, profile, dispatch]);

    useEffect(() => {
        if (profile) {
            setDoctorName(profile.fullName || '');
            setQualification(profile.degree || '');
            setRegNo(profile.registrationNumber || '');
            setSignatureUrl(profile.signatureImageUrl || '');
        }
    }, [profile]);



    const handleAddMedicine = (medicine: any) => {
        const baseSchedule = TIME_SLOTS.reduce((acc, time) => {
            acc[time] = { dosage: '0', timing: 'N/A', enabled: false };
            return acc;
        }, {} as Record<string, { dosage: string; timing: string; enabled: boolean }>);

        setMedicines((prev) => [
            ...prev,
            {
                name: medicine.productName,
                schedule: baseSchedule,
                route: 'Oral',
                duration: 5,
            },
        ]);
    };

    const updateSchedule = (
        i: number,
        time: string,
        key: 'dosage' | 'timing',
        value: string
    ) => {
        setMedicines((prev) =>
            prev.map((m, idx) =>
                idx === i
                    ? {
                        ...m,
                        schedule: {
                            ...m.schedule,
                            [time]: { ...m.schedule[time], [key]: value },
                        },
                    }
                    : m
            )
        );
    };

    const updateRoute = (i: number, route: string) => {
        setMedicines((prev) =>
            prev.map((m, idx) => (idx === i ? { ...m, route } : m))
        );
    };

    const updateDuration = (i: number, duration: number) => {
        setMedicines((prev) =>
            prev.map((m, idx) => (idx === i ? { ...m, duration } : m))
        );
    };

    const handleRemoveMedicine = (index: number) => {
        setMedicines((prev) => prev.filter((_, i) => i !== index));
    };

    const canGenerate = useMemo(() => {
        return medicines.length > 0 && diagnosis.trim().length > 0;
    }, [medicines, diagnosis]);

    return (
        <Dialog open={isOpen} onClose={onClose} size="6xl">
            <DialogTitle className="dark:text-gray-200">New Prescription</DialogTitle>

            <DialogBody className="max-h-[70vh] overflow-y-auto dark:bg-gray-900 dark:text-gray-200">
                <div className="bg-white dark:bg-gray-800 dark:text-gray-200 p-6 rounded-xl space-y-6 relative">

                    {/* Patient Summary (Read Only) */}
                    <div className="flex gap-6 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                        <div>
                            <AppText className="text-xs text-gray-500 dark:text-gray-400">Patient Name</AppText>
                            <AppText className="font-semibold">{patient?.name || 'N/A'}</AppText>
                        </div>
                        <div>
                            <AppText className="text-xs text-gray-500 dark:text-gray-400">Age</AppText>
                            <AppText className="font-semibold">{patient?.age || 'N/A'}</AppText>
                        </div>
                        <div>
                            <AppText className="text-xs text-gray-500 dark:text-gray-400">Gender</AppText>
                            <AppText className="font-semibold">{patient?.gender || 'N/A'}</AppText>
                        </div>
                    </div>

                    {/* Diagnosis */}
                    <div>
                        <AppText className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                            Diagnosis
                        </AppText>
                        <Input
                            placeholder="Enter diagnosis..."
                            value={diagnosis}
                            onChange={(e) => setDiagnosis(e.target.value)}
                            className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                        />
                    </div>

                    {/* Medicine Search */}
                    <div>
                        <AppText className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                            Search Medicine
                        </AppText>
                        <SearchBar onSelect={handleAddMedicine} />
                    </div>

                    {/* Medicine Table */}
                    {medicines.length > 0 && (
                        <div className="border dark:border-gray-700 rounded-lg">
                            <table className="w-full border-collapse text-sm dark:text-gray-200">
                                <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                                    <tr>
                                        <th className="p-2 text-left">Medicine</th>
                                        <th className="p-2 text-left">
                                            <div className="grid grid-cols-3 font-semibold">
                                                <span>Time</span>
                                                <span>Dosage</span>
                                                <span>Timing</span>
                                            </div>
                                        </th>
                                        <th className="p-2">Route</th>
                                        <th className="p-2">Duration</th>
                                        <th className="p-2"></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {medicines.map((m, i) => (
                                        <tr key={i} className="border-t dark:border-gray-700">
                                            <td className="p-2 font-medium dark:text-gray-100">{m.name}</td>
                                            <td className="p-2">
                                                <table className="w-full text-sm">
                                                    <tbody>
                                                        {TIME_SLOTS.map((t) => (
                                                            <tr key={t}>
                                                                <td className="p-1 font-medium w-1/3 dark:text-gray-300 flex items-center gap-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={m.schedule[t].enabled ?? true}
                                                                        onChange={(e) => {
                                                                            const enabled = e.target.checked;
                                                                            setMedicines((prev) =>
                                                                                prev.map((med, idx) =>
                                                                                    idx === i
                                                                                        ? {
                                                                                            ...med,
                                                                                            schedule: {
                                                                                                ...med.schedule,
                                                                                                [t]: { ...med.schedule[t], enabled },
                                                                                            },
                                                                                        }
                                                                                        : med
                                                                                )
                                                                            );
                                                                        }}
                                                                    />
                                                                    <span className={m.schedule[t].enabled === false ? 'text-gray-400' : ''}>{t}</span>
                                                                </td>
                                                                <td className="p-1 w-1/3">
                                                                    <Select
                                                                        value={m.schedule[t].dosage}
                                                                        disabled={m.schedule[t].enabled === false}
                                                                        onChange={(e: any) => updateSchedule(i, t, 'dosage', e.target.value)}
                                                                        className={`text-xs dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 ${m.schedule[t].enabled === false ? 'opacity-50' : ''}`}
                                                                    >
                                                                        <Option value="0">0</Option>
                                                                        <Option value="0.5">0.5</Option>
                                                                        <Option value="1">1</Option>
                                                                        <Option value="1.5">1.5</Option>
                                                                        <Option value="2">2</Option>
                                                                    </Select>
                                                                </td>
                                                                <td className="p-1 w-1/3">
                                                                    <Select
                                                                        value={m.schedule[t].timing}
                                                                        disabled={m.schedule[t].enabled === false}
                                                                        onChange={(e: any) => updateSchedule(i, t, 'timing', e.target.value)}
                                                                        className={`text-xs dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 ${m.schedule[t].enabled === false ? 'opacity-50' : ''}`}
                                                                    >
                                                                        <Option value="Before Meal">Before Meal</Option>
                                                                        <Option value="After Meal">After Meal</Option>
                                                                        <Option value="N/A">N/A</Option>
                                                                    </Select>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </td>
                                            <td className="p-2 align-top">
                                                <Select
                                                    value={m.route}
                                                    onChange={(e: any) => updateRoute(i, e.target.value)}
                                                    className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                                                >
                                                    <Option value="Oral">Oral</Option>
                                                    <Option value="Injection">Injection</Option>
                                                    <Option value="Topical">Topical</Option>
                                                    <Option value="Other">Other</Option>
                                                </Select>
                                            </td>
                                            <td className="p-2">
                                                <Input
                                                    type="number"
                                                    value={m.duration}
                                                    onChange={(e) => updateDuration(i, parseInt(e.target.value) || 0)}
                                                    className="w-10 text-center dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                                                    min={1}
                                                />
                                            </td>
                                            <td className="p-2 text-center">
                                                <Button outline onClick={() => handleRemoveMedicine(i)} className="text-red-600 hover:text-red-800 dark:text-red-400">✕</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Remarks + Expiry */}
                    <div className="grid sm:grid-cols-2 grid-cols-1 gap-2">
                        <div>
                            <AppText className="text-sm text-gray-600 dark:text-gray-300 mb-1">Remark</AppText>
                            <Input
                                placeholder="Enter Remark..."
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
                                className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                            />
                        </div>
                        <div>
                            <AppText className="text-sm text-gray-600 dark:text-gray-300 mb-1">Expire On</AppText>
                            <CustomDatePicker
                                minDate={new Date()}
                                placeholder="Select Date"
                                onChange={(date) => setExpireOn(date)}
                                value={expireOn}
                            />
                        </div>
                    </div>

                    {/* Signature */}
                    <div>
                        <AppText className="text-sm text-gray-600 dark:text-gray-300 mb-1">Doctor’s Signature</AppText>
                        <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-gray-50 dark:bg-gray-700 w-[450px]">
                            {signatureUrl ? (
                                <img src={signatureUrl} alt="Doctor signature" className="rounded-md bg-white dark:bg-gray-600 max-w-full h-auto" />
                            ) : (
                                <div className="text-sm text-gray-500 dark:text-gray-300 p-4">Signature not available in your profile.</div>
                            )}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 rounded-md p-3">
                        <div className="font-semibold mb-1">Legend</div>
                        <div className="space-y-1">
                            <div>Time: Morning, Noon, Evening, Night</div>
                            <div>Dosage: quantity per intake (.5, 1, 1.5, 2)</div>
                            <div>Timing: Before Meal, After Meal, or N/A</div>
                            <div>Route: Oral / Injection / Topical / Other</div>
                            <div>Duration: number of days</div>
                        </div>
                    </div>
                </div>
            </DialogBody>

            <DialogActions className="flex justify-between dark:bg-gray-900">
                <Button outline onClick={onClose}>Close</Button>
                <GeneratePrescriptionButton
                    onGenerateSuccess={(url) => {
                        onGenerated && onGenerated(url);
                        setDiagnosis('');
                        setRemark('');
                        setExpireOn(null);
                        setMedicines([]);
                        onClose();
                    }}
                    data={{
                        orderNo,
                        doctorName,
                        qualification,
                        regNo,
                        patient,
                        diagnosis,
                        medicines,
                        signatureUrl,
                        remark,
                        expireOn,
                    }}
                    disabled={!canGenerate || userLoading}
                />
            </DialogActions>
        </Dialog>
    );
};

export default PrescriptionPortalModal;
