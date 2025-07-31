// src/views/Manager/ManagementDisplayRemote/index.tsx

import CustomPagination from "@/components/Pagination/CustomPagination";
import { DataGroupTaskProps, DataRoomsProps, getListGroupTask, getRooms } from "@/services/manager.service";
import { GroupTasks, Rooms } from "@/types/manager";
import { convertRoomPathToDisplayRemoteUrl } from "@/utils/url";
import { Alert, Box, Chip, CircularProgress, Grid, Paper, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";


interface TVControlCardProps {
  data: GroupTasks,
}

function TVControlCard({ data }: TVControlCardProps) {
  const link = data !== null && data.link_url !== null && data.link_url !== undefined && convertRoomPathToDisplayRemoteUrl(data.link_url)
  return (
    <Paper elevation={2} sx={{ padding: 2, borderRadius: '8px', border: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Box>
            <Typography variant="body2" component="span">Số phòng: </Typography>
            <Typography variant="body2" component="span" fontWeight="bold">{data.room}</Typography>
          </Box>
          {/* <Chip
            label={isOnline ? 'Online' : 'Offline'}
            color={isOnline ? 'success' : 'error'}
            size="small"
            sx={{ fontWeight: 'bold' }}
          /> */}
        </Box>
        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" component="span">Số tầng: </Typography>
          <Typography variant="body2" component="span" fontWeight="bold">{data.floor}</Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" component="span">Hiển thị: </Typography>
          <Typography
            variant="body2"
            component="a" // Để có thể click nếu muốn (thêm href)
            href={link ? link : ""}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: 'primary.main',
              textDecoration: 'underline',
              wordBreak: 'break-all', // Để URL dài không làm vỡ layout
              display: 'inline',
            }}
          >
            {link}
          </Typography>
        </Box>
    </Paper>
  );
}


function ManagementDisplayRemote() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState(null);
  const [listGroupTasks, setListGroupTasks] = useState<GroupTasks[]>([]);
  const [page, setPage] = useState(0)
  const [rowPerPgae, setRowPerPage] = useState<number>(9)
  const [total, setTotal] = useState(0)

  const loadList = useCallback(async(currentPage: number, currentLimit: number) => {
    setLoading(true)
    setError(null)
    try {
      const date = new Date().toISOString().split('T')[0];
      const res = await getListGroupTask(currentPage, currentLimit, date);
      const data = res.data as any as DataGroupTaskProps;
      setListGroupTasks(data.result.data);
      setTotal(data.result.totalCount);
    } catch (error: any) {
      setError(error.message)
      setListGroupTasks([])
      setTotal(0)
    }finally{
      setLoading(false)
    }
  },[])

  useEffect(() => {
    loadList(page, rowPerPgae);
  },[page, rowPerPgae])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Quản lý Display Remote
      </Typography>
       {loading && (
        <Box sx={{ display: 'flex', justifyContent: "center", my: 3}}>
          <CircularProgress/>
        </Box>
      )}
      {error && !loading && (
        <Alert severity='error' sx={{ my: 2}}>{error}</Alert>
      )}
      {!error && !loading && (
        <>
          <Grid container spacing={3}>
            {listGroupTasks.length === 0 ? (
              <Typography p={3} fontWeight={500}>Không có bản ghi nào cả</Typography>
            ) : (
              listGroupTasks.map((groupTask) => (
              <Grid item xs={12} sm={6} md={4} key={groupTask.id}>
                <TVControlCard data={groupTask} />
              </Grid>
            ))
            )}
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
            <CustomPagination
            count={total}
            page={page}
            rowsPerPage={rowPerPgae}
            onPageChange={handlePageChange}
          />
          </Box>
        </>
      )}
    </Box>
  );
}

export default ManagementDisplayRemote;