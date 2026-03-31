'use client'
import { Grid, Box } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
// components
import SalesOverview from '@/app/(DashboardLayout)/components/dashboard/SalesOverview';
import YearlyBreakup from '@/app/(DashboardLayout)/components/dashboard/YearlyBreakup';
import RecentTransactions from '@/app/(DashboardLayout)/components/dashboard/RecentTransactions';
import ProductPerformance from '@/app/(DashboardLayout)/components/dashboard/ProductPerformance';
import MonthlyEarnings from '@/app/(DashboardLayout)/components/dashboard/MonthlyEarnings';
import { useEffect } from 'react';
import { useAppDispatch } from '../../../redux/store/hook';
import { getProfile } from '../../../redux/profile/profileThunks';
import DashboardUi from './dashboard/DashboardUi';
import { useSocket } from '@/context/SocketContext';

const Dashboard = () => {


  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(getProfile());
  },[])


  return (
    <DashboardUi/>
  );
}

export default Dashboard;
