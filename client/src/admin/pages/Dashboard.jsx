import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  useTheme
} from '@mui/material';
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  ShoppingCart as ShoppingCartIcon,
  MonetizationOn as MonetizationOnIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
} from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';

// Đăng ký các thành phần Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
);

const Dashboard = () => {
  const theme = useTheme();

  // Dữ liệu biểu đồ tròn
  const donutData = {
    labels: ['In Stock', 'Production', 'Low Stock'],
    datasets: [
      {
        label: 'Stock Unit',
        data: [65, 20, 15],
        backgroundColor: [
          theme.palette.success.main,
          theme.palette.warning.main,
          theme.palette.error.main,
        ],
        borderWidth: 0,
      },
    ],
  };

  // Dữ liệu biểu đồ đường
  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Revenue',
        data: [15000, 22000, 18000, 25000, 23000, 30000, 35000],
        borderColor: theme.palette.primary.main,
        backgroundColor: 'rgba(63, 81, 181, 0.1)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Orders',
        data: [8000, 12000, 10000, 15000, 14000, 18000, 20000],
        borderColor: theme.palette.secondary.main,
        backgroundColor: 'rgba(233, 30, 99, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Dữ liệu biểu đồ thanh
  const barData = {
    labels: ['Smartphone', 'Laptop', 'Tablet', 'Headphones', 'Camera'],
    datasets: [
      {
        label: 'Sales (units)',
        data: [1200, 800, 600, 400, 300],
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.info.main,
          theme.palette.warning.main,
          theme.palette.error.main,
        ],
        borderRadius: 5,
      },
    ],
  };

  // Các chỉ số thống kê
  const kpiCards = [
    {
      label: 'Total Sales',
      value: '$24,568.00',
      change: '+12.5%',
      isPositive: true,
      icon: <MonetizationOnIcon fontSize="large" />
    },
    {
      label: 'Total Orders',
      value: '1,856',
      change: '+8.2%',
      isPositive: true,
      icon: <ShoppingCartIcon fontSize="large" />
    },
    {
      label: 'New Customers',
      value: '342',
      change: '+15.3%',
      isPositive: true,
      icon: <PeopleIcon fontSize="large" />
    },
    {
      label: 'Avg. Order Value',
      value: '$132.45',
      change: '-2.1%',
      isPositive: false,
      icon: <TrendingUpIcon fontSize="large" />
    },
  ];

  // Đơn hàng gần đây
  const recentOrders = [
    { id: '#12847', customer: 'John Smith', amount: '$189.99', status: 'Delivered' },
    { id: '#12846', customer: 'Emma Johnson', amount: '$245.50', status: 'Processing' },
    { id: '#12845', customer: 'Michael Brown', amount: '$89.99', status: 'Shipped' },
    { id: '#12844', customer: 'Sarah Davis', amount: '$345.75', status: 'Delivered' },
    { id: '#12843', customer: 'David Wilson', amount: '$120.00', status: 'Cancelled' },
  ];

  // Sản phẩm bán chạy
  const topProducts = [
    { name: 'Smartphone X Pro', sales: '1,240 units', revenue: '$98,760' },
    { name: 'UltraBook Pro', sales: '856 units', revenue: '$64,200' },
    { name: 'Wireless Earbuds Pro', sales: '1,520 units', revenue: '$45,600' },
    { name: 'Smart Watch Series 5', sales: '920 units', revenue: '$55,200' },
    { name: '4K Smart TV 55"', sales: '480 units', revenue: '$62,400' },
  ];

  // Tùy chọn biểu đồ
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 12,
        boxShadow: theme.shadows[3],
        usePointStyle: true,
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
        }
      }
    }
  };

  // Tùy chọn riêng cho biểu đồ đường
  const lineOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Monthly Revenue & Orders',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          bottom: 20
        }
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Dashboard Overview
      </Typography>

      {/* Các chỉ số KPI */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {kpiCards.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{
              height: '100%',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              background: theme.palette.mode === 'dark' ?
                'linear-gradient(135deg, #2c3e50, #1a1a2e)' :
                'linear-gradient(135deg, #f5f7fa, #e4e7eb)'
            }}>
              <CardContent>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      {kpi.label}
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
                      {kpi.value}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      {kpi.isPositive ? (
                        <ArrowUpwardIcon fontSize="small" sx={{ color: theme.palette.success.main }} />
                      ) : (
                        <ArrowDownwardIcon fontSize="small" sx={{ color: theme.palette.error.main }} />
                      )}
                      <Typography
                        variant="body2"
                        sx={{
                          ml: 0.5,
                          color: kpi.isPositive ? theme.palette.success.main : theme.palette.error.main
                        }}
                      >
                        {kpi.change}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                        from last month
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.mode === 'dark' ?
                      'rgba(63, 81, 181, 0.2)' : 'rgba(63, 81, 181, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.palette.primary.main
                  }}>
                    {kpi.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Biểu đồ chính */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Biểu đồ đường - Doanh thu */}
        <Grid item xs={12} md={8}>
          <Paper sx={{
            p: 3,
            height: '400px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <Line data={lineData} options={lineOptions} />
          </Paper>
        </Grid>

        {/* Biểu đồ tròn - Kho hàng */}
        <Grid item xs={12} md={4}>
          <Paper sx={{
            p: 3,
            height: '400px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Inventory Distribution
            </Typography>
            <Doughnut data={donutData} options={chartOptions} />
          </Paper>
        </Grid>
      </Grid>

      {/* Biểu đồ và danh sách phụ */}
      <Grid container spacing={3}>
        {/* Biểu đồ thanh - Sản phẩm bán chạy */}
        <Grid item xs={12} md={6}>
          <Paper sx={{
            p: 3,
            height: '400px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Top Selling Products
            </Typography>
            <Bar
              data={barData}
              options={{
                ...chartOptions,
                indexAxis: 'y',
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    display: false
                  }
                }
              }}
            />
          </Paper>
        </Grid>

        {/* Đơn hàng gần đây */}
        <Grid item xs={12} md={3}>
          <Paper sx={{
            p: 3,
            height: '400px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Recent Orders
              </Typography>
              <IconButton size="small">
                <MoreVertIcon />
              </IconButton>
            </Box>
            <List sx={{ overflowY: 'auto', maxHeight: 320 }}>
              {recentOrders.map((order, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {order.id}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {order.amount}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">
                            {order.customer}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: order.status === 'Delivered' ? theme.palette.success.main :
                                order.status === 'Processing' ? theme.palette.warning.main :
                                  order.status === 'Cancelled' ? theme.palette.error.main :
                                    theme.palette.info.main
                            }}
                          >
                            {order.status}
                          </Typography>
                        </Box>
                      }
                      sx={{ my: 0 }}
                    />
                  </ListItem>
                  {index < recentOrders.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Sản phẩm hàng đầu */}
        <Grid item xs={12} md={3}>
          <Paper sx={{
            p: 3,
            height: '400px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Top Products
              </Typography>
              <IconButton size="small">
                <MoreVertIcon />
              </IconButton>
            </Box>
            <List sx={{ overflowY: 'auto', maxHeight: 320 }}>
              {topProducts.map((product, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" fontWeight="bold">
                          {product.name}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">
                            {product.sales}
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {product.revenue}
                          </Typography>
                        </Box>
                      }
                      sx={{ my: 0 }}
                    />
                  </ListItem>
                  {index < topProducts.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;