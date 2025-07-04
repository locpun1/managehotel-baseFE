import React from 'react';
import { Box, Typography, Chip, Divider, Paper, useTheme, useMediaQuery, Stack } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import useAuth from '@/hooks/useAuth';
import { ROLE } from '@/constants/roles';
import { formatIsoToLocalTime } from '@/utils/formatters';

export interface StepProps {
  name: string;
  completed_at?: string | null;
  isCurrent?: boolean;
  order_in_process: number;
}

interface TaskProgressStepperProps {
  roomNumber: string;
  taskTitlePrefix?: string;
  status: 'Chưa làm' | 'Hoạt động' | 'Hoàn thành' | string;
  currentDate: string;
  steps?: StepProps[];
}


const TaskProgressStepper: React.FC<TaskProgressStepperProps> = ({
  roomNumber,
  taskTitlePrefix = "Dọn vệ sinh",
  status,
  currentDate,
  steps,
}) => {
  const fullTaskTitle = `${taskTitlePrefix} phòng ${roomNumber}`;

  const completedStepOuterRingColor = '#00C7BE';
  const completedStepInnerBgColor = '#A0E8E0';
  const completedStepIconColor = '#00796B';
  const avatarBorderCompletedColor = '#00C7BE';
  const defaultDividerColor = 'grey.400';
  const completedDividerColor = '#00C7BE';

  const currentStepRingColor = '#FFA000';
  const currentStepGlowColor = 'rgba(255,160,0,0.5)';

  const theme = useTheme();
  
  const mdDown = useMediaQuery(theme.breakpoints.down('md'));
  

  return (
    <Paper elevation={2} sx={{
      p: { xs: 2, md: 2.5 }, borderRadius: '8px', overflow: 'hidden',
      boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
    }}>
      {mdDown ? (
        <Box sx={{ display: 'flex', mb: 2.5, flexDirection:"column" }}>
          <Box sx={{ whiteSpace: 'nowrap', display: 'flex', flex: '1', gap: '10px'}}>
            <Typography variant="h6" component="h1" sx={{ fontWeight: 'bold', flex: '1' }}>
              {fullTaskTitle}
            </Typography>
          </Box>
          <Box sx={{ whiteSpace: 'nowrap', display: 'flex', flex: '1', gap: '10px'}}>
            <Box sx={{ display: 'flex', alignItems: 'center', borderRight: '1px solid #B2B2B2' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                Trạng thái:
              </Typography>
              <Chip
                label={status}
                size="small"
                sx={{
                  fontWeight: 'bold',
                  backgroundColor: status === 'Chưa làm' ? '#FEECEB' : (status === 'Hoạt động' ? '#FFF9C4' : '#E8F5E9'),
                  color: status === 'Chưa làm' ? '#D32F2F' : (status === 'Hoạt động' ? '#F57F17' : '#2E7D32'),
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Typography variant="body2" color="text.secondary">
                Thời gian:
              </Typography>
              <Typography variant="body2" sx={{ color: '#171717', fontWeight: '600' }}>
                {currentDate}
              </Typography>
            </Box>
          </Box>
          
        </Box>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
          <Typography variant="h6" component="h1" sx={{ fontWeight: 'bold', flex: '1' }}>
            {fullTaskTitle}
          </Typography>
          <Box sx={{ whiteSpace: 'nowrap', display: 'flex', flex: '1', gap: '10px', justifyContent: 'flex-end' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', borderRight: '1px solid #B2B2B2' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                Trạng thái:
              </Typography>
              <Chip
                label={status}
                size="small"
                sx={{
                  fontWeight: 'bold',
                  backgroundColor: status === 'Chưa làm' ? '#FEECEB' : (status === 'Hoạt động' ? '#FFF9C4' : '#E8F5E9'),
                  color: status === 'Chưa làm' ? '#D32F2F' : (status === 'Hoạt động' ? '#F57F17' : '#2E7D32'),
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Typography variant="body2" color="text.secondary">
                Thời gian:
              </Typography>
              <Typography variant="body2" sx={{ color: '#171717', fontWeight: '600' }}>
                {currentDate}
              </Typography>
            </Box>
          </Box>
      </Box> 
      )}


      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mt: 1, overflowX: 'auto', pb: 1, px: 0.5 }}>
        {(!steps || steps.length === 0) ? (
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 2 }}>
            <Typography color="text.secondary" variant="body2">
              Chưa có quy trình công việc nào được tải.
            </Typography>
          </Box>
        ) : (
          steps.map((step, index) => {
            const formattedCompletedTime = formatIsoToLocalTime(step.completed_at);
            
            const isCompleted = !!formattedCompletedTime;

            const displayTime = formattedCompletedTime || "00:00"; 
            
            const dividerColor = isCompleted ? completedDividerColor : defaultDividerColor;
            const showOuterRing = isCompleted || step.isCurrent;


            return (
              <React.Fragment key={step.name + index}>
                <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: { xs: 90, sm: 100, md: 110 }, px: 0.5 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: isCompleted ? 'bold' : 500,
                      color: isCompleted ? 'text.primary' : 'text.secondary',
                      mb: 0.5,
                      height: '1.2em'
                    }}
                  >
                    {displayTime}
                  </Typography>
                  <Box
                    sx={{
                      width: { xs: 36, sm: 40 },
                      height: { xs: 36, sm: 40 },
                      borderRadius: '50%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      mb: 1,
                      border: showOuterRing
                        ? `2px solid ${isCompleted ? completedStepOuterRingColor : currentStepRingColor}`
                        : '2px solid transparent',
                      padding: showOuterRing ? { xs: '2px', sm: '3px' } : '0px',
                      boxShadow: step.isCurrent && !isCompleted ? `0 0 6px ${currentStepGlowColor}` : 'none',
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: 18, sm: 20 },
                        height: { xs: 18, sm: 20 },
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '50%',
                        bgcolor: isCompleted
                          ? completedStepInnerBgColor
                          : (step.isCurrent ? '#FFC107' : 'grey.300'),
                        color: isCompleted ? completedStepIconColor : (step.isCurrent ? '#000' : '#fff'),
                        border: isCompleted ? `2px solid ${avatarBorderCompletedColor}` : 'none',
                      }}
                    >
                      {isCompleted ? <CheckIcon sx={{ fontSize: { xs: '.8rem', sm: '1.rem' } }} /> : ''}
                    </Box>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: isCompleted || step.isCurrent ? 500 : 400,
                      color: isCompleted || step.isCurrent ? 'text.primary' : 'text.secondary',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      lineHeight: 1.3,
                      minHeight: '2.6em',
                      mt: '-4px'
                    }}
                  >
                    {step.name}
                  </Typography>
                </Box>
                {index < steps.length - 1 && (
                  <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', pt: { xs: '26px', sm: '28px' }, minWidth: { xs: 20, sm: 30, md: 40 } }}>
                    <Divider sx={{ borderBottomStyle: 'dashed', borderBottomWidth: 2, borderColor: dividerColor, width: '100%' }} />
                  </Box>
                )}
              </React.Fragment>
            );
          })
        )}
      </Box>
    </Paper>
  );
};

export default TaskProgressStepper;