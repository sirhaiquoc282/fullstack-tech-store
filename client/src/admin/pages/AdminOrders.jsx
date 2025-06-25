import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
    InputLabel, FormControl, Typography, CircularProgress, Snackbar, Alert,
    Select, MenuItem as MuiMenuItem, List, ListItem, Divider
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { FiSearch, FiCheckCircle, FiXCircle, FiTruck, FiPackage, FiInfo, FiEye } from 'react-icons/fi';

// --- Mock API Service (Fixed) ---
const mockApiService = {
    getAllOrdersAdmin: async (params) => {
        const allOrders = [
            {
                id: "ord001", userId: "user1", userName: "Alice Smith", date: "2023-06-20T10:00:00Z",
                items: [{ productId: "prod1", productName: "Laptop XYZ", quantity: 1, price: 1200, thumbnail: "https://via.placeholder.com/50x50?text=L1" }],
                totalAmount: 1200, orderStatus: "Delivered", paymentMethod: "COD", shippingAddress: "123 Main St",
            },
            {
                id: "ord002", userId: "user2", userName: "Bob Johnson", date: "2023-06-18T14:30:00Z",
                items: [{ productId: "prod2", productName: "Smartphone ABC", quantity: 2, price: 700, thumbnail: "https://via.placeholder.com/50x50?text=S1" }],
                totalAmount: 1400, orderStatus: "Processing", paymentMethod: "Card", shippingAddress: "456 Oak Ave",
            },
            {
                id: "ord003", userId: "user1", userName: "Alice Smith", date: "2023-06-15T09:15:00Z",
                items: [
                    { productId: "prod3", productName: "Tablet Pro", quantity: 1, price: 500, thumbnail: "https://via.placeholder.com/50x50?text=T1" },
                    { productId: "prod4", productName: "Headphone", quantity: 1, price: 150, thumbnail: "https://via.placeholder.com/50x50?text=H1" }
                ],
                totalAmount: 650, orderStatus: "Shipped", paymentMethod: "COD", shippingAddress: "789 Pine Ln",
            },
            {
                id: "ord004", userId: "user3", userName: "Charlie Brown", date: "2023-06-10T11:45:00Z",
                items: [{ productId: "prod1", productName: "Laptop XYZ", quantity: 1, price: 1200, thumbnail: "https://via.placeholder.com/50x50?text=L2" }],
                totalAmount: 1200, orderStatus: "Cancelled", paymentMethod: "Card", shippingAddress: "101 Maple Rd",
            },
            {
                id: "ord005", userId: "user2", userName: "Bob Johnson", date: "2023-06-05T16:00:00Z",
                items: [{ productId: "prod2", productName: "Smartphone ABC", quantity: 1, price: 700, thumbnail: "https://via.placeholder.com/50x50?text=S2" }],
                totalAmount: 700, orderStatus: "Pending", paymentMethod: "COD", shippingAddress: "112 Birch Cir",
            },
        ];

        let filtered = allOrders;
        if (params.status && params.status !== 'all') {
            filtered = filtered.filter(order =>
                order.orderStatus.toLowerCase() === params.status.toLowerCase()
            );
        }
        if (params.keyword) {
            const keywordLower = params.keyword.toLowerCase();
            filtered = filtered.filter(order =>
                (order.id || '').toLowerCase().includes(keywordLower) ||
                (order.userName || '').toLowerCase().includes(keywordLower) ||
                (order.shippingAddress || '').toLowerCase().includes(keywordLower) ||
                (order.items || []).some(item =>
                    (item.productName || '').toLowerCase().includes(keywordLower)
                )
            );
        }

        const start = params.page * params.pageSize;
        const end = start + params.pageSize;
        const pagedData = filtered.slice(start, end);

        return new Promise(resolve => setTimeout(() => {
            resolve({ status: 200, data: { orders: pagedData, total: filtered.length } });
        }, 500));
    },
    updateOrderStatus: async (orderId, newStatus) => {
        console.log(`Updating order ${orderId} to ${newStatus}`);
        return new Promise(resolve => setTimeout(() => {
            resolve({ status: 200, data: { orderId, newStatus } });
        }, 500));
    }
};

const AdminOrders = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const [searchTerm, setSearchTerm] = useState('');
    const [activeStatusFilter, setActiveStatusFilter] = useState('all');
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [totalRowCount, setTotalRowCount] = useState(0);

    const [openDetailDialog, setOpenDetailDialog] = useState(false);
    const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);

    // Snackbar handling
    const showSnackbar = useCallback((message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    }, []);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    // Order status helper with safe access
    const getStatusInfo = (status) => {
        const s = (status || '').toLowerCase();
        switch (s) {
            case "delivered": return { text: "Delivered", color: "bg-green-100 text-green-800", icon: <FiCheckCircle size={16} /> };
            case "shipped": return { text: "Shipped", color: "bg-blue-100 text-blue-800", icon: <FiTruck size={16} /> };
            case "processing":
            case "pending": return { text: s.charAt(0).toUpperCase() + s.slice(1), color: "bg-yellow-100 text-yellow-800", icon: <FiPackage size={16} /> };
            case "cancelled": return { text: "Cancelled", color: "bg-red-100 text-red-800", icon: <FiXCircle size={16} /> };
            default: return { text: "Unknown", color: "bg-gray-100 text-gray-800", icon: <FiInfo size={16} /> };
        }
    };

    // Fetch orders with error handling
    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                page: paginationModel.page,
                pageSize: paginationModel.pageSize,
                keyword: searchTerm,
                status: activeStatusFilter,
            };
            const response = await mockApiService.getAllOrdersAdmin(params);
            setRows(response.data.orders || []);
            setTotalRowCount(response.data.total || 0);
        } catch (error) {
            console.error('Error fetching orders:', error);
            showSnackbar('Error fetching orders: ' + (error.message || 'Unknown error'), 'error');
        } finally {
            setLoading(false);
        }
    }, [paginationModel, searchTerm, activeStatusFilter, showSnackbar]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Handle status change with confirmation
    const handleStatusChange = async (orderId, newStatus) => {
        if (!window.confirm(`Change status of order ${orderId} to "${newStatus}"?`)) return;

        setLoading(true);
        try {
            await mockApiService.updateOrderStatus(orderId, newStatus);

            setRows(prev => prev.map(row =>
                row.id === orderId ? { ...row, orderStatus: newStatus } : row
            ));

            if (selectedOrderDetail?.id === orderId) {
                setSelectedOrderDetail(prev => ({ ...prev, orderStatus: newStatus }));
            }

            showSnackbar(`Order ${orderId} status updated to "${newStatus}"!`, 'success');
        } catch (error) {
            console.error('Error updating status:', error);
            showSnackbar('Error updating status: ' + (error.message || 'Unknown error'), 'error');
        } finally {
            setLoading(false);
        }
    };

    // View order details
    const handleViewOrderDetails = (order) => {
        setSelectedOrderDetail(order);
        setOpenDetailDialog(true);
    };

    const handleCloseDetailDialog = () => {
        setOpenDetailDialog(false);
    };

    // Safe columns definition
    const columns = [
        {
            field: 'id',
            headerName: 'Order ID',
            width: 120,
            valueGetter: (params) => `#${(params.row?.id || '').toUpperCase()}`
        },
        { field: 'userName', headerName: 'Customer', width: 150 },
        {
            field: 'date',
            headerName: 'Order Date',
            width: 150,
            valueGetter: (params) => params.row?.date
                ? new Date(params.row.date).toLocaleDateString('en-US')
                : 'N/A'
        },
        {
            field: 'items',
            headerName: 'Items',
            width: 150,
            renderCell: (params) => (
                <Typography variant="body2">
                    {(params.row?.items || []).length} items
                </Typography>
            ),
            valueGetter: (params) => (params.row?.items || []).reduce((sum, item) => sum + (item.quantity || 0), 0),
            sortable: false,
        },
        {
            field: 'totalAmount',
            headerName: 'Total',
            width: 130,
            valueFormatter: (params) => `$${(params.value || 0).toFixed(2)}`
        },
        {
            field: 'orderStatus',
            headerName: 'Status',
            width: 130,
            renderCell: (params) => {
                const status = params.row?.orderStatus || '';
                const statusInfo = getStatusInfo(status);
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusInfo.color}`}>
                        {statusInfo.icon}
                        {statusInfo.text}
                    </Box>
                );
            },
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => {
                const orderStatus = params.row?.orderStatus || '';

                return (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="contained"
                            size="small"
                            sx={{
                                bgcolor: '#dc2626',
                                minWidth: 'auto',
                                p: '6px 8px',
                                '&:hover': { bgcolor: '#b91c1c' }
                            }}
                            onClick={() => handleViewOrderDetails(params.row)}
                        >
                            <FiEye size={16} style={{ marginRight: 4 }} /> View
                        </Button>

                        <FormControl sx={{ minWidth: 100 }} size="small">
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={orderStatus}
                                label="Status"
                                onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
                                sx={{ '.MuiOutlinedInput-notchedOutline': { borderColor: '#ccc' } }}
                            >
                                {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                                    <MuiMenuItem key={status} value={status}>{status}</MuiMenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                );
            },
            sortable: false,
        },
    ];

    return (
        <Box sx={{ p: 3 }}>
            {/* Header Section */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 0 }
            }}>
                <Typography variant="h4" fontWeight="bold">Order Management</Typography>

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    width: { xs: '100%', sm: 'auto' },
                    flexDirection: { xs: 'column', sm: 'row' }
                }}>
                    <TextField
                        variant="outlined"
                        size="small"
                        label="Search Orders"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ width: { xs: '100%', sm: 250 } }}
                        InputProps={{
                            startAdornment: <FiSearch style={{ marginRight: 8, color: '#9e9e9e' }} />,
                        }}
                    />

                    <FormControl sx={{ minWidth: 120, width: { xs: '100%', sm: 'auto' } }} size="small">
                        <InputLabel>Filter by Status</InputLabel>
                        <Select
                            value={activeStatusFilter}
                            label="Filter by Status"
                            onChange={(e) => setActiveStatusFilter(e.target.value)}
                        >
                            <MuiMenuItem value="all">All Orders</MuiMenuItem>
                            {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                                <MuiMenuItem key={status} value={status.toLowerCase()}>
                                    {status}
                                </MuiMenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            {/* DataGrid Section */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <DataGrid
                    rows={rows}
                    columns={columns}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[5, 10, 20]}
                    rowCount={totalRowCount}
                    paginationMode="server"
                    autoHeight
                    sx={{
                        '& .MuiDataGrid-columnHeaders': {
                            bgcolor: '#f5f5f5',
                            fontWeight: 'bold'
                        },
                        '& .MuiDataGrid-cell': {
                            py: 1
                        }
                    }}
                    loading={loading}
                    getRowId={(row) => row.id}
                    disableColumnMenu
                />
            )}

            {/* Order Detail Dialog */}
            <Dialog
                open={openDetailDialog}
                onClose={handleCloseDetailDialog}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Order #{selectedOrderDetail?.id?.toUpperCase() || ''}
                </DialogTitle>

                <DialogContent dividers>
                    {selectedOrderDetail && (
                        <>
                            <Typography variant="h6" gutterBottom>Customer Information</Typography>
                            <List dense>
                                <ListItem>
                                    <Typography><strong>Name:</strong> {selectedOrderDetail.userName || 'N/A'}</Typography>
                                </ListItem>
                                <ListItem>
                                    <Typography><strong>Address:</strong> {selectedOrderDetail.shippingAddress || 'N/A'}</Typography>
                                </ListItem>
                                <ListItem>
                                    <Typography><strong>Payment Method:</strong> {selectedOrderDetail.paymentMethod || 'N/A'}</Typography>
                                </ListItem>
                                <ListItem>
                                    <Typography><strong>Status:</strong> {selectedOrderDetail.orderStatus || 'N/A'}</Typography>
                                </ListItem>
                                <ListItem>
                                    <Typography><strong>Order Date:</strong> {
                                        selectedOrderDetail.date
                                            ? new Date(selectedOrderDetail.date).toLocaleString()
                                            : 'N/A'
                                    }</Typography>
                                </ListItem>
                            </List>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="h6" gutterBottom>Products</Typography>
                            <List>
                                {(selectedOrderDetail.items || []).map((item, index) => (
                                    <ListItem key={index} sx={{ py: 1.5 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                            <img
                                                src={item.thumbnail || 'https://via.placeholder.com/50x50?text=Product'}
                                                alt={item.productName}
                                                style={{
                                                    width: 50,
                                                    height: 50,
                                                    objectFit: 'cover',
                                                    borderRadius: 4,
                                                    marginRight: 12
                                                }}
                                            />
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography fontWeight="medium">
                                                    {item.productName || 'Unnamed Product'}
                                                </Typography>
                                                <Typography variant="body2">
                                                    Quantity: {item.quantity || 0}
                                                </Typography>
                                            </Box>
                                            <Typography fontWeight="bold">
                                                ${(item.price || 0).toFixed(2)}
                                            </Typography>
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                <Typography variant="h6">
                                    <strong>Total:</strong> ${(selectedOrderDetail.totalAmount || 0).toFixed(2)}
                                </Typography>
                            </Box>
                        </>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseDetailDialog}>Close</Button>
                    <Button
                        variant="contained"
                        onClick={() => handleStatusChange(selectedOrderDetail?.id, 'Delivered')}
                        sx={{ bgcolor: '#dc2626', '&:hover': { bgcolor: '#b91c1c' } }}
                        disabled={!selectedOrderDetail?.id}
                    >
                        Mark as Delivered
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    severity={snackbarSeverity}
                    variant="filled"
                    onClose={handleSnackbarClose}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AdminOrders;