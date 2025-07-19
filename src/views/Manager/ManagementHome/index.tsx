import SearchBar from '@/components/SearchBar';
import { ROUTE_PATH } from '@/constants/routes';
import { Alert, Box, CircularProgress, Collapse, Grid, Typography } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CardInfo from '../components/CardInfoOfRoom';
import { DataGroupTaskProps, generateLink, getListGroupTask } from '@/services/manager.service';
import { GroupTasks, Rooms } from '@/types/manager';
import IconButton from '@/components/IconButton/IconButton';
import { NavigateBefore, NavigateNext } from '@mui/icons-material';
import CustomPagination from '@/components/Pagination/CustomPagination';
import { convertRoomPathToDisplayRemoteUrl } from '@/utils/url';
import DialogConformLink from '../components/DialogConformLink';
import DialogOpenGenerateCode from '../components/DialogOpenGenerateCode';
import DialogCopyLink from '../components/DialogCopyLink';
import TableTaskByGroupTask from '../components/TableTaskByGroupTask';


const ManagementHome = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState(null);

  const [listGroupTasks, setListGroupTasks] = useState<GroupTasks[]>([]);

  const [page, setPage] = useState(0)

  const [rowPerPage, setRowPerPage] = useState(9)

  const [total, setTotal] = useState(0)

  const [showAll, setShowAll] = useState(false);
  const [expandedGroupTaskId, setExpandedGroupTaskId] = useState<string | number>('');
  const [groupTaskId, setGroupTaskId] = useState<string | number>('');

  const bufferRooms: GroupTasks[] = [];

  const [open, setOpen] = useState(false);
  const [openDialogGenerate, setOpenDialogGenerate] = useState(false);
  const [openDialogCopy, setOpenDialogCopy] = useState(false);

  const [title, setTitle] = useState<string>('');
  const [generateGroupTaskId, setGenerateGroupTaskId] = useState<string | number>('');
  const [roomTask, setRoomTask] = useState<string>('');
  const [existLink, setExistLink] = useState<string>('');
  

  const handleSearch = () => {
  }

  const loadList = useCallback(async (currentPage: number, currentLimit: number) => {
    setLoading(true)
    setError(null)
    try {
      const date = new Date().toISOString().split('T')[0];
      const res = await getListGroupTask(currentPage, currentLimit, date);
      const data = res.data as any as DataGroupTaskProps;
      setListGroupTasks(data.result.data)
      setTotal(data.result.totalCount)
    } catch (error: any) {
      setError(error.message);
      setListGroupTasks([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadList(page, rowPerPage);
  }, [page, rowPerPage])

  useEffect(() => {
    if (!loading && listGroupTasks.length > 0 && !showAll) {
      setExpandedGroupTaskId(prev => prev || listGroupTasks[0].id)
      setGroupTaskId(prev => prev || listGroupTasks[0].id)
    }
  }, [loading,listGroupTasks, showAll])

  // Tính toán danh sách hiển thị
  const displayedRooms = useMemo(() => {
    if (listGroupTasks.length === 0) return [];
    return showAll ? listGroupTasks : listGroupTasks.slice(0, 3);
  }, [listGroupTasks, showAll]);

  const handleOpenTable = (id: string | number) => {
    setExpandedGroupTaskId(prev => (prev === id ? '' : id))
    setGroupTaskId(id)
  }

  const handleShow = () => {
    setShowAll(prev => {
      if (prev) setExpandedGroupTaskId('');
      return !prev;
    });
  }

  const handlePage = (newPage: number) => {
    setPage(newPage)
  }

  const handleOpenGenerateCode = (id: string | number, room: string) => {
      setGenerateGroupTaskId(id)
      setRoomTask(room)
      setOpenDialogGenerate(true)
  }
  

  const handleGenerate = async () => {
    try {
      const data = {
        id: generateGroupTaskId,
        room: roomTask
      }
      const res = await generateLink(data);
      const room = res.data as any as GroupTasks;
      room.link_url && setExistLink(room.link_url)
      setListGroupTasks(currentRooms =>
        currentRooms.map(prev =>
            prev.id === room.id
                ? { ...prev, link_web: room.link_url } 
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
    if (existLink) {
      const urlLink = convertRoomPathToDisplayRemoteUrl(existLink);
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
                const shouldShowCollapse = bufferRooms.some(r => r.id === expandedGroupTaskId)
                return (
                  <React.Fragment key={room.id}>
                    <Grid item xs={12} sm={6} lg={4} key={room.id}>
                      <CardInfo link_url={existLink} personalPhoto={room.avatarUrlStaff} handleOpenTable={handleOpenTable} data={room} handleGenerate={handleOpenGenerateCode} />
                    </Grid>
                    {isEndOfRow && shouldShowCollapse && (
                      <>
                        <Grid item xs={12} >
                          <Collapse in={true} timeout='auto' unmountOnExit>
                            {!loading && expandedGroupTaskId && (
                              <TableTaskByGroupTask
                                id={groupTaskId}
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
                    <React.Fragment key={room.id}>
                      <Grid key={room.id} item xs={12} sm={6} lg={4}>
                        <CardInfo link_url={existLink} personalPhoto={room.avatarUrlStaff} handleOpenTable={handleOpenTable} handleGenerate={handleOpenGenerateCode} data={room} />
                      </Grid>
                    </React.Fragment>
                  )
                })}
              </Grid>
            )}
          {listGroupTasks.length > 0 && (
            <Box onClick={handleShow} sx={{ cursor: 'pointer' }} display='flex' justifyContent='end'>
              <Typography fontWeight={500} variant='h6'>Xem tất cả</Typography>
              <IconButton
                handleFunt={handleShow}
                icon={<NavigateNext sx={{ width: "28px", height: "28px" }} />}
              />
            </Box>
          )}
          {!showAll && expandedGroupTaskId && (
            <Collapse in={!!expandedGroupTaskId} timeout='auto' unmountOnExit>
              {!loading && expandedGroupTaskId && (
                <TableTaskByGroupTask
                  id={groupTaskId}
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
      {existLink  &&
      <DialogConformLink
        open={open}
        handleClose={() => setOpen(false)}
        title={title}
        displayedRooms={displayedRooms}
        generateGroupTaskId={generateGroupTaskId}
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