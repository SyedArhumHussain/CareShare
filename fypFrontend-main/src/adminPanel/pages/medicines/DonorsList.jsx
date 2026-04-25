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
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import axios from 'axios';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import TableFooter from '@mui/material/TableFooter';
import { Avatar, Chip } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import { motion } from 'framer-motion';

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
        size="small"
        sx={{ 
          color: theme.palette.mode === 'light' ? '#58869e' : '#fff',
          '&.Mui-disabled': {
            color: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.26)' : 'rgba(255, 255, 255, 0.3)'
          }
        }}
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
        size="small"
        sx={{ 
          color: theme.palette.mode === 'light' ? '#58869e' : '#fff',
          '&.Mui-disabled': {
            color: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.26)' : 'rgba(255, 255, 255, 0.3)'
          }
        }}
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
        size="small"
        sx={{ 
          color: theme.palette.mode === 'light' ? '#58869e' : '#fff',
          '&.Mui-disabled': {
            color: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.26)' : 'rgba(255, 255, 255, 0.3)'
          }
        }}
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
        size="small"
        sx={{ 
          color: theme.palette.mode === 'light' ? '#58869e' : '#fff',
          '&.Mui-disabled': {
            color: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.26)' : 'rgba(255, 255, 255, 0.3)'
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



export default function DonorsList() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState([]);



  React.useEffect(() => {
    getProductDetails()
 },[])

 const getProductDetails = async () => {
  try {
    const response =()=>  axios.get('http://localhost:4000/donor');

    response().then((res)=>{
          // res?.data?.database
          
     console.log('contactttt',res?.data)
     setRows(res?.data)
    });
    // .catch(())
     // Assuming your API returns an array of objects
    // setRows(res?.data?.database);
  } catch (error) {
    console.error(error);
    // Handle error, show error message to user, etc.
  }
};
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  // Get random pastel colors for avatars
  const getRandomColor = (name) => {
    const colors = [
      '#58869e', // primary theme color
      '#6a9fb5', // lighter blue
      '#365b6f', // darker blue
      '#5e8d7e', // teal
      '#7c9885', // sage
    ];
    
    // Use the first character of the name to select a color
    const charCode = name ? name.charCodeAt(0) : 0;
    return colors[charCode % colors.length];
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
            Donors Management
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            View and manage all registered donors in the CareShare platform.
          </Typography>
        </Paper>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <TableContainer component={Paper} className="table-container" sx={{ 
          borderRadius: 2, 
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
            <TableHead className="table-header">
              <TableRow>
                <TableCell 
                  sx={{ 
                    fontWeight: 600, 
                    color: '#333',
                    fontSize: '0.875rem',
                    borderBottom: '2px solid #f0f0f0',
                    backgroundColor: '#f8f9fa',
                    py: 2,
                    width: '30%'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon sx={{ mr: 1, color: '#58869e', fontSize: 20 }} />
                    Donor
                  </Box>
                </TableCell>
                <TableCell 
                  align="center" 
                  sx={{ 
                    fontWeight: 600, 
                    color: '#333',
                    fontSize: '0.875rem',
                    borderBottom: '2px solid #f0f0f0',
                    backgroundColor: '#f8f9fa',
                    py: 2,
                    width: '30%'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <EmailIcon sx={{ mr: 1, color: '#58869e', fontSize: 20 }} />
                    Email
                  </Box>
                </TableCell>
                <TableCell 
                  align="right" 
                  sx={{ 
                    fontWeight: 600, 
                    color: '#333',
                    fontSize: '0.875rem',
                    borderBottom: '2px solid #f0f0f0',
                    backgroundColor: '#f8f9fa',
                    py: 2,
                    width: '40%'
                  }}
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : rows
              ).map((row, index) => (
                <TableRow 
                  key={row._id || index}
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: 'rgba(88, 134, 158, 0.04)',
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
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: getRandomColor(row.fname), 
                          width: 40, 
                          height: 40,
                          mr: 2,
                          fontWeight: 600
                        }}
                      >
                        {row.fname ? row.fname.charAt(0).toUpperCase() : ''}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500, color: '#333' }}>
                          {row.fname} {row.lname}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          Joined: {new Date().toLocaleDateString()}
                        </Typography>
                      </Box>
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
                    <Chip 
                      label={row.email} 
                      size="small" 
                      sx={{ 
                        bgcolor: 'rgba(88, 134, 158, 0.1)', 
                        color: '#58869e',
                        fontWeight: 500,
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }} 
                    />
                  </TableCell>
                  <TableCell 
                    align="right"
                    sx={{ 
                      py: 2.5,
                      borderBottom: '1px solid #f0f0f0',
                    }}
                  >
                    <Chip 
                      label="Active" 
                      size="small" 
                      sx={{ 
                        bgcolor: 'rgba(76, 175, 80, 0.1)', 
                        color: '#4CAF50',
                        fontWeight: 500
                      }} 
                    />
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={3} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', p: 2 }}>
          <Typography variant="body2" sx={{ mr: 2, color: '#666', display: 'block' }}>
            Rows per page:
          </Typography>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            SelectProps={{
              inputProps: {
                'aria-label': 'rows per page',
              },
              native: true,
              sx: { 
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                p: '2px 8px',
                mr: 2,
                color: '#555'
              }
            }}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
            labelRowsPerPage=""
            sx={{ 
              border: 'none', 
              '.MuiTablePagination-toolbar': {
                padding: 0
              },
              '.MuiTablePagination-displayedRows': {
                color: '#666',
                mr: 2
              },
              '.MuiTablePagination-selectLabel': {
                display: 'none'
              }
            }}
          />
        </Box>
      </motion.div>
    </>
  );
}