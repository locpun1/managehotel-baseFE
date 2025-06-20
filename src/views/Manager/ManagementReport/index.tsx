import SearchBar from "@/components/SearchBar"
import { approveReport, getListReports, ReportsApiResponse } from "@/services/report-service";
import { Alert, Box, Card, CardContent, CircularProgress, Stack, Typography } from "@mui/material"
import React, { useCallback, useEffect, useState } from "react";
import Grid from '@mui/material/Grid2';
import { getMinutesDiff, getTime } from "@/utils/date";
import CommonImage from "@/components/Image/index";
import { getPathImage } from "@/utils/url";
import { getReportStatusLabel } from "@/utils/status";
import CustomPagination from "@/components/Pagination/CustomPagination";
import DialogOpenImage from "@/views/Staff/components/DialogOpenImage";
import Button from "@/components/Button/Button";
import { ReportStatus } from "@/constants/taskStatus";
import useNotification from "@/hooks/useNotification";

const ManagementReport = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [listReports, setListReports] = useState<ReportsApiResponse | null>(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [rowPerPgae, setRowPerPage] = useState(6);
    const [openImage, setOpenImage] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const notify = useNotification()
    const handleSearch = () => {
    }

    const fetchListReports = useCallback(async(currentPage: number, currentRow: number) => {
        setLoading(true)
        setError(null)
        try {
          const todayForApi = new Date().toISOString().split('T')[0];
          const res = await getListReports(currentPage, currentRow, todayForApi)
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
        fetchListReports(page, rowPerPgae)
    },[page, rowPerPgae])

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
    }
    const handleOpenImage = (image: string) => {
        setImageUrl(image)
        setOpenImage(true)
    }

    const handleApprove = async(idReport: string | number) => {
        try {
            const res = await approveReport(idReport);
            notify({
                message:res.message,
                severity: 'success'
            })
            setListReports((currentReport) => {
                if(!currentReport) return null;
                return {
                    ...currentReport,
                    reports: currentReport.reports.map((report) =>
                        report.id === idReport ? {...report, status: res.data?.status as ReportStatus}
                        : report
                ),
                }
            });
        } catch (error: any) {
            notify({
                message:error.message,
                severity: 'error'
            })
        }
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
                    <Alert severity="error" sx={{ my: 2}}>{error}</Alert>
                )}
                {!loading && !error && (
                    <Box sx={{ m: 2}}>
                        <Grid container spacing={2}>
                            {listReports?.reports.length === 0 ? (
                                <Typography variant="body1">Không tồn tại bản ghi nào cả</Typography>
                            ) : (
                                listReports?.reports.map((report) => {
                                    const time = report.startedAt && report.completedAt && getTime(report.startedAt, report.completedAt);
                                    const totalMin = report.startedAt && report.completedAt && getMinutesDiff(report.startedAt, report.completedAt)
                                    return (
                                        <React.Fragment key={report.id}>
                                            <Grid size={{ xs: 12, sm: 6, lg: 4}}>
                                                <Card key={report.id} sx={{ borderRadius: 2, boxShadow: 2}}>
                                                    <CardContent>
                                                        <Stack direction='row' spacing={2} sx={{ mb: 2}} alignItems='center'>
                                                            <Box width={200} height={200} sx={{ cursor: 'pointer'}} onClick={() => report?.image_url && handleOpenImage(report?.image_url)}>
                                                                <CommonImage
                                                                    src={report.image_url && getPathImage(report.image_url)}
                                                                    alt='Image issue'
                                                                    sx={{ mt: 2.5}}
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
                                                                {`${report.dueDate} | ${time || "-"} | ${totalMin || 0} phút `}
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
                                                        <Box display='flex' justifyContent='center' sx={{ mt:4}}>
                                                            <Button 
                                                                disabled={report.status === ReportStatus.RESOLVED} 
                                                                type="submit" 
                                                                handleFunt={() => report.id && handleApprove(report.id)} 
                                                                backgroundColor={report.status === ReportStatus.RESOLVED ? "grey" : "#00C7BE"} 
                                                                width='80px' height="30px" borderRadius="6px"
                                                                fontColor='white'
                                                            >
                                                                Duyệt
                                                            </Button>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </React.Fragment>
                                    )
                                })
                            )}
                        </Grid>
                        <Box display='flex' justifyContent='center' alignItems='center'>
                            <CustomPagination
                                count={total}
                                page={page}
                                rowsPerPage={rowPerPgae}
                                onPageChange={handlePageChange}
                                sx={{ mt: 2}}
                            />
                        </Box>
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
    )
}

export default ManagementReport