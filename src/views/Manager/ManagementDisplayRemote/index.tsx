// src/views/Manager/ManagementDisplayRemote/index.tsx

import CustomPagination from "@/components/Pagination/CustomPagination";
import { DataRoomsProps, getRooms } from "@/services/manager.service";
import { Rooms } from "@/types/manager";
import { convertRoomPathToDisplayRemoteUrl } from "@/utils/url";
import { Alert, Box, Chip, CircularProgress, Grid, Paper, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";


interface TVControlCardProps {
  data: Rooms,
}

function TVControlCard({ data }: TVControlCardProps) {
  const link = data !== null && data.link_web !== null && convertRoomPathToDisplayRemoteUrl(data.link_web)
  return (
    <Paper elevation={2} sx={{ padding: 2, borderRadius: '8px', border: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Box>
            <Typography variant="body2" component="span">Số phòng: </Typography>
            <Typography variant="body2" component="span" fontWeight="bold">{data.room_number}</Typography>
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
          <Typography variant="body2" component="span" fontWeight="bold">{data.floor_id}</Typography>
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
  const [listRooms, setListRooms] = useState<Rooms[]>([]);
  const [page, setPage] = useState(0)
  const [rowPerPgae, setRowPerPage] = useState<number>(9)
  const [total, setTotal] = useState(0)

  const loadList = useCallback(async(currentPage: number, currentLimit: number) => {
    setLoading(true)
    setError(null)
    try {
      const res = await getRooms(currentPage, currentLimit);
      const data = res.data as any as DataRoomsProps;
      setListRooms(data.data);
      setTotal(data.totalCount);
    } catch (error: any) {
      setError(error.message)
      setListRooms([])
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
            {listRooms.length === 0 ? (
              <Typography>Không có bản ghi nào cả</Typography>
            ) : (
              listRooms.map((room) => (
              <Grid item xs={12} sm={6} md={4} key={room.id}>
                <TVControlCard data={room} />
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