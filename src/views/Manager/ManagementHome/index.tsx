import SearchBar from '@/components/SearchBar';
import { ROUTE_PATH } from '@/constants/routes';
import { Alert, Box, CircularProgress, Collapse, Grid, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CardInfo from '../components/CardInfoOfRoom';
import { DataRoomsProps, generateLink, getListRoom } from '@/services/manager.service';
import { Rooms, Tasks } from '@/types/manager';
import IconButton from '@/components/IconButton/IconButton';
import { NavigateBefore, NavigateNext } from '@mui/icons-material';
import CustomPagination from '@/components/Pagination/CustomPagination';
import { convertRoomPathToDisplayRemoteUrl } from '@/utils/url';
import TableTask from '../components/TableTask';
import DialogConformLink from '../components/DialogConformLink';
import DialogOpenGenerateCode from '../components/DialogOpenGenerateCode';
import DialogCopyLink from '../components/DialogCopyLink';


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
  const [openDialogGenerate, setOpenDialogGenerate] = useState(false);
  const [openDialogCopy, setOpenDialogCopy] = useState(false);

  const [title, setTitle] = useState<string>('');
  const [generateRoomId, setGenerateRoomId] = useState<string | number>('');
  const [existLink, setExistLink] = useState<string>('');
  

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
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadList(page, rowPerPage);
  }, [page, rowPerPage])

  const displayedRooms = showAll ? listRooms : listRooms.slice(0, 3);
  useEffect(() => {
    if (displayedRooms.length > 0 &&  displayedRooms[0].id && !showAll) {
      setExpandedRoomId(displayedRooms[0].id)
    }
  }, [displayedRooms[0]?.id, showAll])

  const handleOpenTable = (id: string | number) => {
    setExpandedRoomId(prev => (prev === id ? '' : id))
  }
  const pageSize = showAll ? 5 : 8

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

  const link = listRooms.find(r => r.id === generateRoomId)?.link_web;
  

  const handleOpenGenerateCode = (id: string | number) => {
    const linkWeb = listRooms.find(r => r.id === id)?.link_web;
    if(linkWeb){
      setTitle("Bạn đã tạo link phòng này rồi")
      setGenerateRoomId(id)
      setExistLink(linkWeb)
      setOpen(true)
    }else{  
      setGenerateRoomId(id)
      setOpenDialogGenerate(true)
    }
  }
  

  const handleGenerate = async () => {
    try {
      const data = {
        roomId: generateRoomId
      }
      const res = await generateLink(data);
      console.log(res)
      const room = res.data as any as Rooms;
      setListRooms(currentRooms =>
        currentRooms.map(prev =>
            prev.id === room.id
                ? { ...prev, link_web: room.link_web } 
                : prev 
        )
    );
      setOpen(true)
      setOpenDialogGenerate(false)
    } catch (error: any) {
      setError(error.message || "Tạo link thất bại");
    }
  }
  
  
  const handleCopy = async() => {
    if (link) {
      const urlLink = convertRoomPathToDisplayRemoteUrl(link);
      navigator.clipboard.writeText(urlLink)
      setOpenDialogCopy(true)
      setOpen(false)
    }
  };



  return (
    <Box>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }} >
          <CircularProgress />
        </Box>
      )}
      {error && !loading && (
        <Alert severity='error' sx={{ my: 2 }}>{error}</Alert>
      )}

      {showAll ?
        <>
          <Box onClick={handleShow} sx={{ backgroundColor: 'white', cursor: 'pointer' }} display='flex' justifyContent='start'>
            <IconButton
              handleFunt={handleShow}
              icon={<NavigateBefore sx={{ width: "28px", height: "28px" }} />}
            />
            <Typography fontWeight={500} variant='h6'>Xem tất cả</Typography>
          </Box>
          <Box
            sx={{
              m: 2,
              maxHeight: 'calc(100vh - 230px)',
              overflowY: 'auto', pr: 1,
              '&::-webkit-scrollbar': { width: '6px' },
              '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 1 },
            }}
          >
            <Grid sx={{ display: 'flex', flexGrow: 1 }} container spacing={2}>
              {displayedRooms?.map((room, index) => {
                bufferRooms.push(room)
                const isEndOfRow = (index + 1) % 3 === 0 || index === displayedRooms.length - 1;
                const shouldShowCollapse = bufferRooms.some(r => r.id === expandedRoomId)
                return (
                  <React.Fragment key={room.id}>
                    <Grid item xs={12} sm={6} lg={4} key={room.id}>
                      <CardInfo handleOpenTable={handleOpenTable} data={room} handleGenerate={handleOpenGenerateCode} />
                    </Grid>
                    {isEndOfRow && shouldShowCollapse && (
                      <>
                        <Grid item xs={12} >
                          <Collapse in={true} timeout='auto' unmountOnExit>
                            {errorTask && (
                              <Alert severity='error' sx={{ my: 2 }}>{errorTask}</Alert>
                            )}
                            {!errorTask && !loading && expandedRoomId && (
                              <TableTask
                                titleTypo={`Danh sách công việc phòng ${displayedRooms.find(r => r.id === expandedRoomId)?.room_number}, ${displayedRooms.find(r => r.id === expandedRoomId)?.floorName}`}
                                page={pageTask}
                                total={totalTask}
                                rowsPerPage={pageSize}
                                handlePageChange={handlePageTask}
                                listTask={[]}
                              />
                            )}
                          </Collapse>
                        </Grid>
                        {bufferRooms.length = 0}
                      </>
                    )}

                    <CustomPagination
                      count={total}
                      page={page}
                      rowsPerPage={rowPerPage}
                      onPageChange={handlePage}
                    />
                  </React.Fragment>
                )
              })}
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
          <Box
            sx={{
              m: 2,
              maxHeight: 'calc(100vh - 265px)',
              overflowY: 'auto', pr: 1,
              '&::-webkit-scrollbar': { width: '6px' },
              '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 1 },
            }}
          >
            {displayedRooms?.length === 0 ? (
              <Typography sx={{ mt: 4, textAlign: 'center' }}>Không tìm thấy bản ghi nào </Typography>
            ) : (
              <Grid sx={{ display: 'flex', flexGrow: 1 }} container spacing={3}>
                {displayedRooms?.map((room) => {
                  return (
                    <Grid key={room.id} item xs={12} sm={6} lg={4}>
                      <CardInfo handleOpenTable={handleOpenTable} handleGenerate={handleOpenGenerateCode} data={room} />
                    </Grid>
                  )
                })}
              </Grid>
            )}
          {listRooms.length > 0 && (
            <Box onClick={handleShow} sx={{ cursor: 'pointer' }} display='flex' justifyContent='end'>
              <Typography fontWeight={500} variant='h6'>Xem tất cả</Typography>
              <IconButton
                handleFunt={handleShow}
                icon={<NavigateNext sx={{ width: "28px", height: "28px" }} />}
              />
            </Box>
          )}
          {!showAll && (
          <Collapse in={!!expandedRoomId} timeout='auto' unmountOnExit>
            {errorTask && (
              <Alert severity='error' sx={{ my: 2 }}>{errorTask}</Alert>
            )}
            {!errorTask && !loading && expandedRoomId && (
              <TableTask
                titleTypo={`Danh sách công việc phòng ${displayedRooms.find(r => r.id === expandedRoomId)?.room_number}, ${displayedRooms.find(r => r.id === expandedRoomId)?.floorName}`}
                listTask={[]}
                page={pageTask}
                rowsPerPage={pageSize}
                total={totalTask}
                handlePageChange={handlePageTask}
              />
            )}
          </Collapse>
        )}
          </Box>
        </>
      }
      <DialogOpenGenerateCode
        open={openDialogGenerate}
        handleClose={() => setOpenDialogGenerate(false)}
        handleGenerate={handleGenerate}
      />
      {link  &&
      <DialogConformLink
        open={open}
        handleClose={() => setOpen(false)}
        title={title}
        displayedRooms={displayedRooms}
        generateRoomId={generateRoomId}
        handleCopy={handleCopy}
        link={link}
      />
      }
      {existLink  &&
      <DialogConformLink
        open={open}
        handleClose={() => setOpen(false)}
        title={title}
        displayedRooms={displayedRooms}
        generateRoomId={generateRoomId}
        handleCopy={handleCopy}
        link={existLink}
      />
      }
      <DialogCopyLink
        open={openDialogCopy}
        handleClose={() => setOpenDialogCopy(false)}
      />
    </Box>
  );
};

export default ManagementHome;