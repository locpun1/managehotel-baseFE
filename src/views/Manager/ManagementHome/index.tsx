import SearchBar from '@/components/SearchBar';
import { ROUTE_PATH } from '@/constants/routes';
import { Alert, Box, Button, Chip, CircularProgress, Collapse, Dialog, DialogContent, DialogTitle, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CardInfo from '../components/CardInfoOfRoom';
import { DataRoomsProps, DataTaskProps, generateLink, getListRoom, getListTask, LinkResponse } from '@/services/manager.service';
import { Rooms, Tasks } from '@/types/manager';
import IconButton from '@/components/IconButton/IconButton';
import { ContentCopy, NavigateBefore, NavigateNext } from '@mui/icons-material';
import { getStatusChipColor, getStatusLabel } from '../ManagementWork';
import CustomPagination from '@/components/Pagination/CustomPagination';
import { convertRoomPathToDisplayRemoteUrl } from '@/utils/url';
import { useRoomLinkContext } from '@/contexts/RoomLinkContext';
import useNotification from '@/hooks/useNotification';


const ManagementHome = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState(null);
  const [errorTask, setErrorTask] = useState(null);
  
  const [listRooms, setListRooms] = useState<Rooms[]>([]);
  const [listTasks, setListTask] = useState<Tasks[]>([]);
  
  const [page, setPage] = useState(0)
  const [pageTask, setPageTask] = useState(0)

  const [rowPerPage, setRowPerPage] = useState(9)

  const [total, setTotal] = useState(0)
  const [totalTask, setTotalTask] = useState(0)

  const [showAll, setShowAll] = useState(false);
  const [expandedRoomId, setExpandedRoomId] = useState<string | number>('');
  const bufferRooms: Rooms[] = [];

  const [open, setOpen] = useState(false);
  const { link, setLink } = useRoomLinkContext();
  const [roomId, setRoomId] = useState<any>('');

  const notify = useNotification()


  const handleSearch = () => {
  }

  const loadList = useCallback(async (currentPage: number, currentLimit: number) => {
    setLoading(true)
    setError(null)
    try {
      const res = await getListRoom(currentPage, currentLimit);
      const data = res.data as any as DataRoomsProps;
      setListRooms(data.data)
      setTotal(data.totalCount)
    } catch (error: any) {
      setError(error.message);
      setListRooms([])
    }finally{
      setLoading(false)
    }
  },[])

  useEffect(() => {
    loadList(page, rowPerPage);
  }, [page, rowPerPage])
  
  const displayedRooms = showAll ? listRooms : listRooms.slice(0, 3);
  useEffect(() => {
    if((displayedRooms.length > 0 && displayedRooms[0]) && !showAll){
      setExpandedRoomId(displayedRooms[0].id)
    }
  },[displayedRooms[0], showAll])

  const handleOpenTable = (id: string | number) => {
    setExpandedRoomId(prev => (prev === id ? '' : id))
  }

  const fetchListTask = useCallback(async (currentPage: number, currentLimit: number, roomId?: number | string) => {
    setErrorTask(null)
    try {
      const res = await getListTask(currentPage, currentLimit,roomId)
      const data = res.data as any as DataTaskProps
      setListTask(data.result.data)
      setTotalTask(data.result.totalCount)
    } catch (error: any) {
      setErrorTask(error.message);
      setListTask([])
    }
    }, [])
    const pageSize = showAll ? 5 : 8

  useEffect(() => {
      if(expandedRoomId){
        
        fetchListTask(pageTask, pageSize, expandedRoomId)
      }
  },[expandedRoomId,pageTask, pageSize])
  
  const handleShow = () => {
    setShowAll(!showAll)
    setExpandedRoomId('')
  }

  const handlePageTask = (newPageTask: number) => {
    setPageTask(newPageTask)
  }

    const handlePage = (newPage: number) => {
    setPage(newPage)
  }

  const newLink = link[roomId];

  const handleGenerate = async(id: number | string) => {
    setExpandedRoomId('')
    setRoomId(id)
    if(newLink) return
    try {
      const data = {
        roomId:id
      }
      const res = await generateLink(data);
      const link = res.data as any as LinkResponse;
      const clientPath = convertRoomPathToDisplayRemoteUrl(link.link);
      setLink(id,clientPath)
      setOpen(true)
    } catch (error: any) {
      setError(error.message || "Tạo link thất bại");
    }
  }

  const handleCopy = () => {
    if (link) {
      navigator.clipboard.writeText(newLink);
      notify({
        message:"Sao chép thành công",
        severity: "success"
      })
    };
  };

  return (
    <Box>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my:3}} >
          <CircularProgress/>
        </Box>
      )}
      {error && !loading && (
        <Alert severity='error' sx={{ my: 2}}>{error}</Alert>
      )}

      {showAll ?
      <>
        <Box onClick={handleShow} sx={{ backgroundColor: 'white', cursor: 'pointer'}} display='flex' justifyContent='start'>
          <IconButton
            handleFunt={handleShow}
            icon={<NavigateBefore sx={{ width:"28px", height:"28px"}}/>}
          />
          <Typography fontWeight={500} variant='h6'>Xem tất cả</Typography>
        </Box>
        <Box
          sx={{
                m:2,
                maxHeight: 'calc(100vh - 230px)', 
                overflowY: 'auto', pr: 1,
                '&::-webkit-scrollbar': { width: '6px' },
                '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 1 },
              }}
        >
          <Grid sx={{ display: 'flex', flexGrow: 1}} container spacing={2}>
            {displayedRooms?.map((room, index) => {
              bufferRooms.push(room)
              const isEndOfRow = (index + 1) % 3 === 0 || index === displayedRooms.length - 1;
              const shouldShowCollapse = bufferRooms.some(r => r.id === expandedRoomId)
              return (
                <React.Fragment key={room.id}>
                  <Grid item xs={12} sm={6} lg={4} key={room.id}>
                    <CardInfo handleOpenTable={handleOpenTable} data={room} handleGenerate={handleGenerate}/>
                  </Grid>
                  {isEndOfRow && shouldShowCollapse && (
                    <>
                      <Grid item xs={12} >
                        <Collapse in={true} timeout='auto' unmountOnExit>
                          {errorTask && (
                              <Alert severity='error' sx={{ my: 2}}>{errorTask}</Alert>
                            )}
                            {!errorTask && !loading && expandedRoomId && (
                              <Box sx={{ mt: 2}}>
                                <Typography fontWeight={500}>Danh sách công việc phòng {displayedRooms.find(r => r.id === expandedRoomId)?.room_number}, {displayedRooms.find(r => r.id === expandedRoomId)?.floorName} </Typography>
                                <TableContainer component={Paper}>
                                  <Table stickyHeader aria-label="task">
                                    <TableHead>
                                      <TableRow sx={{ height:"50px"}}>
                                        {[ 'Tầng', 'Phòng', 'Công việc', 'Số lượng', 'Tiến độ', 'Bắt đầu', 'Kết thúc'].map((header) => (
                                          <TableCell key={header} align='center' sx={{ fontWeight: 'bolid', backgroundColor: '#00C7BE'}}>
                                            {header}
                                          </TableCell>
                                        ))}
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {listTasks?.length === 0 ? (
                                        <TableRow>
                                          <TableCell colSpan={7} align='center'>
                                            Không tìm thấy bản ghi nào cả
                                          </TableCell>
                                        </TableRow>
                                      ) : (
                                        listTasks?.map((task) => {
                                          const statusLabel = getStatusLabel(task.status);
                                          const statusColor = getStatusChipColor(task.status); 
                                          return(
                                            <TableRow hover key={task.id}>
                                              <TableCell align='center'>{task.floorName}</TableCell>
                                              <TableCell align='center'>{task.roomName}</TableCell>
                                              <TableCell align='center'>{task.title}</TableCell>
                                              <TableCell align='center'>{task.quantity}</TableCell>
                                              <TableCell align='center'>
                                                <Chip label={statusLabel} size='small' color={statusColor} />
                                              </TableCell>
                                              <TableCell align='center'>{task.started_at || " "}</TableCell>
                                              <TableCell align='center'>{task.completed_at || " "}</TableCell>
                                            </TableRow>
                                          )
                                        })
                                      )}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                                <CustomPagination
                                  count={totalTask}
                                  page={pageTask}
                                  rowsPerPage={pageSize}
                                  sx={{ mt: 2, mb: 1}}
                                  onPageChange={handlePageTask}
                                />
                            </Box>
                            )}
                        </Collapse>
                      </Grid>
                    {bufferRooms.length = 0} {/* reset buffer sau mỗi hàng*/}
                    </>
                    )}
                </React.Fragment>
              )
            })}
            <CustomPagination
                count={total}
                page={page}
                rowsPerPage={rowPerPage}
                onPageChange={handlePage}
            />

          </Grid>


        </Box>


      </>
      :
      <>
      <SearchBar
        onSearch={handleSearch}
        placeholder='Tìm kiếm'
        initialValue={searchTerm}
        isCheckOpenCreate={location.pathname === `/${ROUTE_PATH.MANAGE}/${ROUTE_PATH.MANAGE_HOME}`}
      />
      <Box sx={{ m:2}}>
        {displayedRooms?.length === 0 ? (
          <Typography sx={{ mt: 4, textAlign: 'center'}}>Không tìm thấy bản ghi nào </Typography>
        ):(
          <Grid sx={{ display: 'flex', flexGrow: 1}} container spacing={3}>
          {displayedRooms?.map((room) => {
            return (
              <Grid item xs={12} sm={6} lg={4}>
                <CardInfo handleOpenTable={handleOpenTable} handleGenerate={handleGenerate} data={room}/>
              </Grid>
            )
          })}
        </Grid>
        )}

      </Box>
      {listRooms.length > 0 && (
        <Box onClick={handleShow} sx={{ cursor: 'pointer'}} display='flex' justifyContent='end'>
          <Typography fontWeight={500} variant='h6'>Xem tất cả</Typography>
          <IconButton
            handleFunt={handleShow}
            icon={<NavigateNext sx={{ width:"28px", height:"28px"}}/>}
          />
        </Box>
      )}
      </>
      }

      {/* Collapse when click on one card of room => show detail task in that */}
      {!showAll && (
              <Collapse in={!!expandedRoomId} timeout='auto' unmountOnExit>
        {errorTask && (
          <Alert severity='error' sx={{ my: 2}}>{errorTask}</Alert>
        )}
        {!errorTask && !loading && expandedRoomId && (
              <Box sx={{ m:2}}>
              <Typography fontWeight={500}>Danh sách công việc phòng {displayedRooms.find(r => r.id === expandedRoomId)?.room_number}, {displayedRooms.find(r => r.id === expandedRoomId)?.floorName} </Typography>
              <TableContainer component={Paper}>
                <Table stickyHeader aria-label="task">
                  <TableHead>
                    <TableRow sx={{ height:"50px"}}>
                      {[ 'Tầng', 'Phòng', 'Công việc', 'Số lượng', 'Tiến độ', 'Bắt đầu', 'Kết thúc'].map((header) => (
                        <TableCell key={header} align='center' sx={{ fontWeight: 'bolid', backgroundColor: '#00C7BE'}}>
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listTasks?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align='center'>
                          Không tìm thấy bản ghi nào cả
                        </TableCell>
                      </TableRow>
                    ) : (
                      listTasks?.map((task) => {
                        const statusLabel = getStatusLabel(task.status);
                        const statusColor = getStatusChipColor(task.status); 
                        return(
                          <TableRow hover key={task.id}>
                            <TableCell align='center'>{task.floorName}</TableCell>
                            <TableCell align='center'>{task.roomName}</TableCell>
                            <TableCell align='center'>{task.title}</TableCell>
                            <TableCell align='center'>{task.quantity}</TableCell>
                            <TableCell align='center'>
                              <Chip label={statusLabel} size='small' color={statusColor} />
                            </TableCell>
                            <TableCell align='center'>{task.started_at || " "}</TableCell>
                            <TableCell align='center'>{task.completed_at || " "}</TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <CustomPagination
                count={totalTask}
                page={pageTask}
                rowsPerPage={pageSize}
                sx={{ mt: 2, mb: 1}}
                onPageChange={handlePageTask}
              />
          </Box>
          )}
        
      </Collapse>
      )}

       <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent style={{ textAlign: "center", minWidth: 500 }}>
          <Typography fontWeight={500}>
            Tạo đường link thành công, Phòng: {displayedRooms.find(r => r.id === roomId)?.room_number}
          </Typography>
          {link && (
            <>
            <Box sx={{ border: "1px solid rgb(164, 165, 165)", borderRadius: "5px", padding:2, mt:2}} >
              <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                {newLink}
              </Typography>
            </Box>
              <Button
                variant="contained"
                startIcon={<ContentCopy />}
                onClick={handleCopy}
                sx={{ mt: 2, backgroundColor:"#00C7BE" }}
              >
                Sao chép link
              </Button>
              <Button
                variant="outlined"
                onClick={() => setOpen(false)}
                sx={{ mt: 2, ml: 2 }}
              >
                Đóng
              </Button>
            </>
          )}
          {!link && (
            <Typography color="error" sx={{ mt: 2 }}>
              Không thể tạo link. Vui lòng thử lại.
            </Typography>
          )}
        </DialogContent>
      </Dialog>

    </Box>
  );
};

export default ManagementHome;
