import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAppDispatch } from '../../store/store';
import type { RootState } from '../../reducers';
import { fetchAdminHomeRequest } from '../../actions/admin.slice';
import UpdateStatus from './updateStatus';
import ComplaintDetails from './complaintDetails';
import ComplaintMap from './complaintMap';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Button,
    Grid,
    Chip,
    CircularProgress,
    Container,
    Alert,
    Skeleton,
    Paper
} from '@mui/material';
import { 
    Visibility, 
    Edit,
    AccessTime as ClockIcon,
    Build as WrenchIcon,
    CheckCircle as TickIcon
} from '@mui/icons-material';
import backgroundImage from '../../assets/background1.jpg';

export default function AdminHome() {
    const dispatch = useAppDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const { loading, error, complaints, statusMap } = useSelector((state: RootState) => state.admin);
    const [updatingComplaint, setUpdatingComplaint] = React.useState<any | null>(null);
    const [selectedComplaint, setSelectedComplaint] = React.useState<any | null>(null);
    const [hoveredComplaint, setHoveredComplaint] = React.useState<any | null>(null);

    const sortedComplaints = React.useMemo(() => {
        return [...complaints].reverse();
    }, [complaints]);

    const counts = React.useMemo(() => {
        let pending = 0;
        let progress = 0;
        let completed = 0;
        
        complaints.forEach((complaint: any) => {
            const latest = statusMap && statusMap[complaint.id || complaint._id];
            const rawStatus = (latest ? latest.workstatus : (complaint.status || 'pending')).toLowerCase();
            
            if (rawStatus.includes('progress') || rawStatus.includes('work-on-progress')) {
                progress++;
            } else if (rawStatus.includes('complete') || rawStatus.includes('resolve')) {
                completed++;
            } else {
                pending++;
            }
        });
        
        return { pending, progress, completed, total: complaints.length };
    }, [complaints, statusMap]);

    // Retrieve userId and role from logged-in user state
    const loginUserObj = user as any;
    const userId = loginUserObj?.user?.id || '';
    const role = loginUserObj?.user?.role || 'admin';

    useEffect(() => {
        if (userId) {
            dispatch(fetchAdminHomeRequest({ userId, role }));
        }
    }, [userId, role, dispatch]);



    const getStatusBadge = (complaintId: string, defaultStatus: string) => {
        const latest = statusMap && statusMap[complaintId];
        const rawStatus = (latest ? latest.workstatus : (defaultStatus || 'pending')).toLowerCase();
        
        let label = 'Pending';
        let bgStyle = 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'; // Orange
        let icon = <ClockIcon sx={{ color: '#ffffff', fontSize: '0.9rem' }} />;
        
        if (rawStatus.includes('progress') || rawStatus.includes('work-on-progress')) {
            label = latest ? latest.workstatus : 'Work on Progress';
            bgStyle = 'linear-gradient(135deg, #3b82f6 0%, #eab308 100%)'; // Blue and Yellow Gradient
            icon = <WrenchIcon sx={{ color: '#ffffff', fontSize: '0.9rem' }} />;
        } else if (rawStatus.includes('complete') || rawStatus.includes('resolve')) {
            label = latest ? latest.workstatus : 'Completed';
            bgStyle = 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)'; // Green
            icon = <TickIcon sx={{ color: '#ffffff', fontSize: '0.9rem' }} />;
        }
        
        return (
            <Chip 
                icon={icon}
                label={label} 
                sx={{
                    background: bgStyle,
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    '& .MuiChip-icon': {
                        color: '#ffffff',
                        marginLeft: '8px',
                        marginRight: '-4px'
                    }
                }}
                size="small" 
            />
        );
    };



    return (
        <Box sx={{
            position: 'relative',
            minHeight: 'calc(100vh - 100px)',
            py: 4,
            overflow: 'hidden',
            '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                filter: 'blur(100px)',
                pointerEvents: 'none',
                zIndex: -1,
            }
        }}>
            <Container maxWidth="xl">
            {/* Header section */}
            <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        {role === 'superadmin' ? 'SuperAdmin Control Panel' : 'Admin Control Panel'}
                    </Typography>
                <Typography variant="subtitle1" color="#64748b">
                    Welcome back, {loginUserObj?.user?.name || (role === 'superadmin' ? 'SuperAdmin' : 'Admin')}! Manage complaints, view photos, and update work status.
                </Typography>
            </Box>

            {loading && (
                <Grid container spacing={3}>
                    {Array.from(new Array(4)).map((_, index) => (
                        <Grid size={{ xs: 12, md: 6 }} key={index}>
                            <Card sx={{ display: 'flex', height: '100%', borderRadius: 3, boxShadow: 'none', border: '1px solid #cbd5e1' }}>
                                <Skeleton variant="rectangular" width={140} height="100%" sx={{ display: { xs: 'none', sm: 'block' } }} />
                                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, p: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Skeleton variant="rectangular" width={80} height={20} sx={{ borderRadius: 1 }} />
                                        <Skeleton variant="rectangular" width={60} height={20} sx={{ borderRadius: 1 }} />
                                    </Box>
                                    <Skeleton variant="text" width="60%" height={28} />
                                    <Skeleton variant="text" width="90%" height={20} sx={{ mt: 1 }} />
                                    <Skeleton variant="text" width="80%" height={20} />
                                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                        <Skeleton variant="rectangular" width={80} height={30} sx={{ borderRadius: 1 }} />
                                        <Skeleton variant="rectangular" width={110} height={30} sx={{ borderRadius: 1 }} />
                                    </Box>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 4 }}>
                    {error}
                </Alert>
            )}

            {!loading && !error && complaints.length === 0 && (
                <Box sx={{ py: 8, textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: 4, border: '1px dashed #cbd5e1' }}>
                    <Typography variant="h6" color="#64748b">
                        No registered complaints found.
                    </Typography>
                    <Typography color="#94a3b8" variant="body2" sx={{ mt: 1 }}>
                        All citizen registered complaints will show up here.
                    </Typography>
                </Box>
            )}

            {!loading && !error && complaints.length > 0 && (
                <Paper 
                    elevation={0}
                    sx={{
                        p: 3,
                        borderRadius: '20px',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
                        height: 'calc(100vh - 240px)',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    {/* Frame Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ 
                                width: 8, 
                                height: 26, 
                                borderRadius: 1, 
                                backgroundColor: '#14b8a6' 
                            }} />
                            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                                Complaints Operations Control
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip 
                                label={`${counts.total} Active`} 
                                size="small"
                                sx={{
                                    backgroundColor: 'rgba(15, 23, 42, 0.08)',
                                    color: '#0f172a',
                                    fontWeight: 700,
                                    fontSize: '0.75rem',
                                    border: '1px solid rgba(15, 23, 42, 0.1)',
                                    px: 0.5
                                }}
                            />
                            <Chip 
                                label={`${counts.pending} Pending`} 
                                size="small"
                                sx={{
                                    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                                    color: '#ffffff',
                                    fontWeight: 700,
                                    fontSize: '0.75rem',
                                    px: 0.5,
                                    boxShadow: '0 2px 6px rgba(234, 88, 12, 0.15)'
                                }}
                            />
                            <Chip 
                                label={`${counts.progress} Progress`} 
                                size="small"
                                sx={{
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #eab308 100%)',
                                    color: '#ffffff',
                                    fontWeight: 700,
                                    fontSize: '0.75rem',
                                    px: 0.5,
                                    boxShadow: '0 2px 6px rgba(59, 130, 246, 0.15)'
                                }}
                            />
                            <Chip 
                                label={`${counts.completed} Completed`} 
                                size="small"
                                sx={{
                                    background: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
                                    color: '#ffffff',
                                    fontWeight: 700,
                                    fontSize: '0.75rem',
                                    px: 0.5,
                                    boxShadow: '0 2px 6px rgba(34, 197, 94, 0.15)'
                                }}
                            />
                        </Box>
                    </Box>

                    <Grid container spacing={4} sx={{ flex: 1, minHeight: 0 }}>
                        {/* Left Column - Fixed Map */}
                        <Grid size={{ xs: 12, md: 5, lg: 5 }} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{
                                flex: 1,
                                borderRadius: '12px',
                                overflow: 'hidden',
                                border: '1px solid #cbd5e1',
                                position: 'relative',
                                backgroundColor: '#ffffff',
                                height: '100%'
                            }}>
                            <ComplaintMap 
                                locationUrl={hoveredComplaint?.locationUrl || hoveredComplaint?.locationurl} 
                                complaintsList={sortedComplaints}
                            />
                            {hoveredComplaint && (
                                <Box sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.7) 70%, rgba(15, 23, 42, 0) 100%)',
                                    color: '#ffffff',
                                    p: 3,
                                    pt: 6,
                                    pointerEvents: 'none'
                                }}>
                                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', mb: 1 }}>
                                        <Chip 
                                            label={hoveredComplaint.issueType || hoveredComplaint.issuetype || 'General'} 
                                            size="small" 
                                            sx={{ 
                                                backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                                                color: '#ffffff', 
                                                fontWeight: 600,
                                                backdropFilter: 'blur(4px)'
                                            }} 
                                        />
                                        <Chip 
                                            label={(hoveredComplaint.status || 'Pending').toLowerCase().includes('progress') ? 'Work on Progress' : (hoveredComplaint.status || 'Pending').toLowerCase().includes('complete') ? 'Completed' : 'Pending'}
                                            size="small"
                                            sx={{
                                                background: (hoveredComplaint.status || 'Pending').toLowerCase().includes('complete') 
                                                    ? 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)' 
                                                    : (hoveredComplaint.status || 'Pending').toLowerCase().includes('progress') 
                                                        ? 'linear-gradient(135deg, #3b82f6 0%, #eab308 100%)' 
                                                        : 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                                                color: '#ffffff',
                                                fontWeight: 700
                                            }}
                                        />
                                    </Box>
                                    <Typography variant="h5" sx={{ fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                                        {hoveredComplaint.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                        {hoveredComplaint.description}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Grid>

                    {/* Right Column - Scrollable Complaints List */}
                    <Grid size={{ xs: 12, md: 7, lg: 7 }} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box 
                            onMouseLeave={() => setHoveredComplaint(null)}
                            sx={{ 
                                flex: 1,
                                overflowY: 'auto',
                                pr: { xs: 0, md: 1 },
                                height: '100%',
                                '&::-webkit-scrollbar': {
                                    width: '6px'
                                },
                                '&::-webkit-scrollbar-track': {
                                    background: 'transparent'
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    background: '#cbd5e1',
                                    borderRadius: '3px'
                                },
                                '&::-webkit-scrollbar-thumb:hover': {
                                    background: '#94a3b8'
                                }
                            }}
                        >
                            <Grid container spacing={2}>
                                {sortedComplaints.map((complaint: any) => {
                                    const isCurrentlyHovered = hoveredComplaint?.id === complaint.id || hoveredComplaint?._id === complaint._id;
                                    const latest = statusMap && statusMap[complaint.id || complaint._id];
                                    const rawStatus = (latest ? latest.workstatus : (complaint.status || 'pending')).toLowerCase();
                                    const isCompleted = rawStatus.includes('complete') || rawStatus.includes('resolve');
                                    return (
                                        <Grid size={{ xs: 12, sm: 6 }} key={complaint.id || complaint._id}>
                                            <Card 
                                                onMouseEnter={() => setHoveredComplaint(complaint)}
                                                sx={{ 
                                                    display: 'flex', 
                                                    flexDirection: 'column',
                                                    height: '100%',
                                                    boxShadow: isCurrentlyHovered 
                                                        ? '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' 
                                                        : '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                                                    borderRadius: 3,
                                                    border: isCurrentlyHovered ? '2px solid #14b8a6' : '2px solid transparent',
                                                    transform: isCurrentlyHovered ? 'translateY(-2px)' : 'none',
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                        borderColor: '#14b8a6'
                                                    }
                                                }}
                                            >
                                                {complaint.photoUrl && (
                                                    <CardMedia
                                                        component="img"
                                                        sx={{ height: 140, width: '100%', objectFit: 'cover' }}
                                                        image={`/photo/${complaint.photoUrl}`}
                                                        alt={complaint.title}
                                                    />
                                                )}
                                                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                                    <CardContent sx={{ flex: '1 0 auto', p: 2 }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, gap: 1 }}>
                                                            <Chip 
                                                                label={complaint.issueType || complaint.issuetype || 'General'} 
                                                                size="small" 
                                                                variant="outlined" 
                                                                sx={{ borderColor: '#cbd5e1', color: '#475569', fontWeight: 600, fontSize: '0.7rem' }}
                                                            />
                                                            {getStatusBadge(complaint.id, complaint.status)}
                                                        </Box>
                                                        <Typography component="div" variant="subtitle1" noWrap sx={{ fontWeight: 700, color: '#0f172a' }}>
                                                            {complaint.title}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            color="#475569"
                                                            sx={{
                                                                mt: 1,
                                                                lineBreak: 'anywhere',
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: 'vertical',
                                                                overflow: 'hidden',
                                                                fontSize: '0.8rem'
                                                            }}
                                                        >
                                                            {complaint.description}
                                                        </Typography>
                                                    </CardContent>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 2, pb: 2 }}>
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            startIcon={<Visibility />}
                                                            sx={{
                                                                textTransform: 'none',
                                                                borderColor: '#14b8a6',
                                                                color: '#14b8a6',
                                                                fontWeight: 600,
                                                                fontSize: '0.75rem',
                                                                '&:hover': {
                                                                    borderColor: '#0d9488',
                                                                    backgroundColor: 'rgba(20, 184, 166, 0.04)',
                                                                }
                                                            }}
                                                            onClick={() => {
                                                                const latest = statusMap && statusMap[complaint.id || complaint._id];
                                                                const status = latest ? latest.workstatus : (complaint.status || 'Pending');
                                                                setSelectedComplaint({ ...complaint, status });
                                                            }}
                                                        >
                                                            Details
                                                        </Button>
                                                        {!isCompleted && role !== 'superadmin' && (
                                                            <Button
                                                                variant="contained"
                                                                size="small"
                                                                startIcon={<Edit />}
                                                                sx={{
                                                                    textTransform: 'none',
                                                                    backgroundColor: '#0f172a',
                                                                    color: '#ffffff',
                                                                    fontWeight: 600,
                                                                    fontSize: '0.75rem',
                                                                    '&:hover': {
                                                                        backgroundColor: '#1e293b',
                                                                    }
                                                                }}
                                                                onClick={() => {
                                                                    setUpdatingComplaint(complaint);
                                                                }}
                                                            >
                                                                Update
                                                            </Button>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </Card>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
                </Paper>
            )}
            {updatingComplaint && (
                <UpdateStatus 
                    complaint={updatingComplaint} 
                    onClose={() => setUpdatingComplaint(null)} 
                />
            )}
            {selectedComplaint && (
                <ComplaintDetails 
                    complaint={selectedComplaint} 
                    role="admin"
                    userId={userId}
                    onClose={() => setSelectedComplaint(null)} 
                    onUpdateStatus={(comp) => {
                        setSelectedComplaint(null);
                        setUpdatingComplaint(comp);
                    }}
                />
            )}
            </Container>
        </Box>
    );
}

