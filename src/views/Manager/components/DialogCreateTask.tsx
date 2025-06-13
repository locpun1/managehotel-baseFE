import DialogComponent from "@/components/DialogComponent";
import ActionButton from "@/components/ProButton/ActionButton";
import { Box, CircularProgress, Grid, TextField, Typography } from "@mui/material";
import React, { useEffect, useState,FormEvent, useMemo } from "react";
import InputText from "./InputText";
import { createTask, DataTaskProps, getAllListFloor, getRoomByFloor, updateTask } from "@/services/manager.service";
import { Floors, GroupTasks, Rooms, Tasks } from "@/types/manager";
import dayjs, { Dayjs } from "dayjs";
import useAuth from "@/hooks/useAuth";
import { UserProfile } from "@/types/users";
import { AddCircleOutline, Hotel, Layers, RemoveCircleOutline } from "@mui/icons-material";
import InputSelect from "./InputSelect";
import useNotification from "@/hooks/useNotification";
import { TaskStatus } from "@/constants/taskStatus";
import IconButton from "@/components/IconButton/IconButton";
import { getDetailTask } from "@/services/task-service";

interface DialogCreateTaskProps{
    open:boolean,
    title?: string,
    onClose: () => void;
    handleLoadList?:(data: any) => void;
    taskId?: string | number;
    from?:string, 
    setReloadKey?: React.Dispatch<React.SetStateAction<number>>
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
    floor_id: number | string,
    room_id: number | string,
    name: string;
    notes: string;
    quantity: number;
    status: TaskStatus;
    assigned_by_id: string | number;
}

interface TaskItemData {
    title: string,
    order_in_process: number,
    status: TaskStatus,
}

interface DateTask extends TaskItemData{
    due_date: string
}


interface DataTask{
    task: GroupTasks
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
    const {open, title, onClose, handleLoadList, taskId, from, setReloadKey} = props;
    const [formData, setFormData] = useState<TaskFormData>({
        name: 'Dọn dẹp phòng', notes: '', quantity: 0, status: TaskStatus.PENDING, assigned_by_id: '', room_id: '', floor_id: ''
    })

    const [listFloors, setListFloors] = useState<IconFloor[]>([]);
    const [listRooms, setListRooms] = useState<IconRoom[]>([])
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<'name' | 'notes' | 'quantity' | 'floor_id' | 'room_id', string>>>({});
    type TaskSlotError = Partial<Record<'title' | 'order_in_process', string>>;
    const [taskSlotErrors, setTaskSlotErrors] = useState<TaskSlotError[]>([]);
    const [infoCurrentUser, setInfoCurrentUser] = useState<UserProfile | null>(null)
    const { profile} = useAuth();
    const [taskSlots, setTaskSlots] = useState<TaskItemData[]>([
        {
            'title': '',
            'order_in_process': 1,
            'status': TaskStatus.PENDING,
        }
    ]);

    const notify = useNotification();

    useEffect(() => {
        if(from && open && taskId){
            setLoading(true)
            try {
                const getDetail = async(id: string | number) =>{
                    const res = await getDetailTask(id);
                    setFormData(res)
                    if(res.groupTask && res.groupTask.length === 0){
                        setTaskSlots([
                            {
                                'title': '',
                                'order_in_process': 1,
                                'status': TaskStatus.PENDING,
                            }
                        ])
                    }else{
                        res.groupTask && setTaskSlots(res.groupTask)
                    }
                }   
                
            getDetail(taskId)
            } catch (error) {
                
            }finally{
                setLoading(false)
            }


            
        }
    },[open, taskId, from])

    const handleClose = () => {
        onClose()
        setFormData({
            name: 'Dọn dẹp phòng', notes: '', quantity: 0, status: TaskStatus.PENDING, assigned_by_id: '', room_id: '', floor_id: ""
        })
        setTaskSlots([])
        setErrors({})
        setTaskSlotErrors([])
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
    
    const selectedFloor = useMemo(() => formData.floor_id, [formData.floor_id]);
    useEffect(() => {
        if(selectedFloor){
            const getRooms = async() => {
                try {
                    const resRoom = await getRoomByFloor(selectedFloor)
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
                }
            }
            getRooms()
        }else{
            // Nếu không chọn tầng thì clear danh sách phòng
            setListRooms([]);
        }
    },[selectedFloor])

    useEffect(() => {
    const newQuantity = taskSlots.length;
    setFormData(prev => ({
        ...prev,
        quantity: newQuantity
    }));
    }, [taskSlots]);


    const handleCustomInputChange = (name: string, value: string | number| null | Dayjs) => {
        if (Object.prototype.hasOwnProperty.call(formData, name)) {
            const validName = name as keyof TaskFormData; 
  
            setFormData((prevData) => ({
                ...prevData,
                [validName]: name === 'quantity' ? Number(value) : value, 
            }));

            if (validName === 'name' || validName === 'notes' || validName === 'quantity' || validName === 'floor_id' || validName === 'room_id') {
                if (errors[validName as 'notes' | 'quantity' | 'floor_id' | 'room_id'| 'name']) {
                    setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors[validName as 'notes' | 'quantity' | 'floor_id' | 'room_id' | 'name'];
                        return newErrors;
                    });
                }
            }
        } else {
            console.warn(`CustomInput called onChange with an unexpected name: ${name}`);
        }
        
    }

    const handleTaskSlotChange = (index: number, name: keyof TaskItemData, value: string | number| null | Dayjs) => {
        setTaskSlots(prev => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                [name]: value,
            };
            return updated;
        })
        setTaskSlotErrors([])
    }

    const handleAddTaskSlot = (indexToAdd: number) => {
        setTaskSlots(prevSlots => {
            const newSlot: TaskItemData = {
                title: '',
                order_in_process: indexToAdd + 1,
                status: TaskStatus.PENDING,
            };
            const updated = [...prevSlots];
            updated.splice(indexToAdd + 1, 0, newSlot)
            return updated
        });
    }

    const handleRemoveTaskSlot = (indexToRemove: number) => {
        setTaskSlots(preSlots => preSlots.filter((_, index) => index !== indexToRemove))
    }
    
   
    const validateForm = (): boolean => {
        const newErrors: Partial<Record<'name' | 'notes' | 'quantity' | 'floor_id' | 'room_id', string>> = {};
        const newErrorsTaskItem: TaskSlotError[] = []; 
        if (!formData.name.trim()) newErrors.name = 'Công việc là bắt buộc';
        if (!formData.notes.trim()) {
            newErrors.notes = 'Yêu cầu là bắt buộc';
        }
        if (!formData.quantity) newErrors.quantity = 'Số lượng là bắt buộc';
        if (!formData.floor_id) newErrors.floor_id = 'Số tầng là bắt buộc';
        if (!formData.room_id) newErrors.room_id = 'Số phòng là bắt buộc';
        taskSlots.forEach((slot, index) => {
            const errors: TaskSlotError = {};
            if (!slot.title.trim()) {
                errors.title = 'Tên hạng mục bắt buộc';
            }
            if (!slot.order_in_process || slot.order_in_process <= 0) {
                errors.order_in_process = 'Số thứ tự bắt buộc và phải lớn hơn 0';
            }
            newErrorsTaskItem[index] = errors;
        })
        setTaskSlotErrors(newErrorsTaskItem)
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

        const newtaskSlots: DateTask[] = taskSlots.map(
            (task) => ({
                ...task,
                due_date: dayjs().toISOString()
            })
        )
        
        const data = {
            ...formData,
            "assigned_by_id": id,
            'due_date': dayjs().toISOString(),
            "groupTask": newtaskSlots 
        }
        const { floor_id, ...payload} = data;
        try {
            let res;
            if(taskId){
                //update GroupTask
                res = await updateTask(taskId, payload)
            }else{
                //create GroupTask
                res = await createTask(payload)
            }

            notify({
                message:res.message,
                severity:"success"
            })
            // if(handleLoadList && res.data){
            //     const data = res.data as any as DataTask
            //     handleLoadList(data.task)
            // }
            // Load lại danh sách sau khi tạo hoặc cập nhật
            if(setReloadKey){
                setReloadKey(prev => prev + 1);
            }
            handleClose()
        } catch (error:any) {
            notify({
                message:error.message,
                severity:"error"
            })
        }

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
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                    <CircularProgress />
                </Box>
            )}
            {!loading && (
                <Box id="create-task-form" component='form' onSubmit={handleSubmit}>
                    <Grid container spacing={1}>
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
                                        disabled={from ? false : !formData.floor_id}
                                        // loading={loading}
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
                        <Grid item xs={12}>
                            <Typography variant="body2" fontWeight={600} gutterBottom>Công việc chính</Typography>
                            <InputText
                                label=""
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleCustomInputChange}
                                placeholder="Công việc chính"
                                sx={{ mt: 0 }}
                                error={!!errors.name}
                                helperText={errors.name}
                                margin="dense"
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} md={6}>
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
                                <Grid item xs={12} md={6}>
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
                                        disabled
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={1}>
                                <Grid item xs={7}>
                                    <Typography variant="body2" fontWeight={600} gutterBottom>Các công việc nhỏ bên trong</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="body2" fontWeight={600} gutterBottom>Thứ tự</Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography variant="body2" fontWeight={600} gutterBottom>Tác vụ</Typography>
                                </Grid>
                                {taskSlots.map((slot, index) => {
                                    return (
                                        <React.Fragment key={index}>
                                            <Grid item xs={7}>
                                                <TextField
                                                    label=""
                                                    type="text"
                                                    name="title"
                                                    value={slot.title}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                        const val = event.target.value;
                                                        handleTaskSlotChange(index,'title', val); // truyền giá trị, không truyền event
                                                    }}
                                                    placeholder="Tên"
                                                    InputProps={{
                                                        sx:{
                                                            "& .MuiOutlinedInput-notchedOutline":{
                                                                border:"1px solid rgb(82, 81, 81)",
                                                                borderRadius:"8px",
                                                            },
                                                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                                border:"1px solid rgb(82, 81, 81)"
                                                            }, 
                                                        }
                                                    }}
                                                    error={!!taskSlotErrors[index]?.title}
                                                    helperText={taskSlotErrors[index]?.title}
                                                />
                                            </Grid>
                                            <Grid item xs={3}>
                                                <TextField
                                                    label=""
                                                    type="text"
                                                    name="order_in_process"
                                                    value={slot.order_in_process}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                        const val = event.target.value;
                                                        handleTaskSlotChange(index,'order_in_process', val); // truyền giá trị, không truyền event
                                                    }}
                                                    placeholder="Thứ tự"
                                                    InputProps={{
                                                        sx:{
                                                            "& .MuiOutlinedInput-notchedOutline":{
                                                                border:"1px solid rgb(82, 81, 81)",
                                                                borderRadius:"8px",
                                                            },
                                                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                                border:"1px solid rgb(82, 81, 81)"
                                                            }, 
                                                        }
                                                    }}
                                                    error={!!taskSlotErrors[index]?.order_in_process}
                                                    helperText={taskSlotErrors[index]?.order_in_process}
                                                />
                                            </Grid>
                                            <Grid item xs={2}>
                                                <IconButton
                                                    aria-label={`Add slot ${index + 1}`}
                                                    handleFunt={() => handleAddTaskSlot(index + 1)}
                                                    icon={<AddCircleOutline sx={{color: 'white', width: "28px", height:"28px"}}/>}
                                                    backgroundColor="#00C7BE"
                                                    borderRadius={1}
                                                    tooltip="Thêm hạng mục"
                                                    sx={{ mt: 0, mr: 1}}
                                                />
                                                <IconButton
                                                    aria-label={`Remove slot ${index + 1}`}
                                                    handleFunt={() => handleRemoveTaskSlot(index)}
                                                    icon={<RemoveCircleOutline sx={{color: 'white', width: "28px", height:"28px"}}/>}
                                                    backgroundColor="red"
                                                    borderRadius={1}
                                                    tooltip="Xóa hạng mục"
                                                    sx={{ mt: 0}}
                                                    disabled={taskSlots.length == 1}
                                                />
                                            </Grid>
                                        </React.Fragment>
                                    )
                                })}

                            </Grid>
                        </Grid>
                    </Grid>

                </Box>
            )}

        </DialogComponent>
    )
}

export default DialogCreateTask;