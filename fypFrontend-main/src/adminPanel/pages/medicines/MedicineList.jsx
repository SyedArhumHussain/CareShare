import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';

import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import axios from 'axios';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import TableFooter from '@mui/material/TableFooter';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router';
import { Popconfirm, message, Tag  } from 'antd';
import Swal from "sweetalert2";
import { Modal, Avatar, Chip, Card, CardContent, Stack, TextField, InputAdornment, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
        sx={{
          color: page === 0 ? 'rgba(0, 0, 0, 0.26)' : '#58869e',
          '&:hover': {
            backgroundColor: 'rgba(88, 134, 158, 0.08)',
          }
        }}
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
        sx={{
          color: page === 0 ? 'rgba(0, 0, 0, 0.26)' : '#58869e',
          '&:hover': {
            backgroundColor: 'rgba(88, 134, 158, 0.08)',
          }
        }}
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
        sx={{
          color: page >= Math.ceil(count / rowsPerPage) - 1 ? 'rgba(0, 0, 0, 0.26)' : '#58869e',
          '&:hover': {
            backgroundColor: 'rgba(88, 134, 158, 0.08)',
          }
        }}
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
        sx={{
          color: page >= Math.ceil(count / rowsPerPage) - 1 ? 'rgba(0, 0, 0, 0.26)' : '#58869e',
          '&:hover': {
            backgroundColor: 'rgba(88, 134, 158, 0.08)',
          }
        }}
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default function MedicineList() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [open1, setOpen1] = React.useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filteredRows, setFilteredRows] = React.useState([]);

  const getProductDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:4000/askDonator');
      if (response?.data?.database) {
        const data = response.data.database;
        setRows(data);
        setFilteredRows(data);
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "Failed to load medicines data. Please try again.",
        icon: "error",
        confirmButtonColor: "#58869e",
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getProductDetails();
  }, []);

  React.useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredRows(rows);
    } else {
      const filtered = rows.filter(row => 
        row.medicineName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRows(filtered);
    }
  }, [searchTerm, rows]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpen = (row) => {
    setOpen1(row);
  };

  const handleClose = () => {
    setOpen1(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/askDonator/${id}`);
      Swal.fire({
        title: "Success",
        text: "Medicine deleted successfully!",
        icon: "success",
        confirmButtonColor: "#58869e",
      });
      getProductDetails();
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "Failed to delete medicine. Please try again.",
        icon: "error",
        confirmButtonColor: "#58869e",
      });
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      console.log(`Attempting to update medicine status to ${newStatus} for ID: ${id}`);
      const response = await axios.put(`http://localhost:4000/askDonator/${id}`, { 
        status: newStatus
      });
      
      console.log('Status update response:', response.data);
      
      if (response.data) {
        // Update the local state to reflect the change
        setRows(prevRows => prevRows.map(row => 
          row._id === id ? { ...row, status: newStatus } : row
        ));
        
        setFilteredRows(prevRows => prevRows.map(row => 
          row._id === id ? { ...row, status: newStatus } : row
        ));
        
        if (open1 && open1._id === id) {
          setOpen1(prev => ({ ...prev, status: newStatus }));
        }
        
        // Show success message
        Swal.fire({
          title: "Success!",
          text: `Medicine status updated to ${newStatus} successfully.`,
          icon: "success",
          confirmButtonColor: "#58869e",
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      
      if (error.response) {
        console.error("Server response error data:", error.response.data);
        console.error("Server response status:", error.response.status);
      }
      
      // Show error message
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to update medicine status",
        icon: "error",
        confirmButtonColor: "#58869e",
      });
    }
  };

  const handleApprove = (id) => {
    Swal.fire({
      title: "Approve Medicine?",
      text: "Are you sure you want to approve this medicine donation?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#4CAF50",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve it!"
    }).then((result) => {
      if (result.isConfirmed) {
        handleUpdateStatus(id, 'approved');
      }
    });
  };

  const handleReject = (id) => {
    Swal.fire({
      title: "Reject Medicine?",
      text: "Are you sure you want to reject this medicine donation?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, reject it!"
    }).then((result) => {
      if (result.isConfirmed) {
        handleUpdateStatus(id, 'rejected');
      }
    });
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length) : 0;
  
  const getChipColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved':
        return {
          bg: 'rgba(76, 175, 80, 0.12)',
          color: '#4CAF50'
        };
      case 'pending':
        return {
          bg: 'rgba(255, 152, 0, 0.12)',
          color: '#FF9800'
        };
      case 'rejected':
        return {
          bg: 'rgba(244, 67, 54, 0.12)',
          color: '#F44336'
        };
      default:
        return {
          bg: 'rgba(97, 97, 97, 0.12)',
          color: '#616161'
        };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  return (
    <>
      <Card 
        elevation={0} 
        sx={{ 
          mb: 3, 
          borderRadius: 3,
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
          border: '1px solid rgba(0,0,0,0.05)'
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            justifyContent="space-between" 
            alignItems={{ xs: 'stretch', sm: 'center' }}
            spacing={2}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
              Medicines List
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', maxWidth: { xs: '100%', sm: '60%' } }}>
              <TextField
                placeholder="Search medicines..."
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ 
                  minWidth: 220,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f8f9fa',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#58869e',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#58869e',
                    }
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: '#637381' }} />
                    </InputAdornment>
                  ),
                }}
              />
              
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                sx={{
                  borderColor: '#58869e',
                  color: '#58869e',
                  borderRadius: 2,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#365b6f',
                    backgroundColor: 'rgba(88, 134, 158, 0.04)',
                  }
                }}
              >
                Filter
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
            
      <Paper 
        elevation={0} 
        sx={{ 
          borderRadius: 3, 
          overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
          border: '1px solid rgba(0,0,0,0.05)'
        }}
      >
        {loading ? (
          <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress sx={{ color: '#58869e' }} />
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#333',
                      fontSize: '0.875rem',
                      backgroundColor: '#f8f9fa',
                      py: 2
                    }}
                  >
                    Medicine Name
                  </TableCell>
                  <TableCell 
                    align="center" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#333',
                      fontSize: '0.875rem',
                      backgroundColor: '#f8f9fa',
                      py: 2
                    }}
                  >
                    Donor Name
                  </TableCell>
                  <TableCell 
                    align="center" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#333',
                      fontSize: '0.875rem',
                      backgroundColor: '#f8f9fa',
                      py: 2
                    }}
                  >
                    Quantity
                  </TableCell>
                  <TableCell 
                    align="center" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#333',
                      fontSize: '0.875rem',
                      backgroundColor: '#f8f9fa',
                      py: 2
                    }}
                  >
                    Expiry Date
                  </TableCell>
                  <TableCell 
                    align="center" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#333',
                      fontSize: '0.875rem',
                      backgroundColor: '#f8f9fa',
                      py: 2
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell 
                    align="center" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#333',
                      fontSize: '0.875rem',
                      backgroundColor: '#f8f9fa',
                      py: 2
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No medicines found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  (rowsPerPage > 0
                    ? filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : filteredRows
                  ).map((row, index) => (
                    <TableRow 
                      key={row._id || index}
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: 'rgba(88, 134, 158, 0.03)',
                        },
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <TableCell 
                        component="th" 
                        scope="row"
                        sx={{ 
                          py: 2.5,
                          borderBottom: '1px solid #f0f0f0',
                          color: '#333',
                          fontWeight: 500
                        }}
                      >
                        {row.medicineName}
                      </TableCell>
                      <TableCell 
                        align="center"
                        sx={{ 
                          py: 2.5,
                          borderBottom: '1px solid #f0f0f0',
                          color: '#555'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Avatar 
                            sx={{ 
                              width: 36, 
                              height: 36, 
                              bgcolor: '#58869e', 
                              fontSize: '0.875rem',
                              mr: 1,
                              fontWeight: 500,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                          >
                            {row.name ? row.name.charAt(0).toUpperCase() : 'U'}
                          </Avatar>
                          <Typography variant="body2">{row.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell 
                        align="center"
                        sx={{ 
                          py: 2.5,
                          borderBottom: '1px solid #f0f0f0',
                          color: '#555'
                        }}
                      >
                        <Typography fontWeight={500}>{row.medicineQty || '0'}</Typography>
                      </TableCell>
                      <TableCell 
                        align="center"
                        sx={{ 
                          py: 2.5,
                          borderBottom: '1px solid #f0f0f0',
                          color: '#555'
                        }}
                      >
                        {formatDate(row.medicineExp)}
                      </TableCell>
                      <TableCell 
                        align="center"
                        sx={{ 
                          py: 2.5,
                          borderBottom: '1px solid #f0f0f0'
                        }}
                      >
                        <Chip 
                          label={row.status || 'Pending'} 
                          sx={{ 
                            backgroundColor: getChipColor(row.status).bg,
                            color: getChipColor(row.status).color,
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            textTransform: 'capitalize',
                            px: 1,
                            '& .MuiChip-label': {
                              px: 1
                            }
                          }}
                          size="small"
                        />
                      </TableCell>
                      <TableCell 
                        align="center"
                        sx={{ 
                          py: 2,
                          borderBottom: '1px solid #f0f0f0'
                        }}
                      >
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Box component="span">
                            <Tooltip title="View Details">
                              <IconButton
                                onClick={() => handleOpen(row)}
                                size="small"
                                sx={{ 
                                  color: '#58869e',
                                  backgroundColor: 'rgba(88, 134, 158, 0.08)',
                                  '&:hover': {
                                    backgroundColor: 'rgba(88, 134, 158, 0.16)',
                                  }
                                }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                          
                          {row.status === 'pending' && (
                            <>
                              <Box component="span">
                                <Tooltip title="Approve">
                                  <IconButton
                                    onClick={() => handleApprove(row._id)}
                                    size="small"
                                    sx={{ 
                                      color: '#4CAF50',
                                      backgroundColor: 'rgba(76, 175, 80, 0.08)',
                                      '&:hover': {
                                        backgroundColor: 'rgba(76, 175, 80, 0.16)',
                                      }
                                    }}
                                  >
                                    <CheckCircleIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                              
                              <Box component="span">
                                <Tooltip title="Reject">
                                  <IconButton
                                    onClick={() => handleReject(row._id)}
                                    size="small"
                                    sx={{ 
                                      color: '#F44336',
                                      backgroundColor: 'rgba(244, 67, 54, 0.08)',
                                      '&:hover': {
                                        backgroundColor: 'rgba(244, 67, 54, 0.16)',
                                      }
                                    }}
                                  >
                                    <CancelIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </>
                          )}
                          
                          <Box component="span">
                            <Tooltip title="Delete">
                              <span>
                                <Popconfirm
                                  title="Delete Medicine"
                                  description="Are you sure you want to delete this medicine?"
                                  onConfirm={() => handleDelete(row._id)}
                                  okText="Yes"
                                  cancelText="No"
                                  okButtonProps={{ style: { backgroundColor: '#58869e', borderColor: '#58869e' } }}
                                >
                                  <IconButton
                                    size="small"
                                    sx={{ 
                                      color: '#F44336',
                                      backgroundColor: 'rgba(244, 67, 54, 0.08)',
                                      '&:hover': {
                                        backgroundColor: 'rgba(244, 67, 54, 0.16)',
                                      }
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Popconfirm>
                              </span>
                            </Tooltip>
                          </Box>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
                
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center', 
          p: 2, 
          borderTop: '1px solid rgba(0, 0, 0, 0.05)',
          backgroundColor: '#f8f9fa'
        }}>
          <Typography variant="body2" color="text.secondary">
            Showing {Math.min(filteredRows.length, page * rowsPerPage + 1)}-
            {Math.min(filteredRows.length, page * rowsPerPage + rowsPerPage)} of {filteredRows.length} medicines
          </Typography>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
            labelRowsPerPage="Rows per page:"
            sx={{
              '.MuiTablePagination-selectLabel, .MuiTablePagination-select, .MuiTablePagination-selectIcon': {
                color: '#555',
                fontSize: '0.875rem',
                display: { xs: 'none', sm: 'block' }
              },
              '.MuiTablePagination-displayedRows': {
                color: '#555',
                fontSize: '0.875rem',
                display: { xs: 'none', sm: 'block' }
              },
              '.MuiTablePagination-toolbar': {
                pl: 0,
                pr: 0
              }
            }}
          />
        </Box>
      </Paper>
      
      {/* Detail Modal */}
      <Modal
        open={Boolean(open1)}
        onClose={handleClose}
        aria-labelledby="medicine-detail-title"
        aria-describedby="medicine-detail-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 500 },
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          borderRadius: 3,
          boxShadow: 24,
          overflow: 'auto',
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            p: 2, 
            borderBottom: '1px solid rgba(0,0,0,0.08)',
            position: 'sticky',
            top: 0,
            bgcolor: 'white',
            zIndex: 1
          }}>
            <Typography variant="h6" component="h2" fontWeight={600}>
              Medicine Details
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          
          {open1 && (
            <Box sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Medicine Name</Typography>
                  <Typography variant="subtitle1" fontWeight={500}>{open1.medicineName}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">Donor Information</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <Avatar 
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        bgcolor: '#58869e', 
                        mr: 1.5 
                      }}
                    >
                      {open1.name ? open1.name.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={500}>{open1.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{open1.email}</Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">Quantity</Typography>
                  <Typography variant="subtitle1" fontWeight={500}>{open1.medicineQty || '0'}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">Expiry Date</Typography>
                  <Typography variant="subtitle1" fontWeight={500}>{formatDate(open1.medicineExp)}</Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">Medicine Image</Typography>
                  <Box sx={{ mt: 1, textAlign: 'center' }}>
                    {open1.medicineImg ? (
                      <img 
                        src={open1.medicineImg} 
                        alt="Medicine" 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '200px', 
                          objectFit: 'contain',
                          borderRadius: '8px',
                          border: '1px solid #eee'
                        }}
                        onError={(e) => {
                          console.error("Image failed to load:", e);
                          // Fallback to direct HTTP URL if the URL might be relative
                          if (!open1.medicineImg.startsWith('http')) {
                            e.target.src = `http://localhost:4000${open1.medicineImg}`;
                          }
                        }}
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No image available
                      </Typography>
                    )}
                  </Box>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">Status</Typography>
                  <Chip 
                    label={open1.status || 'Pending'} 
                    sx={{ 
                      mt: 0.5,
                      backgroundColor: getChipColor(open1.status).bg,
                      color: getChipColor(open1.status).color,
                      fontWeight: 600,
                      textTransform: 'capitalize'
                    }}
                    size="small"
                  />
                </Box>
                
                {open1.description && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">Description</Typography>
                    <Typography variant="body1">{open1.description}</Typography>
                  </Box>
                )}
              </Stack>
              
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button 
                  onClick={handleClose}
                  variant="outlined"
                  color="inherit"
                  sx={{ 
                    borderColor: '#ccc',
                    color: '#666',
                    '&:hover': {
                      borderColor: '#999',
                      backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    }
                  }}
                >
                  Close
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
}
