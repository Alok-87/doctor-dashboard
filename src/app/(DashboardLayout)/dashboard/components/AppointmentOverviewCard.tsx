'use client';

import React from 'react';
import { MenuItem, Select, Skeleton, Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import dynamic from 'next/dynamic';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface AppointmentGraphItem {
  month: string;
  count: number;
}

interface Props {
  data: AppointmentGraphItem[];
  loading?: boolean;
}

const AppointmentOverviewCard = ({ data, loading }: Props) => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.light;

  const [range, setRange] = React.useState('6');

  const handleChange = (event: any) => {
    setRange(event.target.value);
  };

  const categories = data.map((item) => {
    const [year, month] = item.month.split('-');
    return new Date(Number(year), Number(month) - 1).toLocaleString('en-US', {
      month: 'short',
    });
  });

  const series = [
    {
      name: 'Appointments',
      data: data.map((item) => item.count),
    },
  ];

  const options: any = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 370,
    },
    colors: [primary],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '42%',
        borderRadius: 6,
        borderRadiusApplication: 'end',
      },
    },
    stroke: {
      show: true,
      width: 4,
      colors: ['transparent'],
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      borderColor: 'rgba(0,0,0,0.08)',
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
      categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      tickAmount: 4,
      min: 0,
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: function (value: number) {
          return `${value} appointments`;
        },
      },
    },
    fill: {
      opacity: 1,
    },
  };

  return (
    <DashboardCard
      title="Appointment Overview"
      subtitle="Monthly appointment trend"
      action={
        <Select
          labelId="appointment-range"
          id="appointment-range"
          value={range}
          size="small"
          onChange={handleChange}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="6">Last 6 Months</MenuItem>
        </Select>
      }
    >
      {loading ? (
        <Skeleton variant="rounded" height={370} />
      ) : data?.length ? (
        <Chart options={options} series={series} type="bar" height={370} width="100%" />
      ) : (
        <Box
          sx={{
            height: 370,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            No appointment data available
          </Typography>
        </Box>
      )}
    </DashboardCard>
  );
};

export default AppointmentOverviewCard;