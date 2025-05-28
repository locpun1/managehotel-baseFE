import SearchBar from '@/components/SearchBar';
import { ROUTE_PATH } from '@/constants/routes';
import { Box, Button, Grid, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CardInfo from '../components/CardInfoOfRoom';
import { DataRoomsProps, getListRoom } from '@/services/manager.service';
import { Rooms } from '@/types/manager';
import IconButton from '@/components/IconButton/IconButton';
import { ArrowRight, NavigateBefore, NavigateNext } from '@mui/icons-material';


const ManagementHome = () => {
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [listRooms, setListRooms] = useState<Rooms[]>([]);
  const [page, setPage] = useState(0)
  const [rowPerPage, setRowPerPage] = useState(8)
  const [total, setTotal] = useState(0)
  const [showAll, setShowAll] = useState(false);

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
  
  return (
    <Box>
      {showAll ?
      <>
        <Box sx={{ backgroundColor: 'white'}} display='flex' justifyContent='start'>
          <IconButton
            handleFunt={() => setShowAll(!showAll)}
            icon={<NavigateBefore sx={{ width:"28px", height:"28px"}}/>}
          />
          <Typography fontWeight={500} variant='h6'>Xem tất cả</Typography>
        </Box>
        <Box sx={{ m:2}}>
          <Grid sx={{ display: 'flex', flexGrow: 1}} container spacing={3}>
            {displayedRooms?.map((room) => {
              return (
                <Grid item xs={12} sm={6} lg={4}>
                  <CardInfo data={room}/>
                </Grid>
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
      <Box sx={{ m:2}}>
        <Grid sx={{ display: 'flex', flexGrow: 1}} container spacing={3}>
          {displayedRooms?.map((room) => {
            return (
              <Grid item xs={12} sm={6} lg={4}>
                <CardInfo data={room}/>
              </Grid>
            )
          })}
        </Grid>
      </Box>
      <Box display='flex' justifyContent='end'>
        <Typography fontWeight={500} variant='h6'>Xem tất cả</Typography>
        <IconButton
          handleFunt={() => setShowAll(!showAll)}
          icon={<NavigateNext sx={{ width:"28px", height:"28px"}}/>}
        />
      </Box>
      </>
      }
    </Box>
  );
};

export default ManagementHome;
