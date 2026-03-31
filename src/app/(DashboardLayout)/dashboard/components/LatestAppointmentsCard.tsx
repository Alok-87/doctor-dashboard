'use client';

import {
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
  Box,
  Chip,
  Avatar,
  Skeleton,
} from '@mui/material';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import CurrencyRupeeOutlinedIcon from '@mui/icons-material/CurrencyRupeeOutlined';

interface Appointment {
  id: string;
  patient_name: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  total_amount: string;
  consultation_type: string;
}

interface Props {
  appointments: Appointment[];
  loading?: boolean;
}

const LatestAppointmentsCard = ({ appointments, loading }: Props) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAYMENT_PENDING':
        return { color: '#92400e', bg: '#fef3c7' };
      case 'COMPLETED':
        return { color: '#065f46', bg: '#d1fae5' };
      case 'CANCELLED':
        return { color: '#991b1b', bg: '#fee2e2' };
      default:
        return { color: '#334155', bg: '#e2e8f0' };
    }
  };

  return (
    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e5e7eb' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700}>
          Latest Appointments
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Recently booked consultations
        </Typography>

        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((item) => (
              <Grid key={item} size={{ xs: 12, md: 6 }}>
                <Skeleton variant="rounded" height={180} />
              </Grid>
            ))}
          </Grid>
        ) : appointments.length === 0 ? (
          <Box
            sx={{
              border: '1px dashed #cbd5e1',
              borderRadius: 3,
              p: 5,
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No appointments found.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {appointments.map((appointment) => {
              const statusStyle = getStatusColor(appointment.status);

              return (
                <Grid key={appointment.id} size={{ xs: 12, md: 6 }}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      border: '1px solid #e5e7eb',
                      bgcolor: '#f8fafc',
                      height: '100%',
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        spacing={2}
                      >
                        <Stack direction="row" spacing={2} alignItems="flex-start">
                          <Avatar sx={{ bgcolor: '#e0e7ff', color: '#4f46e5' }}>
                            <PersonOutlineOutlinedIcon />
                          </Avatar>

                          <Box>
                            <Typography variant="subtitle1" fontWeight={700}>
                              {appointment.patient_name || 'Unknown Patient'}
                            </Typography>

                            <Stack direction="row" spacing={2} mt={1} flexWrap="wrap">
                              <Stack direction="row" spacing={0.5} alignItems="center">
                                <CalendarMonthOutlinedIcon sx={{ fontSize: 16 }} />
                                <Typography variant="body2" color="text.secondary">
                                  {formatDate(appointment.appointment_date)}
                                </Typography>
                              </Stack>

                              <Stack direction="row" spacing={0.5} alignItems="center">
                                <AccessTimeOutlinedIcon sx={{ fontSize: 16 }} />
                                <Typography variant="body2" color="text.secondary">
                                  {appointment.appointment_time}
                                </Typography>
                              </Stack>
                            </Stack>
                          </Box>
                        </Stack>

                        <Chip
                          label={appointment.status.replace(/_/g, ' ')}
                          size="small"
                          sx={{
                            bgcolor: statusStyle.bg,
                            color: statusStyle.color,
                            fontWeight: 700,
                            textTransform: 'capitalize',
                          }}
                        />
                      </Stack>

                      <Grid container spacing={2} mt={1}>
                        <Grid size={6}>
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: 3,
                              bgcolor: '#fff',
                              border: '1px solid #e5e7eb',
                            }}
                          >
                            <Typography variant="caption" color="text.secondary">
                              Consultation
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                              {appointment.consultation_type === 'ONLINE' ? (
                                <VideocamOutlinedIcon sx={{ fontSize: 18, color: '#5d87ff' }} />
                              ) : (
                                <LocalHospitalOutlinedIcon sx={{ fontSize: 18, color: '#5d87ff' }} />
                              )}
                              <Typography variant="body2" fontWeight={600}>
                                {appointment.consultation_type}
                              </Typography>
                            </Stack>
                          </Box>
                        </Grid>

                        <Grid size={6}>
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: 3,
                              bgcolor: '#fff',
                              border: '1px solid #e5e7eb',
                            }}
                          >
                            <Typography variant="caption" color="text.secondary">
                              Amount
                            </Typography>
                            <Stack direction="row" spacing={0.5} alignItems="center" mt={1}>
                              <CurrencyRupeeOutlinedIcon sx={{ fontSize: 18, color: '#5d87ff' }} />
                              <Typography variant="body2" fontWeight={600}>
                                {Number(appointment.total_amount || 0).toLocaleString('en-IN')}
                              </Typography>
                            </Stack>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};

export default LatestAppointmentsCard;