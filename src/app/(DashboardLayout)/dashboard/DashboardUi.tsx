'use client';

import { useEffect } from 'react';
import { Grid, Box } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { useAppDispatch, useAppSelector } from '../../../../redux/store/hook';
import { getDashboard } from '../../../../redux/profile/profileThunks';

import DashboardStatsCards from './components/DashboardStatsCards';
import AppointmentOverviewCard from './components/AppointmentOverviewCard';
import QuickSummaryCard from './components/QuickSummaryCard';
import LatestAppointmentsCard from './components/LatestAppointmentsCard';
import AppointmentCard from '../components/shared/AppointmentCard';
import { useRouter } from 'next/navigation';

const DashboardUi = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    useEffect(() => {
        dispatch(getDashboard());
    }, [dispatch]);

    const { dashboard, loading } = useAppSelector((state) => state.profile);
    
    console.log('dashboard', dashboard);

    return (
        <PageContainer title="Doctor Dashboard" description="Doctor dashboard overview">
            <Box>
                <Grid container spacing={3}>
                    <Grid size={12}>
                        <DashboardStatsCards stats={dashboard?.stats} loading={loading} />
                    </Grid>

                    <Grid
                        size={{
                            xs: 12,
                            lg: 8,
                        }}
                    >
                        <AppointmentOverviewCard
                            data={dashboard?.appointmentGraph || []}
                            loading={loading}
                        />
                    </Grid>

                    <Grid
                        size={{
                            xs: 12,
                            lg: 4,
                        }}
                    >
                        <QuickSummaryCard stats={dashboard?.stats} loading={loading} />
                    </Grid>

                    <Grid size={12}>
                        <div className='space-y-2'>
                            {dashboard?.latestAppointments?.map((appt: any) => (
                                <AppointmentCard
                                    key={appt.id}
                                    appt={appt}
                                    onViewDetails={(id) => router.push(`/appointments/${id}`)}
                                />
                            ))}
                        </div>
                    </Grid>
                </Grid>
            </Box>
        </PageContainer>
    );
};

export default DashboardUi;