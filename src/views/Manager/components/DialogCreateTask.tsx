import DialogComponent from "@/components/DialogComponent";
import ActionButton from "@/components/ProButton/ActionButton";
import { Box, CircularProgress, Grid, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import React, { useEffect, useState,FormEvent } from "react";
import InputText from "./InputText";
import { getAllListFloor, getRoomByFloor } from "@/services/manager.service";
import { Floors, Rooms } from "@/types/manager";
import { Dayjs } from "dayjs";
import useAuth from "@/hooks/useAuth";
import { UserProfile } from "@/types/users";

interface DialogCreateTaskProps{
    open:boolean,
    title?: string,
    onClose: () => void;
}

interface DataFloors{
    data: Floors[],
}
interface DataRooms{
    data: Rooms[],
}

interface TaskFormData {
  title: string;
  notes: string;
  quantity: number | string;
  status: string;
  assigned_by_id: string | number;
  room_id: number | string,
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MAX_VISIBLE_ITEMS = 5;

const MenuProps = {
  PaperProps: {
   sx: {
      maxHeight: ITEM_HEIGHT * MAX_VISIBLE_ITEMS + ITEM_PADDING_TOP,
      width: 300,

      /* Custom scrollbar cho Chrome, Edge, Safari */
      '&::-webkit-scrollbar': {
        width: '8px',
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: '#f1f1f1',
        borderRadius: '4px',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#888',
        borderRadius: '4px',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: '#555',
      },

      /* Custom scrollbar cho Firefox */
      scrollbarWidth: 'thin',
      scrollbarColor: '#888 #f1f1f1',
    },
  },
};

const DialogCreateTask: React.FC<DialogCreateTaskProps> = (props) => {
    const {open, title, onClose} = props;
    const [formData, setFormData] = useState<TaskFormData>({
        title: '', notes: '', quantity: '', status: 'pending', assigned_by_id: '', room_id: ''
    })

    const [listFloors, setListFloors] = useState<Floors[]>([]);
    const [selectedFloor, setSelectedFloor] = useState<number | string>('')
    const [selectedRoom, setSelectedRoom] = useState<number | string>('')
    const [listRooms, setListRooms] = useState<Rooms[]>([])
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<'title' | 'notes' | 'quantity', string>>>({});
    const [infoCurrentUser, setInfoCurrentUser] = useState<UserProfile | null>(null)
    const { profile} = useAuth();
    

    const handleClose = () => {
        onClose()
        setSelectedFloor('')
        setSelectedRoom('')
    }

    useEffect(() => {
        if(open && profile){
            setInfoCurrentUser(profile)
            const getList = async() => {
                const res = await getAllListFloor();
                const data = res as any as DataFloors
                setListFloors(data.data)     
            }
            getList()
        }
    }, [open, profile])

    useEffect(() => {
        if(selectedFloor){
            const getRooms = async() => {
                setLoading(true);
                try {
                    const resRoom = await getRoomByFloor(selectedFloor)
                    const data = resRoom as any as DataRooms;
                    setListRooms(data.data)
                } catch (error) {
                    console.error('Lấy phòng thất bại:', error);
                    setListRooms([])
                }finally{
                    setLoading(false)
                }

            }
            getRooms()
        }else{
            // Nếu không chọn tầng thì clear danh sách phòng
            setListRooms([]);
            setSelectedRoom('');
        }
    },[selectedFloor])


    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const id = infoCurrentUser !== null && infoCurrentUser.id ;
        const data = new FormData();
        data.append('title', formData.title);
        data.append('notes', formData.notes);
        data.append('quantity', String(formData.quantity));
        data.append('status', 'pending');
        data.append('assigned_by_id', String(id));
        data.append('room_id', String(selectedRoom));
        console.log("data: ", data);
        
    }

    const handleCustomInputChange = (name: string, value: string | number| null | Dayjs) => {
        if (Object.prototype.hasOwnProperty.call(formData, name)) {
            const validName = name as keyof TaskFormData; 
  
      setFormData((prevData) => ({
        ...prevData,
        [validName]: value, 
      }));

      if (validName === 'title' || validName === 'notes' || validName === 'quantity') {
          if (errors[validName as 'title' | 'notes' | 'quantity']) {
              setErrors(prev => {
                  const newErrors = { ...prev };
                  delete newErrors[validName as 'title' | 'notes' | 'quantity'];
                  return newErrors;
              });
          }
      }
    } else {
      console.warn(`CustomInput called onChange with an unexpected name: ${name}`);
    }
    }

    return (
        <DialogComponent
            dialogContentHeight={450}
            dialogKey={open}
            handleClose={handleClose}
            dialogTitle={title}
            customButtons={
                <ActionButton  backgroundColor="#00C7BE" actionType='save'>
                    Lưu
                </ActionButton>
            }
        >
            <Box component='form' onSubmit={handleSubmit}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant="body2" fontWeight={600} gutterBottom>Tên công việc</Typography>
                        <InputText
                            label=""
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleCustomInputChange}
                            placeholder="Tên công việc"
                            sx={{ mt: 0 }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body2" fontWeight={600} gutterBottom>Yêu cầu</Typography>
                        <InputText
                            label=""
                            type="text"
                            name="notes"
                            value={formData.notes}
                            onChange={handleCustomInputChange}
                            placeholder="Yêu cầu"
                            sx={{ mt: 0 }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body2" fontWeight={600} gutterBottom>Số lượng</Typography>
                        <InputText
                            label=""
                            type="text"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleCustomInputChange}
                            placeholder="Số lượng"
                            sx={{ mt: 0 }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item xs={12} md={6}>
                                <Typography id="floors-select-label" variant="body2" fontWeight={600} gutterBottom>Số tầng</Typography>
                                <Select
                                    displayEmpty
                                    labelId="floors-select-label"
                                    id="floors-select"
                                    value={selectedFloor}
                                    onChange={(e) => setSelectedFloor(e.target.value)}
                                    renderValue={(selected) =>
                                        selected ? listFloors.find(f => f.id === selected)?.name : <span style={{ color: '#aaa' }}>Số tầng</span>
                                    }
                                    sx={{
                                        "& .MuiOutlinedInput-notchedOutline":{
                                            border:"1px solid rgb(82, 81, 81)",
                                            borderRadius:"8px",
                                        },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            border:"1px solid rgb(82, 81, 81)"
                                        },
                                    }}
                                >
                                    {listFloors.map(option => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography id="rooms-select-label" variant="body2" fontWeight={600} gutterBottom>Số phòng</Typography>
                                <Select
                                    disabled={!selectedFloor || loading}
                                    displayEmpty
                                    labelId="rooms-select-label"
                                    id="rooms-select"
                                    value={selectedRoom}
                                    onChange={(e) => setSelectedRoom(e.target.value)}
                                    renderValue={(selected) =>
                                        selected ? listRooms.find(f => f.id === selected)?.room_number : <span style={{ color: '#aaa' }}>Số phòng</span>
                                    }
                                    sx={{
                                        "& .MuiOutlinedInput-notchedOutline":{
                                            border:"1px solid rgb(82, 81, 81)",
                                            borderRadius:"8px",
                                        },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            border:"1px solid rgb(82, 81, 81)"
                                        },
                                    }}
                                    MenuProps={MenuProps}
                                >
                                    {loading ? (
                                        <MenuItem disabled>
                                            <CircularProgress size={20}/>
                                            &nbsp; Đang tải phòng...
                                        </MenuItem>
                                    ): listRooms.length > 0 ? (
                                        listRooms.map(option => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {`Phòng ${option.room_number}`}
                                        </MenuItem>
                                    ))) : (
                                        <MenuItem disabled>Không có phòng</MenuItem>
                                    )}
                                </Select>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

            </Box>

        </DialogComponent>
    )
}

export default DialogCreateTask;