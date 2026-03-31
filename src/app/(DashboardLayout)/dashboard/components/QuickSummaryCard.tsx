'use client';

import dynamic from 'next/dynamic';
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Typography, Avatar, Skeleton, Box } from '@mui/material';
import { IconArrowUpLeft } from '@tabler/icons-react';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Stats {
  pending?: number;
  completed?: number;
  cancelled?: number;
  noShow?: number;
  walletBalance?: string;
}

interface Props {
  stats?: Stats;
  loading?: boolean;
}

const QuickSummaryCard = ({ stats, loading }: Props) => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primaryLight = '#ecf2ff';
  const secondaryLight = '#fef3c7';
  const successLight = theme.palette.success.light;

  const totalAppointments =
    (stats?.pending ?? 0) +
    (stats?.completed ?? 0) +
    (stats?.cancelled ?? 0) +
    (stats?.noShow ?? 0);

  const completed = stats?.completed ?? 0;
  const pending = stats?.pending ?? 0;
  const cancelled = stats?.cancelled ?? 0;

  const chartSeries =
    totalAppointments > 0
      ? [completed, pending, cancelled]
      : [1, 0, 0];

  const chartOptions: any = {
    chart: {
      type: 'donut',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 155,
    },
    colors: [primary, secondaryLight, '#fee2e2'],
    labels: ['Completed', 'Pending', 'Cancelled'],
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: '75%',
          background: 'transparent',
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 991,
        options: {
          chart: {
            width: 120,
          },
        },
      },
    ],
  };

  return (
    <DashboardCard title="Quick Summary" subtitle="Performance snapshot">
      {loading ? (
        <Skeleton variant="rounded" height={220} />
      ) : (
        <Grid container spacing={3} alignItems="center">
          <Grid
            size={{
              xs: 7,
              sm: 7,
            }}
          >
            <Typography variant="h3" fontWeight="700">
              Total : {totalAppointments}
            </Typography>

            <Typography variant="subtitle2" color="textSecondary" mt={1}>
              Wallet: ₹{Number(stats?.walletBalance || 0).toLocaleString('en-IN')}
            </Typography>

            <Stack spacing={1} mt={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar
                  sx={{ width: 9, height: 9, bgcolor: primary, svg: { display: 'none' } }}
                />
                <Typography variant="subtitle2" color="textSecondary">
                  Completed
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar
                  sx={{ width: 9, height: 9, bgcolor: secondaryLight, svg: { display: 'none' } }}
                />
                <Typography variant="subtitle2" color="textSecondary">
                  Pending
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar
                  sx={{ width: 9, height: 9, bgcolor: '#fee2e2', svg: { display: 'none' } }}
                />
                <Typography variant="subtitle2" color="textSecondary">
                  Cancelled
                </Typography>
              </Stack>
            </Stack>
          </Grid>

          <Grid
            size={{
              xs: 5,
              sm: 5,
            }}
          >
            <Box display="flex" justifyContent="center">
              <Chart
                options={chartOptions}
                series={chartSeries}
                type="donut"
                height={150}
                width="100%"
              />
            </Box>
          </Grid>
        </Grid>
      )}
    </DashboardCard>
  );
};

export default QuickSummaryCard;