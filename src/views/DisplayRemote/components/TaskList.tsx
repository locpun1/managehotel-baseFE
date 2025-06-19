import React from 'react';
import { Box, Typography, Paper, IconButton, Button, useTheme, Theme } from '@mui/material';
import { TaskListDataItem } from '@/types/task-types';
import { ApiTaskStatus, TASK_ACTIONS, TASK_STATUS_API, TASK_STATUS_LABEL } from '@/constants/task';
import { CheckCircle, Close, PlayCircleOutline, RadioButtonUnchecked } from '@mui/icons-material';
import { Tasks } from '@/types/manager';

export const translateTaskStatus = (apiStatus: ApiTaskStatus | string): string => {
  return TASK_STATUS_LABEL[apiStatus as ApiTaskStatus] || apiStatus;
};

export type TaskListAction = typeof TASK_ACTIONS[keyof typeof TASK_ACTIONS]; 

interface TaskListProps {
  tasks: Tasks[];
  onTaskAction?: (taskId: string | number, action: TaskListAction) => void;
  onCompleteAll?: () => void;
  title?: string;
  isCheckout?: number;
}

const getTaskStatusPresentation = (status: TaskListDataItem['status'], theme: Theme) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return {
        borderColor: theme.palette.success.main, // Xanh lá
        statusColor: theme.palette.success.main,
        ActionIcon: CheckCircle,
        actionIconColor: theme.palette.primary.main, // Màu xanh dương cho icon tick
      };
    case 'in_progress':
      return {
        borderColor: theme.palette.warning.main, // Vàng
        statusColor: theme.palette.warning.main,
        ActionIcon: RadioButtonUnchecked,
        actionIconColor: theme.palette.primary.main, // Vòng tròn xanh dương viền ngoài
      };
    case 'pending':
      return {
        borderColor: theme.palette.error.main, // Màu đỏ cho thanh bên trái
        statusColor: theme.palette.error.main, // Màu chữ trạng thái có thể là xám
        ActionIcon: PlayCircleOutline,
        actionIconColor: theme.palette.warning.light, // Màu vàng cho icon play
      };
    case 'chưa làm':
    default:
      return {
        borderColor: theme.palette.error.main,
        statusColor: theme.palette.error.main,
        ActionIcon: Close,
        actionIconColor: theme.palette.error.main,
      };
  }
};


const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskAction,
  onCompleteAll,
  title = "", 
  isCheckout
}) => {
  const theme = useTheme();

  if (!tasks || tasks.length === 0) {
    return (
      <Paper elevation={1} sx={{ p: 2, textAlign: 'center', borderRadius: '12px' }}>
        <Typography color="text.secondary">Chưa có công việc nào.</Typography>
      </Paper>
    );
  }
const lastStatus = tasks[tasks.length - 1].status === 'completed';

  return (
    <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: '12px', backgroundColor: '#fff', border: '1px solid #e0e0e0' }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, px: 1 }}>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {tasks.map((task) => {
          const { borderColor, statusColor, ActionIcon, actionIconColor } = getTaskStatusPresentation(task.status, theme);
          const isNotStartedOrPending = task.status.toLowerCase() === 'chưa làm' || task.status.toLowerCase() === 'đang chờ';
          const translatedStatus = translateTaskStatus(task.status as ApiTaskStatus);
          const presentation = getTaskStatusPresentation(task.status as ApiTaskStatus, theme);

          return (
            <Paper
              key={task.id}
              elevation={0}
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 1.5,
                borderRadius: '8px',
                border: '1px solid #E0E0E0',
                position: 'relative',
                overflow: 'hidden',
                pl: 2.5,
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '6px',
                  backgroundColor: borderColor,
                  borderTopLeftRadius: '8px',
                  borderBottomLeftRadius: '8px',
                }
              }}
            >
              <Box sx={{ textAlign: 'center', minWidth: '80px', mr: 2, borderRight: '1px solid #E0E0E0', pr: 2, width: '10%' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: task.startTime === "00:00" ? theme.palette.text.disabled : 'text.primary' }}>
                  {task.startTime || "00:00"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {task.durationText}
                </Typography>
              </Box>

              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {task.title}
                </Typography>
                <Typography variant="caption" sx={{ color: statusColor, fontWeight: 'medium' }}>
                  {translatedStatus}
                </Typography>
              </Box>

              <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {task.status.toLowerCase() === TASK_STATUS_API.COMPLETED.toLowerCase() && (
                  <CheckCircle sx={{ color: actionIconColor, fontSize: '28px' }} />
                )}
                {task.status.toLowerCase()  === TASK_STATUS_API.IN_PROGRESS.toLowerCase() && onTaskAction && (
                  <>
                    <IconButton
                      size="small"
                      onClick={() => onTaskAction(task.id, TASK_ACTIONS.CANCEL)}
                      sx={{ color: theme.palette.error.main, border: `1px solid ${theme.palette.error.light}`, borderRadius: '50%', p: 0.3 }}
                      title="Hủy/Đặt lại"
                    >
                      <Close fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => onTaskAction(task.id, TASK_ACTIONS.COMPLETED)}
                      sx={{ color: theme.palette.success.main, border: `1px solid ${theme.palette.success.light}`, borderRadius: '50%', p: 0.3, ml: 0.5 }}
                      title="Hoàn thành"
                    >
                      <CheckCircle fontSize="medium" />
                    </IconButton>
                  </>
                )}
                {(task.status.toLowerCase() === TASK_STATUS_API.PENDING.toLowerCase() || task.status.toLowerCase() === TASK_STATUS_API.WAITING.toLowerCase()) && (
                  <>
                    {task.status.toLowerCase() === TASK_STATUS_API.PENDING.toLowerCase() && onTaskAction && (
                      <IconButton size="small" onClick={() => onTaskAction(task.id, TASK_ACTIONS.CANCEL)} sx={{ color: theme.palette.error.main, border: `1px solid ${theme.palette.error.light}`, borderRadius: '50%', p: 0.3 }}>
                        <Close fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton size="small"
                     onClick={() => onTaskAction && onTaskAction(task.id, TASK_ACTIONS.START)} 
                     sx={{ color: theme.palette.warning.main, border: `1px solid ${theme.palette.warning.light}`, borderRadius: '50%', p: 0.3 }}>
                      <PlayCircleOutline/>
                    </IconButton>
                  </>
                )}

              </Box>
            </Paper>
          );
        })}
      </Box>
      {onCompleteAll && lastStatus && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2.5, px: 1 }}>
          <Button
            variant="outlined"
            onClick={onCompleteAll}
            sx={{
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              fontWeight: 'bold',
              textTransform: 'none',
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              }
            }}
            disabled={isCheckout === 1}
          >
            Hoàn thành
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default TaskList;