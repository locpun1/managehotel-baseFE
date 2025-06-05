import { Box, Paper, Typography} from '@mui/material';
import SearchBar from '@/components/SearchBar';
import { useState } from 'react';
import Grid from '@mui/material/Grid2';
import useAuth from '@/hooks/useAuth';
import CardInfoManager from '@/components/CardInfo/CardInfoManager';
import CardInfoStaff from '@/components/CardInfo/CardInfoStaff';
import TaskProgressStepper, { StepProps } from '@/views/DisplayRemote/components/TaskProgressStepper'; 
import { DetailedTasksApiResponse } from '@/services/task-service';
import TaskList from '@/views/DisplayRemote/components/TaskList';

interface StepperData {
  roomNumber: string;
  taskTitlePrefix?: string;
  status: string;
  currentDate: string;
  steps?: StepProps[];
}

const StaffHome = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const handleSearch = () => {}
  const { profile } = useAuth();
  const [stepperData, setStepperData] = useState<StepperData | null>(null);
  const [detailedTasksResponse, setDetailedTasksResponse] = useState<DetailedTasksApiResponse | null>(null);
  const [loadingTaskList, setLoadingTaskList] = useState<boolean>(true);

  return (
    <Box>
      <SearchBar
        onSearch={handleSearch}
        placeholder="Tìm kiếm"
        initialValue={searchTerm}

      />
      <Grid container spacing={2} sx={{ m:2}}>
        <Grid size={{ xs:12, md: 9.5}}>
            <Grid container spacing={1}>
              <Grid size={{ xs: 12}}>
                <Box>
                  <Paper elevation={2} sx={{ padding: 1, borderRadius: '8px', border: '1px solid #e0e0e0',height: '50%' }}>
                    {stepperData ? (
                      <TaskProgressStepper
                        roomNumber={stepperData.roomNumber}
                        taskTitlePrefix={stepperData.taskTitlePrefix}
                        status={stepperData.status}
                        currentDate={stepperData.currentDate}
                        steps={stepperData.steps}
                      />
                    ): (
                      <Typography sx={{ mb: 4}}>Không có thông tin quy trình cho phòng này</Typography>
                    )}
                  </Paper>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md:4}}>
                <Box>
                  <Paper elevation={2} sx={{ padding: 1, borderRadius: '8px', border: '1px solid #e0e0e0',height: '50%' }}>
                    Mã QR của bạn
                  </Paper>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 8}}>
                <Box>
                  <Paper elevation={2} sx={{ padding: 1, borderRadius: '8px', border: '1px solid #e0e0e0',height: '50%' }}>
                    <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                      Danh sách công việc
                    </Typography>
                    {detailedTasksResponse && detailedTasksResponse.tasks.length > 0 ? (
                      <TaskList
                        tasks={detailedTasksResponse.tasks}
                        onTaskAction={() => {}}
                        onCompleteAll={() => {}}
                      />
                    ) : (
                      !loadingTaskList && <Typography color="text.secondary">Không có công việc chi tiết nào được tìm thấy.</Typography>
                    )}
                  </Paper>
                </Box>
              </Grid>
            </Grid>
        </Grid>
        <Grid size={{ xs:12, md: 2.5}}>
            {profile &&
              <CardInfoManager
                data={profile}
              />
            }
            {profile &&
              <CardInfoStaff
                data={profile}
              />
            }
        </Grid>
      </Grid>
    </Box>
  );
};

export default StaffHome;
