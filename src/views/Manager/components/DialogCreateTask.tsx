import DialogComponent from "@/components/DialogComponent";
import ActionButton from "@/components/ProButton/ActionButton";
import { Box, CircularProgress, Grid, TextField, Typography } from "@mui/material";
import React, { useEffect, useState,FormEvent } from "react";
import InputText from "./InputText";
import { createTask, updateTask } from "@/services/manager.service";
import dayjs, { Dayjs } from "dayjs";
import useAuth from "@/hooks/useAuth";
import { UserProfile } from "@/types/users";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
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


interface TaskFormData {
    floor: string,
    room: string,
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

const DialogCreateTask: React.FC<DialogCreateTaskProps> = (props) => {
    const {open, title, onClose, taskId, from, setReloadKey} = props;
    const [formData, setFormData] = useState<TaskFormData>({
        name: 'Dọn dẹp phòng', notes: '', quantity: 0, status: TaskStatus.PENDING, assigned_by_id: '', room: '', floor: ''
    })

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<'name' | 'notes' | 'quantity' | 'floor' | 'room', string>>>({});
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
            name: 'Dọn dẹp phòng', notes: '', quantity: 0, status: TaskStatus.PENDING, assigned_by_id: '', room: '', floor: ""
        })
        setTaskSlots([])
        setErrors({})
        setTaskSlotErrors([])
    }

    useEffect(() => {
        if(open && profile){
            setInfoCurrentUser(profile)
        }
    }, [open, profile])
    

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

            if (validName === 'name' || validName === 'notes' || validName === 'quantity' || validName === 'floor' || validName === 'room') {
                if (errors[validName as 'notes' | 'quantity' | 'floor' | 'room'| 'name']) {
                    setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors[validName as 'notes' | 'quantity' | 'floor' | 'room' | 'name'];
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
        const newErrors: Partial<Record<'name' | 'notes' | 'quantity' | 'floor' | 'room', string>> = {};
        const newErrorsTaskItem: TaskSlotError[] = []; 
        if (!formData.name.trim()) newErrors.name = 'Công việc là bắt buộc';
        if (!formData.notes.trim()) {
            newErrors.notes = 'Yêu cầu là bắt buộc';
        }
        if (!formData.quantity) newErrors.quantity = 'Số lượng là bắt buộc';
        if (!formData.floor) newErrors.floor = 'Số tầng là bắt buộc';
        if (!formData.room) newErrors.room = 'Số phòng là bắt buộc';
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
        try {
            let res;
            if(taskId){
                //update GroupTask
                res = await updateTask(taskId, data)
            }else{
                //create GroupTask
                res = await createTask(data)
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
                                    <InputText
                                        label=""
                                        type="text"
                                        name="floor"
                                        value={formData.floor}
                                        onChange={handleCustomInputChange}
                                        placeholder="Số tầng"
                                        sx={{ mt: 0 }}
                                        error={!!errors.floor}
                                        helperText={errors.floor}
                                        margin="dense"
                                        onlyPositiveNumber
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography id="rooms-select-label" variant="body2" fontWeight={600} gutterBottom>Số phòng</Typography>
                                    <InputText
                                        label=""
                                        type="text"
                                        name="room"
                                        value={formData.room}
                                        onChange={handleCustomInputChange}
                                        placeholder="Số phòng"
                                        sx={{ mt: 0 }}
                                        error={!!errors.room}
                                        helperText={errors.room}
                                        margin="dense"
                                        onlyPositiveNumber
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