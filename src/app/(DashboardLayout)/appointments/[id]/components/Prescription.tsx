'use client';
import PrescriptionPortalModal from '@/app/(DashboardLayout)/components/prescription/PrescriptionPortal';
import { PhoneOutgoingIcon, PlusCircleIcon } from 'lucide-react';
import { useState } from 'react';
import { Text } from '@/app/(DashboardLayout)/components/ui/text';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { Button } from '../../../components/ui/button'
import { useAppSelector, useAppDispatch } from '../../../../../../redux/store/hook';
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/app/(DashboardLayout)/components/ui/dialog';
import DropzoneComponent from '@/app/(DashboardLayout)/components/ui/DropZone';
import { uploadPrescriptionToAppointment } from "../../../../../../redux/medicine/medicineThunks";


const Card = ({
    icon,
    title,
    className,
    children,
}: {
    icon?: React.ReactNode;
    title: string;
    className?: string;
    children: React.ReactNode;
}) => (
    <div
        className={`bg-white p-6 rounded-2xl ${className}`}
    >
        <div className="flex items-center gap-2 mb-4">
            {icon && <div className="p-2 bg-blue-50 rounded-lg text-blue-600">{icon}</div>}
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
        <div className="text-sm text-gray-700">{children}</div>
    </div>
);

const Prescription = () => {

    const { appointment } = useAppSelector((state) => state.profile)
    const [showAddDropzone, setShowAddDropzone] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [uploadedPrescriptions, setUploadedPrescriptions] = useState<string[]>([]);
    const dispatch = useAppDispatch();

    const handleAddPrescriptionSuccess = (url: string) => {
        handleUploadToAppointment(url);
    };

    const handleRemovePrescription = (index: number) => {
        setIsDirty(true);
        setUploadedPrescriptions((prev) => prev.filter((_, idx) => idx !== index));
    };

    const [isPrescriptionPortalOpen, setIsPrescriptionPortalOpen] = useState(false);

    const apiPrescriptions: string[] =
        appointment?.history_meds?.map((item: any) => item.file_url) || [];

    const allPrescriptions = [...apiPrescriptions, ...uploadedPrescriptions];

    const patientData = {
        name: appointment?.patient_name || appointment?.visitor?.full_name || 'N/A',
        age: appointment?.patient_age || appointment?.visitor?.age || 'N/A',
        gender: appointment?.patient_gender || appointment?.visitor?.gender || 'N/A',
    };

    const handleUploadToAppointment = async (url: string) => {
        if (!appointment?.id) return;

        setIsDirty(true);

        try {
            await dispatch(
                uploadPrescriptionToAppointment({
                    appointmentId: appointment.id,
                    file_url: url,
                })
            ).unwrap();

            // ✅ update UI after success
            setUploadedPrescriptions((prev) => [...prev, url]);
            // optional: close modal
            setShowAddDropzone(false);

        } catch (err) {
            console.error("Upload to appointment failed", err);
        }
    };

    return (
        <Card title="Prescriptions" icon={<PhotoIcon className="h-5 w-5" />} >
            <div className="flex  justify-between items-start mb-4">

                <div className="flex gap-4 overflow-x-auto">
                    {allPrescriptions.map((fileUrl: string, idx: number) => {
                        const isPdf = fileUrl.toLowerCase().endsWith('.pdf');
                        const validSrc = fileUrl.trim() || "/images/placeholder/placeholder_image.jpg";

                        return (
                            <div
                                key={idx}
                                className="relative min-w-[160px] border rounded-lg overflow-hidden hover:shadow-md"
                            >
                                <button
                                    onClick={() => handleRemovePrescription(idx)}
                                    className="absolute top-2 right-2 z-10 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5"
                                >
                                    ✕
                                </button>

                                {isPdf ? (
                                    <div
                                        onClick={() => window.open(fileUrl, "_blank")}
                                        className="flex flex-col justify-center items-center h-36 bg-gray-100 cursor-pointer"
                                    >
                                        <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 2v6h6" />
                                        </svg>
                                        <p className="text-xs text-gray-600 mt-1">PDF File</p>
                                    </div>
                                ) : (
                                    <img
                                        src={validSrc}
                                        alt={`Prescription ${idx + 1}`}
                                        className="w-full h-36 object-cover cursor-pointer"
                                        onClick={() => window.open(fileUrl, "_blank")}
                                    />
                                )}

                                <div className="p-2 text-center text-blue-600 text-sm font-medium">
                                    View Prescription {idx + 1}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className='flex gap-1.5 justify-center items-center'>

                    <Button
                        size="md"
                        prefixIcon={<PlusCircleIcon className="h-4 w-4" />}
                        onClick={() => setShowAddDropzone((prev) => !prev)}
                        className="flex items-center gap-2 p-1"
                        disabled={false}
                    >
                        Add Prescription
                    </Button>
                    <Button
                        size="md"
                        onClick={() => setIsPrescriptionPortalOpen(true)}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Generate New Prescription
                    </Button>
                    <PrescriptionPortalModal
                        isOpen={isPrescriptionPortalOpen}
                        onClose={() => setIsPrescriptionPortalOpen(false)}
                        patient={patientData}
                        orderNo={appointment?.id?.toString() || 'N/A'}
                        onGenerated={(url) => handleUploadToAppointment(url)}
                    />
                </div>

            </div>
            <Dialog open={showAddDropzone} onClose={() => setShowAddDropzone(false)} size="3xl">
                <DialogTitle>Add Prescription</DialogTitle>
                <DialogBody className="p-3">

                    <DropzoneComponent
                        accept={{ 'image/*': ['.jpg', '.jpeg', '.png'] }}
                        multiple
                        onFileUploadSuccess={handleAddPrescriptionSuccess}
                    />

                </DialogBody>
                <DialogActions>
                    <Button onClick={() => setShowAddDropzone(false)}>Close</Button>
                </DialogActions>
            </Dialog>


        </Card>
    )
}

export default Prescription