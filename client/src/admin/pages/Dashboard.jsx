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
  MoreVert as MoreVertIcon,
  Storage as StorageIcon,
  Category as CategoryIcon,
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

  const formatCurrencyVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const productCategories = ['Laptop', 'Smartphone', 'Smartwatch', 'Tablet', 'Camera'];

  const donutData = {
    labels: productCategories,
    datasets: [
      {
        label: 'Stock Units',
        data: [2500, 4000, 1500, 1000, 800],
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.success.main,
          theme.palette.info.main,
          theme.palette.warning.main,
          theme.palette.error.main,
        ],
        borderColor: theme.palette.background.paper,
        borderWidth: 2,
      },
    ],
  };

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue (₫)',
        data: [
          150000000, 220000000, 180000000, 250000000, 230000000, 300000000,
          350000000, 320000000, 380000000, 400000000, 450000000, 500000000
        ],
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.light + '20',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Orders',
        data: [800, 1200, 1000, 1500, 1400, 1800, 2000, 1900, 2200, 2500, 2800, 3000],
        borderColor: theme.palette.secondary.main,
        backgroundColor: theme.palette.secondary.light + '20',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const barData = {
    labels: productCategories,
    datasets: [
      {
        label: 'Sales (units)',
        data: [1200, 1800, 700, 500, 350],
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.success.main,
          theme.palette.info.main,
          theme.palette.warning.main,
          theme.palette.error.main,
        ],
        borderRadius: 5,
      },
    ],
  };

  const kpiCards = [
    {
      label: 'Total Revenue',
      value: formatCurrencyVND(245680000),
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
      label: 'Average Order Value',
      value: formatCurrencyVND(1324500),
      change: '-2.1%',
      isPositive: false,
      icon: <TrendingUpIcon fontSize="large" />
    },
  ];

  const recentOrders = [
    { id: '#12850', customer: 'Nguyễn Văn A', amount: 1899900, status: 'Delivered' },
    { id: '#12849', customer: 'Trần Thị B', amount: 2455000, status: 'Processing' },
    { id: '#12848', customer: 'Lê Văn C', amount: 899900, status: 'Shipped' },
    { id: '#12847', customer: 'Phạm Thị D', amount: 3457500, status: 'Delivered' },
    { id: '#12846', customer: 'Hoàng Văn E', amount: 1200000, status: 'Cancelled' },
  ];

  const topProductsList = [
    { name: 'Smartphone X Pro', sales: '1,240 units', revenue: 98760000 },
    { name: 'Laptop UltraBook', sales: '856 units', revenue: 64200000 },
    { name: 'Smartwatch Series 5', sales: '920 units', revenue: 55200000 },
    { name: 'Tablet Z10', sales: '600 units', revenue: 36000000 },
    { name: 'Camera ProShot', sales: '480 units', revenue: 28800000 },
  ];

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
            size: 12,
            family: 'Roboto, sans-serif',
          }
        }
      },
      tooltip: {
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.common.white,
        titleColor: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary,
        bodyColor: theme.palette.mode === 'dark' ? theme.palette.grey[300] : theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 12,
        cornerRadius: 6,
        displayColors: true,
        boxPadding: 4,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (label.includes('Revenue')) {
                label += formatCurrencyVND(context.parsed.y);
              } else if (label.includes('Orders') || label.includes('Sales')) {
                label += context.parsed.y.toLocaleString();
              } else {
                label += context.parsed.y;
              }
            }
            return label;
          }
        }
      },
      title: {
        display: false,
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: { size: 12 }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
          drawBorder: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: { size: 12 },
          callback: function (value) {
            if (this.max > 1000000000) return (value / 1000000000).toLocaleString('en-US') + 'B';
            if (this.max > 1000000) return (value / 1000000).toLocaleString('en-US') + 'M';
            if (this.max > 1000) return (value / 1000).toLocaleString('en-US') + 'K';
            return value.toLocaleString('en-US');
          }
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    }
  };

  const lineOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y: {
        ...chartOptions.scales.y,
        ticks: {
          ...chartOptions.scales.y.ticks,
          callback: function (value) {
            const datasetLabel = this.chart.data.datasets[0].label;
            if (datasetLabel && datasetLabel.includes('Revenue')) {
              if (value >= 1000000000) return (value / 1000000000).toLocaleString('en-US') + 'B';
              if (value >= 1000000) return (value / 1000000).toLocaleString('en-US') + 'M';
              if (value >= 1000) return (value / 1000).toLocaleString('en-US') + 'K';
              return value.toLocaleString('en-US');
            } else if (datasetLabel && datasetLabel.includes('Orders')) {
              return value.toLocaleString('en-US');
            }
            return value;
          }
        }
      }
    },
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Monthly Revenue & Orders',
        font: {
          size: 18,
          weight: 'bold',
          family: 'Roboto, sans-serif',
        },
        padding: {
          bottom: 20
        },
        color: theme.palette.text.primary,
      }
    }
  };

  const barOptions = {
    ...chartOptions,
    indexAxis: 'y',
    scales: {
      x: {
        ...chartOptions.scales.x,
        ticks: {
          ...chartOptions.scales.x.ticks,
          callback: function (value) {
            return value.toLocaleString('en-US');
          }
        }
      },
      y: {
        ...chartOptions.scales.y,
        grid: { display: false, drawBorder: false },
        ticks: {
          color: theme.palette.text.primary,
          font: { size: 12, weight: 'bold' }
        }
      }
    },
    plugins: {
      ...chartOptions.plugins,
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Top Selling Products by Units',
        font: {
          size: 18,
          weight: 'bold',
          family: 'Roboto, sans-serif',
        },
        padding: {
          bottom: 20
        },
        color: theme.palette.text.primary,
      }
    }
  };


  return (
    <Box sx={{ p: { xs: 2, md: 3 }, backgroundColor: theme.palette.background.default, minHeight: '100vh' }}> {/* REMOVED maxWidth here */}
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: theme.palette.text.primary }}>
        Dashboard Overview
      </Typography>

      {/* KPI Cards (Responsive grid, will expand to full width) */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpiCards.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{
              height: '100%',
              borderRadius: '16px',
              boxShadow: theme.shadows[4],
              display: 'flex',
              alignItems: 'center',
              background: theme.palette.background.paper,
            }}>
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1
                }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {kpi.label}
                  </Typography>
                  <Box sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.action.hover,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.palette.primary.main
                  }}>
                    {kpi.icon}
                  </Box>
                </Box>
                <Typography variant="h5" fontWeight="bold" sx={{ mt: 1, color: theme.palette.text.primary }}>
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
                      color: kpi.isPositive ? theme.palette.success.main : theme.palette.error.main,
                      fontWeight: 'bold'
                    }}
                  >
                    {kpi.change}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                    from last month
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Monthly Revenue & Orders (Line Chart) - Kéo rộng toàn bộ hàng ngang */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}> {/* Luôn chiếm 12 cột trên mọi kích thước */}
          <Paper sx={{
            p: { xs: 2, md: 3 },
            height: '550px', // Chiều cao cố định
            width: '100%', // Đảm bảo chiếm 100% chiều rộng của Grid item
            borderRadius: '16px',
            boxShadow: theme.shadows[4],
            backgroundColor: theme.palette.background.paper,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Line data={lineData} options={lineOptions} />
          </Paper>
        </Grid>
      </Grid>

      {/* Product Inventory Distribution (Doughnut Chart) và Top Selling Products (Bar Chart) - Cùng hàng, mỗi cái chiếm 50% ngang */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}> {/* Chiếm 12 cột trên mobile, 6 cột trên desktop */}
          <Paper sx={{
            p: { xs: 2, md: 3 },
            height: '450px', // Chiều cao cố định
            width: '100%', // Đảm bảo chiếm 100% chiều rộng của Grid item
            borderRadius: '16px',
            boxShadow: theme.shadows[4],
            backgroundColor: theme.palette.background.paper,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.text.primary, mb: 2 }}>
              Product Inventory Distribution
            </Typography>
            <Box sx={{ width: '100%', maxWidth: 300, mx: 'auto' }}>
              <Doughnut data={donutData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, legend: { position: 'right' } } }} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}> {/* Chiếm 12 cột trên mobile, 6 cột trên desktop */}
          <Paper sx={{
            p: { xs: 2, md: 3 },
            height: '450px', // Chiều cao cố định, khớp với Doughnut
            width: '100%', // Đảm bảo chiếm 100% chiều rộng của Grid item
            borderRadius: '16px',
            boxShadow: theme.shadows[4],
            backgroundColor: theme.palette.background.paper,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Bar data={barData} options={barOptions} />
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Orders List và Top 5 Products by Revenue - Cùng hàng, mỗi cái chiếm 50% ngang */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}> {/* Chiếm 12 cột trên mobile, 6 cột trên desktop */}
          <Paper sx={{
            p: { xs: 2, md: 3 },
            height: '400px', // Chiều cao cố định
            width: '100%', // Đảm bảo chiếm 100% chiều rộng của Grid item
            borderRadius: '16px',
            boxShadow: theme.shadows[4],
            backgroundColor: theme.palette.background.paper,
            display: 'flex',
            flexDirection: 'column',
          }}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
              pb: 1,
              borderBottom: `1px solid ${theme.palette.divider}`
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                Recent Orders
              </Typography>
              <IconButton size="small" sx={{ color: theme.palette.action.active }}>
                <MoreVertIcon />
              </IconButton>
            </Box>
            <List sx={{ flexGrow: 1, overflowY: 'auto', p: 0 }}>
              {recentOrders.map((order, index) => (
                <React.Fragment key={order.id}>
                  <ListItem disablePadding>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
                            {order.id}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatCurrencyVND(order.amount)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                          <Typography variant="body2" color="text.secondary">
                            {order.customer}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 'medium',
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
                      sx={{ my: 1 }}
                    />
                  </ListItem>
                  {index < recentOrders.length - 1 && <Divider component="li" sx={{ my: 0.5 }} />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}> {/* Chiếm 12 cột trên mobile, 6 cột trên desktop */}
          <Paper sx={{
            p: { xs: 2, md: 3 },
            height: '400px', // Chiều cao cố định, khớp với Recent Orders
            width: '100%', // Đảm bảo chiếm 100% chiều rộng của Grid item
            borderRadius: '16px',
            boxShadow: theme.shadows[4],
            backgroundColor: theme.palette.background.paper,
            display: 'flex',
            flexDirection: 'column',
          }}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
              pb: 1,
              borderBottom: `1px solid ${theme.palette.divider}`
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                Top 5 Products by Revenue
              </Typography>
              <IconButton size="small" sx={{ color: theme.palette.action.active }}>
                <MoreVertIcon />
              </IconButton>
            </Box>
            <List sx={{ flexGrow: 1, overflowY: 'auto', p: 0 }}>
              {topProductsList.map((product, index) => (
                <React.Fragment key={index}>
                  <ListItem disablePadding>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
                          {product.name}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                          <Typography variant="body2" color="text.secondary">
                            {product.sales}
                          </Typography>
                          <Typography variant="body2" fontWeight="bold" color={theme.palette.success.dark}>
                            {formatCurrencyVND(product.revenue)}
                          </Typography>
                        </Box>
                      }
                      sx={{ my: 1 }}
                    />
                  </ListItem>
                  {index < topProductsList.length - 1 && <Divider component="li" sx={{ my: 0.5 }} />}
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