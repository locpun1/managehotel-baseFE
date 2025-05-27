import DialogComponent from "@/components/DialogComponent";
import ActionButton from "@/components/ProButton/ActionButton";
import { Box, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import React, { useEffect, useState,FormEvent } from "react";
import InputText from "./InputText";
import { createTask, getAllListFloor, getRoomByFloor } from "@/services/manager.service";
import { Floors, Rooms } from "@/types/manager";
import { Dayjs } from "dayjs";
import useAuth from "@/hooks/useAuth";
import { UserProfile } from "@/types/users";
import { Hotel, Layers } from "@mui/icons-material";
import InputSelect from "./InputSelect";

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

interface IconFloor extends Floors{
    icon: React.ReactNode
}

interface IconRoom extends Rooms{
    icon: React.ReactNode
}

interface TaskFormData {
  title: string;
  notes: string;
  quantity: number;
  status: string;
  assigned_by_id: string | number;
  room_id: number | string,
  floor_id: number | string,

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
        title: '', notes: '', quantity: 0, status: 'pending', assigned_by_id: '', room_id: '', floor_id: ''
    })

    const [listFloors, setListFloors] = useState<IconFloor[]>([]);
    const [listRooms, setListRooms] = useState<IconRoom[]>([])
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<'title' | 'notes' | 'quantity' | 'floor_id' | 'room_id', string>>>({});
    const [infoCurrentUser, setInfoCurrentUser] = useState<UserProfile | null>(null)
    const { profile} = useAuth();
    

    const handleClose = () => {
        onClose()
        setFormData({
            title: '', notes: '', quantity: 0, status: 'pending', assigned_by_id: '', room_id: '', floor_id: ""
        })
        setErrors({})
    }

    useEffect(() => {
        if(open && profile){
            setInfoCurrentUser(profile)
            const getList = async() => {
                const res = await getAllListFloor();
                const data = res as any as DataFloors
                const dataFloor: IconFloor[] = data.data.map(
                    (floor) => ({
                        ...floor,
                        icon:<Layers/>
                    })
                )
                setListFloors(dataFloor)     
            }
            getList()
        }
    }, [open, profile])
    

    useEffect(() => {
        if(formData && formData.floor_id){
            const getRooms = async() => {
                setLoading(true);
                try {
                    const resRoom = await getRoomByFloor(formData.floor_id)
                    const data = resRoom as any as DataRooms;
                    const dataRoom: IconRoom[] = data.data.map(
                        (room) => ({
                            ...room,
                            icon:<Hotel/>
                        })
                    )
                    setListRooms(dataRoom)
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
        }
    },[formData])


    const handleCustomInputChange = (name: string, value: string | number| null | Dayjs) => {
        if (Object.prototype.hasOwnProperty.call(formData, name)) {
            const validName = name as keyof TaskFormData; 
  
      setFormData((prevData) => ({
        ...prevData,
        [validName]: name === 'quantity' ? Number(value) : value, 
      }));

      if (validName === 'title' || validName === 'notes' || validName === 'quantity' || validName === 'floor_id' || validName === 'room_id') {
          if (errors[validName as 'title' | 'notes' | 'quantity' | 'floor_id' | 'room_id']) {
              setErrors(prev => {
                  const newErrors = { ...prev };
                  delete newErrors[validName as 'title' | 'notes' | 'quantity' | 'floor_id' | 'room_id'];
                  return newErrors;
              });
          }
      }
    } else {
      console.warn(`CustomInput called onChange with an unexpected name: ${name}`);
    }
    }

  const validateForm = (): boolean => {
      const newErrors: Partial<Record<'title' | 'notes' | 'quantity' | 'floor_id' | 'room_id', string>> = {};
      if (!formData.title.trim()) newErrors.title = 'Tên công việc là bắt buộc';
      if (!formData.notes.trim()) {
          newErrors.notes = 'Yêu cầu là bắt buộc';
      }
      if (!formData.quantity) newErrors.quantity = 'Số lượng là bắt buộc';
      if (!formData.floor_id) newErrors.floor_id = 'Số tầng là bắt buộc';
      if (!formData.room_id) newErrors.room_id = 'Số phòng là bắt buộc';
      // Thêm validation khác nếu cần

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0; // True nếu không có lỗi
  };

      const handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(!validateForm()){
            return;
        }
        const id = infoCurrentUser !== null ? infoCurrentUser.id : "" ;
        
        const data = {
            ...formData,
            "assigned_by_id": id,
            "createdAt":new Date(),
            "updatedAt":new Date(),       
        }
        const { floor_id, ...payload} = data;
        const res = await createTask(payload)
        console.log("res: ", res);
        
        
    }

    return (
        <DialogComponent
            hasError={Object.keys(errors).length > 0}
            dialogKey={open}
            handleClose={handleClose}
            dialogTitle={title}
            customButtons={
                <ActionButton form="create-task-form" backgroundColor="#00C7BE" actionType='save'>
                    Lưu
                </ActionButton>
            }
        >
            <Box id="create-task-form" component='form' onSubmit={handleSubmit}>
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
                            error={!!errors.title}
                            helperText={errors.title}
                            margin="dense"
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
                            error={!!errors.notes}
                            helperText={errors.notes}
                            margin="dense"
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
                            onlyPositiveNumber
                            error={!!errors.quantity}
                            helperText={errors.quantity}
                            margin="dense"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" fontWeight={600} gutterBottom>Số tầng</Typography>
                                <InputSelect
                                    name="floor_id"
                                    label=""
                                    value={formData.floor_id}
                                    onChange={handleCustomInputChange}
                                    options={listFloors}
                                    transformOptions={(data) =>
                                        data.map((item) => ({
                                          value: item.id,
                                          label: item.name,
                                          icon: item.icon
                                        }))
                                    }
                                    placeholder="Số tầng"
                                    error={!!errors.floor_id}
                                    helperText={errors.floor_id}
                               />

                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography id="rooms-select-label" variant="body2" fontWeight={600} gutterBottom>Số phòng</Typography>
                                <InputSelect
                                    disabled={!formData.floor_id || loading}
                                    loading={loading}
                                    label=""
                                    name="room_id"
                                    value={formData.room_id}
                                    onChange={handleCustomInputChange}
                                    options={listRooms}
                                    MenuProps={MenuProps}
                                    transformOptions={(data) =>
                                        data.map((item) => ({
                                            value: item.id,
                                            label: `Phòng ${item.room_number}`,
                                            icon: item.icon
                                        }))
                                    }
                                    placeholder="Số phòng"
                                    error={!!errors.room_id}
                                    helperText={errors.room_id}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

            </Box>

        </DialogComponent>
    )
}

export default DialogCreateTask;