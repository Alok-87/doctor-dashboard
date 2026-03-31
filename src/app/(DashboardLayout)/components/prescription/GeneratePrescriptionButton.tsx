'use client';
import React, { useState } from 'react';
import { pdf, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import axios from 'axios';
import { Button } from '../ui/button';
import { Dialog, DialogBody, DialogTitle, DialogActions } from '../ui/dialog';
import { calculateAge } from '../utils/dateFormatter';
import axiosInstance from '../utils/axiosInstance';

// ---------- PDF Layout ----------
interface MedicineItem {
    name: string;
    maen: string;
    timing: string;
    route: string;
    duration: string;
}
interface PrescriptionData {
    doctorName: string;
    qualification: string;
    regNo: string;
    date: string;
    patient?: {
        name?: string;
        dob?: string;
        gender?: string;
        patientName?: string;
        otherPatientAge?: string;
    };
    orderNo?: string;
    diagnosis: string;
    medicines: MedicineItem[];
    signatureUrl?: string;
    remark?: string
    expireOn: Date | null
}

export const PrescriptionPDF = ({ data }: { data: PrescriptionData }) => {
    const styles = StyleSheet.create({
        page: {
            paddingTop: 25,
            paddingHorizontal: 30,
            fontFamily: 'Helvetica',
            fontSize: 10.5,
            color: '#0f2741',
            lineHeight: 1.4,
        },
        header: { position: 'relative', marginBottom: 16 },
        rxLogo: { position: 'absolute', top: 0, left: 0, width: 40, height: 40 },
        companyLogo: {
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 100,
            height: 40,
            objectFit: 'contain',
        },
        doctorRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 100,
            marginBottom: 4,
        },
        doctorLeft: { fontSize: 11, color: '#0f2741' },
        doctorRight: { textAlign: 'right', fontSize: 10, color: '#0f2741' },
        doctorName: { fontWeight: 'bold', fontSize: 12 },
        dashed: {
            marginVertical: 6,
            borderBottomWidth: 1,
            borderStyle: 'dashed',
            borderBottomColor: '#9fb2c2',
        },
        patientInfo: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 2,
        },
        bold: { fontWeight: 'bold' },
        diagnosis: { marginTop: 8, marginBottom: 6 },
        title: { fontWeight: 'bold', color: '#0d7ab7', marginBottom: 2, fontSize: 10.5 },
        diagText: { fontSize: 10, color: '#333' },
        table: { width: '100%', marginTop: 6, borderTopWidth: 0.8, borderColor: '#2c5aa0' },
        tableHeader: {
            flexDirection: 'row',
            backgroundColor: '#f0f4f9',
            borderBottomWidth: 0.8,
            borderColor: '#2c5aa0',
            paddingVertical: 4,
        },
        th: { fontWeight: 'bold', fontSize: 9.5, color: '#2c5aa0' },
        thMed: { width: '30%' },
        thMAEN: { width: '14%' },
        thTiming: { width: '26%' },
        thRoute: { width: '10%' },
        thDur: { width: '10%', textAlign: 'right' },
        tr: {
            flexDirection: 'row',
            borderBottomWidth: 0.5,
            borderBottomColor: '#e0e0e0',
            paddingVertical: 5,
        },
        tdMed: {
            width: '30%',
            fontSize: 9.8,
            wordBreak: 'break-word',
            paddingRight: 5
        },
        tdMAEN: { width: '14%', fontSize: 9.8 },
        tdTiming: { width: '26%', fontSize: 9.8 },
        tdRoute: { width: '10%', fontSize: 9.8 },
        tdDur: { width: '10%', textAlign: 'right', fontSize: 9.8 },
        legend: { marginTop: 4, fontSize: 9.5, color: '#58667a', lineHeight: 1.3 },
        legendBox: { marginTop: 20 },
        commentsTitle: {
            marginTop: 12,
            fontWeight: 'bold',
            color: '#0d7ab7',
            fontSize: 10.5,
            marginBottom: 2,
        },
        commentsBox: {
            minHeight: 40,
            borderWidth: 0.8,
            borderColor: '#9fb2c2',
            borderStyle: 'dashed',
            borderRadius: 3,
            padding: 6,
        },
        signatureBlock: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: 30,
        },
        signBox: { width: 150, textAlign: 'center' },
        signImg: { width: 140, height: 60, objectFit: 'contain', marginBottom: 4 },
        signLabel: { fontSize: 9, color: '#58667a' },
        footer: { marginTop: 20, textAlign: 'left', fontSize: 9.5, color: '#58667a' },
        powered: { color: '#0d7ab7', fontWeight: 'bold', marginBottom: 2 },
        bottomLine: {
            position: 'absolute',
            bottom: 20,
            left: 30,
            right: 30,
            height: 3,
            backgroundColor: '#1a9e58',
        },
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Image src={"/images/logo/rx-pharmacy.png"} style={styles.rxLogo} />
                    <Image src={"/images/logo/logo.png"} style={styles.companyLogo} />

                    <View style={styles.doctorRow}>
                        <View style={styles.doctorLeft}>
                            <Text style={styles.doctorName}>{data.doctorName}</Text>
                            <Text>{data.qualification}</Text>
                        </View>
                        <View style={styles.doctorRight}>
                            <Text>Registration Number: {data.regNo}</Text>
                            <Text>Date: {(new Date()).toLocaleDateString()}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.dashed}></View>

                {/* Patient Info */}
                <View style={styles.patientInfo}>
                    <Text>
                        <Text style={styles.bold}>Patient Name: </Text>
                        {data.patient?.name
                            ? data.patient.name
                                .toLowerCase()
                                .replace(/\b\w/g, (c) => c.toUpperCase()) // Sentence case
                            : 'N/A'}
                    </Text>

                    <Text>
                        <Text style={styles.bold}>Age: </Text>
                        {data.patient?.dob
                            ? calculateAge(data.patient.dob)
                            : data.patient?.otherPatientAge || 'N/A'}
                    </Text>

                    <Text>
                        <Text style={styles.bold}>Gender: </Text>
                        {data.patient?.gender
                            ? data.patient.gender.charAt(0).toUpperCase() +
                            data.patient.gender.slice(1).toLowerCase()
                            : 'N/A'}
                    </Text>
                </View>
                <View style={styles.patientInfo}>
                    <Text>
                        <Text style={styles.bold}>Order No: </Text>
                        {data.orderNo || '-'}
                    </Text>
                    <Text>
                        <Text style={styles.bold}>Expire On: </Text>
                        {data.expireOn ? (data.expireOn).toLocaleDateString() : '-'}
                    </Text>
                </View>

                <View style={styles.dashed}></View>

                {/* Diagnosis */}
                <View style={styles.diagnosis}>
                    <Text style={styles.title}>Diagnosis</Text>
                    <Text style={styles.diagText}>{data.diagnosis}</Text>
                </View>

                <View style={styles.dashed}></View>

                {/* Medicine Table */}
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.th, styles.thMed]}>Medicine</Text>
                        <Text style={[styles.th, styles.thMAEN]}>M A E N</Text>
                        <Text style={[styles.th, styles.thTiming]}>Timing</Text>
                        <Text style={[styles.th, styles.thRoute]}>Route</Text>
                        <Text style={[styles.th, styles.thDur]}>Duration</Text>
                    </View>

                    {data.medicines.map((m, i) => (
                        <View key={i} style={styles.tr}>
                            <Text style={styles.tdMed}>{m.name}</Text>
                            <Text style={styles.tdMAEN}>{m.maen}</Text>
                            <Text style={styles.tdTiming}>{m.timing}</Text>
                            <Text style={styles.tdRoute}>{m.route}</Text>
                            <Text style={styles.tdDur}>{m.duration}</Text>
                        </View>
                    ))}
                </View>
                {/* legand  */}
                <View style={styles.legendBox}>

                    <Text style={styles.legend}>
                        <Text style={styles.bold}>M:</Text> Morning &nbsp;&nbsp;
                        <Text style={styles.bold}>A:</Text> Afternoon &nbsp;&nbsp;
                        <Text style={styles.bold}>E:</Text> Evening &nbsp;&nbsp;
                        <Text style={styles.bold}>N:</Text> Night
                    </Text>
                    <Text style={styles.legend}>
                        <Text style={styles.bold}>BF:</Text> Before Food &nbsp;&nbsp;
                        <Text style={styles.bold}>AF:</Text> After Food &nbsp;&nbsp;
                        <Text style={styles.bold}>N/A:</Text> –
                    </Text>
                </View>



                {/* Comments */}
                <Text style={styles.commentsTitle}>Comments</Text>
                <View style={styles.commentsBox}>
                    <Text>{data.remark}</Text>
                </View>

                {/* Signature */}
                <View style={styles.signatureBlock}>
                    <View style={styles.signBox}>
                        {data.signatureUrl && <Image src={data.signatureUrl} style={styles.signImg} />}
                        <Text style={styles.signLabel}>Signature</Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.powered}>Powered by Dava Bharti</Text>
                    <Text>Email: care@davabharti.com | Mobile: +91 89558 01801</Text>
                </View>

                <View style={styles.bottomLine}></View>
            </Page>
        </Document>
    );
};

// ---------- Main Component ----------
interface GeneratePrescriptionProps {
    data: any;
    disabled: boolean;
    onGenerateSuccess?: (url: string) => void;
}

const GeneratePrescriptionButton: React.FC<GeneratePrescriptionProps> = ({
    data,
    onGenerateSuccess,
}) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const calculateAge = (dob?: string) => {
        if (!dob) return '';
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
        return `${age} yrs`;
    };

    const formatMedicines = (rawMedicines: any[]) => {
        const TIME_MAP: Record<string, string> = {
            Morning: 'M',
            Noon: 'A',
            Evening: 'E',
            Night: 'N',
        };
        const TIMING_MAP: Record<string, string> = {
            'Before Meal': 'BF',
            'After Meal': 'AF',
            'N/A': '-',
        };

        return rawMedicines.map((m) => {
            const schedule = m.schedule || {};
            const slots = ['Morning', 'Noon', 'Evening', 'Night'];

            const maen = slots
                .map((slot) => (schedule[slot]?.dosage ? schedule[slot].dosage : '-'))
                .join('  ');

            const timing = slots
                .map((slot) => {
                    const tSymbol = TIME_MAP[slot];
                    const tVal = TIMING_MAP[schedule[slot]?.timing || 'N/A'];
                    return `${tSymbol}:${tVal}`;
                })
                .join(' | ');

            return {
                name: m.name,
                maen,
                timing,
                route: m.route || '-',
                duration: `${m.duration || 0} Days`,
            };
        });
    };

    const handleConfirmGenerate = async () => {
        setIsDialogOpen(false);
        setIsGenerating(true);

        try {
            const formattedMedicines = formatMedicines(data.medicines || []);

            const preparedData = {
                ...data,
                patientName: data.patient?.name || data.patientName,
                gender: data.patient?.gender || data.gender,
                age: data.patient?.dob ? calculateAge(data.patient.dob) : data.age,
                medicines: formattedMedicines,
            };

            const blob = await pdf(<PrescriptionPDF data={preparedData} />).toBlob();

            const formData = new FormData();
            formData.append('file', blob, `prescription_${data.orderNo || 'new'}.pdf`);
            formData.append('folder', 'prescriptions');

            const uploadRes = await axiosInstance.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const uploadedUrl = uploadRes.data.data.url;
            onGenerateSuccess?.(uploadedUrl);
        } catch (err) {
            console.error('Prescription generation error:', err);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <>
            <Button
                onClick={() => setIsDialogOpen(true)}
                disabled={isGenerating}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
                {isGenerating ? 'Generating...' : 'Generate'}
            </Button>

            {/* Confirmation Dialog */}
            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <DialogTitle>Generate Prescription</DialogTitle>
                <DialogBody>
                    <p className='dark:text-white'>Are you sure you want to generate and upload this prescription?</p>
                </DialogBody>
                <DialogActions>
                    <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleConfirmGenerate}>Confirm</Button>
                </DialogActions>
            </Dialog>

            {/* Preview Dialog */}
            <Dialog open={!!previewUrl} onClose={() => setPreviewUrl(null)} size="4xl">
                <DialogTitle>Prescription Preview</DialogTitle>
                <DialogBody className="flex justify-center items-center">
                    {previewUrl && (
                        <iframe
                            src={previewUrl}
                            title="Prescription Preview"
                            className="w-full h-[60vh] border rounded-lg shadow-md"
                        />
                    )}
                </DialogBody>
                <DialogActions>
                    <Button onClick={() => setPreviewUrl(null)}>OK</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default GeneratePrescriptionButton;
