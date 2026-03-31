'use client';

import {
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  Box,
  Skeleton,
} from '@mui/material';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';
import CurrencyRupeeOutlinedIcon from '@mui/icons-material/CurrencyRupeeOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';

interface Stats {
  pending?: number;
  completed?: number;
  cancelled?: number;
  noShow?: number;
  totalRevenue?: string;
  platformCommission?: string;
  netEarnings?: string;
  walletBalance?: string;
}

interface Props {
  stats?: Stats;
  loading?: boolean;
}

const DashboardStatsCards = ({ stats, loading }: Props) => {
  const items = [
    {
      title: 'Pending',
      value: stats?.pending ?? 0,
      icon: <PendingActionsOutlinedIcon />,
      color: '#f59e0b',
      bg: '#fff7ed',
    },
    {
      title: 'Completed',
      value: stats?.completed ?? 0,
      icon: <CheckCircleOutlineOutlinedIcon />,
      color: '#10b981',
      bg: '#ecfdf5',
    },
    {
      title: 'Cancelled',
      value: stats?.cancelled ?? 0,
      icon: <CancelOutlinedIcon />,
      color: '#ef4444',
      bg: '#fef2f2',
    },
    {
      title: 'No Show',
      value: stats?.noShow ?? 0,
      icon: <PersonOffOutlinedIcon />,
      color: '#64748b',
      bg: '#f8fafc',
    },
    {
      title: 'Total Revenue',
      value: `₹${Number(stats?.totalRevenue || 0).toLocaleString('en-IN')}`,
      icon: <CurrencyRupeeOutlinedIcon />,
      color: '#8b5cf6',
      bg: '#f5f3ff',
    },
    {
      title: 'Net Earnings',
      value: `₹${Number(stats?.netEarnings || 0).toLocaleString('en-IN')}`,
      icon: <InsightsOutlinedIcon />,
      color: '#0ea5e9',
      bg: '#f0f9ff',
    },
    {
      title: 'Platform Commission',
      value: `₹${Number(stats?.platformCommission || 0).toLocaleString('en-IN')}`,
      icon: <CurrencyRupeeOutlinedIcon />,
      color: '#ec4899',
      bg: '#fdf2f8',
    },
    {
      title: 'Wallet Balance',
      value: `₹${Number(stats?.walletBalance || 0).toLocaleString('en-IN')}`,
      icon: <AccountBalanceWalletOutlinedIcon />,
      color: '#06b6d4',
      bg: '#ecfeff',
    },
  ];

  return (
    <Grid container spacing={3}>
      {items.map((item, index) => (
        <Grid
          key={index}
          size={{
            xs: 12,
            sm: 6,
            lg: 3,
          }}
        >
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e5e7eb' }}>
            <CardContent sx={{ p: 3 }}>
              {loading ? (
                <Skeleton variant="rounded" height={100} />
              ) : (
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      {item.title}
                    </Typography>
                    <Typography variant="h5" fontWeight={700} mt={1}>
                      {item.value}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: item.bg,
                      color: item.color,
                    }}
                  >
                    {item.icon}
                  </Box>
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardStatsCards;