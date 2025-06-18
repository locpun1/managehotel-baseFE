import { Alert, Avatar, Box, Card, CardContent, CircularProgress, Stack, Typography } from '@mui/material';
import SearchBar from '@/components/SearchBar';
import React, { useCallback, useEffect, useState } from 'react';
import { getListReports, ReportsApiResponse } from '@/services/report-service';
import { ID_ROOM } from '../Home';
import useAuth from '@/hooks/useAuth';
import Grid from '@mui/material/Grid2';
import { getPathImage } from '@/utils/url';
import avatar from "@/assets/images/users/default-avatar.jpg";
import { getMinutesDiff, getTime } from '@/utils/date';
import { getReportStatusLabel } from '@/utils/status';
import CommonImage from '@/components/Image/index';
import DialogOpenImage from '../components/DialogOpenImage';

const StaffReport = () => {
  const roomId = localStorage.getItem(ID_ROOM);
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [listReports, setListReports] = useState<ReportsApiResponse | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowPerPgae, setRowPerPage] = useState(10);
  const { profile } = useAuth();
  const [openImage, setOpenImage] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const handleSearch = () => {
  }

  const fetchListReports = useCallback(async(id: string | number) => {
    setLoading(true)
    setError(null)
    try {
      const todayForApi = new Date().toISOString().split('T')[0];
      if(!roomId){
        setListReports(null);
        return
      }
      const res = await getListReports(page, rowPerPgae, id, todayForApi, roomId)
      setListReports(res);
      setTotal(res.totalCount)
    } catch (error: any) {
      setError(error.message)
      setListReports(null)
      setTotal(0)
    }finally{
      setLoading(false)
    }
  },[])

  useEffect(() => {
    if(profile){
      fetchListReports(profile.id)
    }
  },[page, rowPerPgae, roomId, profile])

  const handleOpenImage = (image: string) => {
    setImageUrl(image)
    setOpenImage(true)
  }
  return (
    <Box>
      <SearchBar
        onSearch={handleSearch}
        placeholder="Tìm kiếm"
        initialValue={searchTerm}
      />
      <Box>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3}}>
            <CircularProgress/>
          </Box>
        )}
        {error && !loading && (
          <Alert severity='error' sx={{ my: 2}}>{error}</Alert>
        )}
        {!loading && !error && (
          <Box sx={{ m: 2}}>
            <Grid container spacing={2}>
              {listReports?.reports.length === 0 ? (
                <Typography variant='body2'>Không tồn tại bản ghi nào cả</Typography>
              ) : (
                listReports?.reports.map((report) => {
                  const time = report?.startedAt && report?.completedAt && getTime(report?.startedAt, report?.completedAt)
                  const total = report?.startedAt && report?.completedAt && getMinutesDiff(report?.startedAt, report?.completedAt)
                  return(
                    <React.Fragment key={report.id}>
                      <Grid size={{ xs: 12, sm: 6, lg: 4}}>
                        <Card key={report.id} sx={{ borderRadius: 2, boxShadow: 2}}>
                          <CardContent>
                            <Stack direction='row' spacing={2} sx={{ mb: 2}} alignItems='center'>
                              <Box sx={{ cursor: 'pointer'}} onClick={() => report?.image_url && handleOpenImage(report?.image_url)}>
                                <CommonImage
                                  src={report?.image_url && getPathImage(report?.image_url)}
                                  alt='Image issue'
                                  width={200}
                                  height={200}
                                />
                              </Box>
                              <Box sx={{ flexGrow: 1}}>
                                <Typography sx={{ mb: 0.5}} variant='subtitle1' color='primary' fontWeight={500}>
                                  {report.title}
                                </Typography>
                                <Typography sx={{ mb: 0.5}} variant='body2'>
                                  {`${report.roomName}, ${report.floorName}`}
                                </Typography>
                                <Typography sx={{ mb: 0.5}} variant='body2'>
                                  {`${report.dueDate} | ${time} | ${total} phút `}
                                </Typography>
                                <Typography sx={{ mb: 0.5}} variant='body2'>
                                  {`Người dọn dẹp: ${report.reporter}`}
                                </Typography>
                                <Typography sx={{ mb: 0.5}} variant='body2'>
                                  {`Vấn đề báo cáo: ${report.description}`}
                                </Typography>
                                <Typography sx={{ mb: 0.5}} variant='body2'>
                                  {`Trạng thái: `}<b>{getReportStatusLabel(report.status)}</b>
                                </Typography>
                              </Box>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    </React.Fragment>
                  )
                })
              )}
            </Grid>
          </Box>
        )}
      </Box>
      {openImage && imageUrl && (
        <DialogOpenImage
          open={openImage}
          onClose={() => {
            setOpenImage(false)
          }}
          imageUrl={imageUrl}
        />
      )}
    </Box>
  );
};

export default StaffReport;
