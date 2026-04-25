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
import Button from '@mui/material/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmailIcon from '@mui/icons-material/Email';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import Tooltip from '@mui/material/Tooltip';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import Swal from 'sweetalert2';
import { useState } from 'react';

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
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
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

export default function MedicineRequests() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  
  // For dialog
  const [open, setOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  // For OCR
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [emailSentRequests, setEmailSentRequests] = useState(new Set());

  React.useEffect(() => {
    getRequestsList();
  }, []);

  const getRequestsList = async () => {
    setLoading(true);
    try {
      console.log('Fetching medicine requests...');
      const response = await axios.get('http://localhost:4000/medicineRequests');
      console.log('Medicine requests response:', response);
      
      if (response.data) {
        console.log(`Retrieved ${response.data.length} medicine requests`);
        setRows(response.data);
      } else {
        console.error('No data returned from medicine requests API');
        setRows([]);
      }
    } catch (error) {
      console.error("Error fetching medicine requests:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
      // Set empty array to avoid undefined errors
      setRows([]);
      
      // Show error message to admin
      Swal.fire({
        icon: "error",
        title: "Error Loading Requests",
        text: "Failed to load medicine requests. Please try again or check the server connection.",
        confirmButtonColor: "#58869e",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setOpen(true);
    setOcrResult(""); // Reset OCR result when opening dialog
    setImageLoaded(false); // Reset image loaded state
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleApprove = async (id) => {
    setActionLoading(true);
    console.log(`Attempting to approve request with ID: ${id}`);
    try {
      console.log(`Sending POST request to: http://localhost:4000/approveMedicineRequest/${id}`);
      const response = await axios.post(`http://localhost:4000/approveMedicineRequest/${id}`);
      console.log('Approval response:', response.data);
      
      if (response.data.success) {
        console.log('Request approved successfully');
        // Update the local state to reflect the change
        setRows(prevRows => prevRows.map(row => 
          row._id === id ? { ...row, status: 'approved' } : row
        ));
        
        if (open) {
          setSelectedRequest(prev => ({ ...prev, status: 'approved' }));
        }
        
        // Show success message
        Swal.fire({
          title: "Success!",
          text: "Medicine request approved successfully.",
          icon: "success",
          confirmButtonColor: "#58869e",
        });
        
        // Refresh the medicine list to reflect updated quantities
        getRequestsList();
      }
    } catch (error) {
      console.error("Error approving request:", error);
      
      if (error.response) {
        console.error("Server response error data:", error.response.data);
        console.error("Server response status:", error.response.status);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      
      // Get the error message from the response if available
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Failed to approve request";
      
      // Show error message
      Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#58869e",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(true);
    console.log(`Attempting to reject request with ID: ${id}`);
    try {
      console.log(`Sending POST request to: http://localhost:4000/rejectMedicineRequest/${id}`);
      const response = await axios.post(`http://localhost:4000/rejectMedicineRequest/${id}`);
      console.log('Rejection response:', response.data);
      
      if (response.data.success) {
        console.log('Request rejected successfully');
        // Update the local state to reflect the change
        setRows(prevRows => prevRows.map(row => 
          row._id === id ? { ...row, status: 'rejected' } : row
        ));
        
        if (open) {
          setSelectedRequest(prev => ({ ...prev, status: 'rejected' }));
        }
        
        // Show success message
        Swal.fire({
          title: "Success!",
          text: "Medicine request rejected successfully.",
          icon: "success",
          confirmButtonColor: "#58869e",
        });
        
        // Refresh the medicine list
        getRequestsList();
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      
      if (error.response) {
        console.error("Server response error data:", error.response.data);
        console.error("Server response status:", error.response.status);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      
      // Get the error message from the response if available
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Failed to reject request";
      
      // Show error message
      Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#58869e",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const sendEmail = async (id) => {
    setActionLoading(true);
    try {
      const response = await axios.post(`http://localhost:4000/sendMedicineEmail/${id}`);
      
      if (response.data.success) {
        // Add this request ID to the set of emails sent
        setEmailSentRequests(prev => new Set([...prev, id]));
        
        Swal.fire({
          title: "Email Sent",
          text: "Email sent successfully to recipient",
          icon: "success",
          confirmButtonColor: "#58869e",
        });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to send email",
        icon: "error",
        confirmButtonColor: "#58869e",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveClick = (id, medicineName, medicineQty) => {
    Swal.fire({
      title: "Approve Request?",
      text: `Are you sure you want to approve the request for ${medicineQty} units of ${medicineName}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#4CAF50",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve it!"
    }).then((result) => {
      if (result.isConfirmed) {
        handleApprove(id);
      }
    });
  };

  const handleRejectClick = (id, medicineName) => {
    Swal.fire({
      title: "Reject Request?",
      text: `Are you sure you want to reject the request for ${medicineName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, reject it!"
    }).then((result) => {
      if (result.isConfirmed) {
        handleReject(id);
      }
    });
  };

  const handleSendEmailClick = (id, recipientName) => {
    // Check if email has already been sent
    if (emailSentRequests.has(id)) {
      Swal.fire({
        title: "Already Sent",
        text: "Email has already been sent to this recipient.",
        icon: "info",
        confirmButtonColor: "#58869e",
      });
      return;
    }

    Swal.fire({
      title: "Send Email?",
      text: `Send donor contact information to ${recipientName}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#58869e",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, send email"
    }).then((result) => {
      if (result.isConfirmed) {
        sendEmail(id);
      }
    });
  };
  
  // OCR Function using server-side processing instead of client-side Tesseract.js
  const handleOCR = async () => {
    if (!selectedRequest?.prescriptionUrl) {
      Swal.fire({
        title: "Error!",
        text: "No prescription image found",
        icon: "error",
        confirmButtonColor: "#58869e",
      });
      return;
    }
    
    setOcrLoading(true);
    setOcrResult("");
    
    try {
      // First, check if the OCR service is running
      try {
        await axios.get('http://localhost:4000/testOCR');
        console.log('OCR service is running');
      } catch (serviceError) {
        console.error('OCR service test failed:', serviceError);
        throw new Error('OCR service is not available. Please try again later.');
      }
      
      // Get the image URL
      let imageUrl = selectedRequest.prescriptionUrl;
      console.log('Processing image URL:', imageUrl);
      
      // If the URL is relative, make sure it's properly formatted
      if (!imageUrl.startsWith('http')) {
        // Make sure it starts with a forward slash
        if (!imageUrl.startsWith('/')) {
          imageUrl = '/' + imageUrl;
        }
        console.log('Using relative image path:', imageUrl);
      }
      
      // Send image URL to backend for OCR processing
      const response = await axios.post('http://localhost:4000/processOCR', {
        imageUrl: imageUrl
      });
      
      if (response.data.success) {
        // If the OCR result is empty, show a specific message
        if (!response.data.text || response.data.text.trim() === '') {
          setOcrResult("No text was detected in the image. The image may be unclear or contain no readable text.");
          Swal.fire({
            title: "OCR Complete",
            text: "No text was detected in the image",
            icon: "info",
            confirmButtonColor: "#58869e",
          });
        } else {
          // Update OCR result with text from backend
          setOcrResult(response.data.text);
          
          // Show success message
          Swal.fire({
            title: "OCR Completed",
            text: "Text extracted successfully from prescription",
            icon: "success",
            confirmButtonColor: "#58869e",
          });
        }
      } else {
        throw new Error(response.data.error || "Failed to process image");
      }
    } catch (error) {
      console.error("OCR Error:", error);
      
      // Provide more detailed error message
      let errorMessage = "Error processing image. Please try again.";
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Server error response:', error.response.data);
        errorMessage = error.response.data.error || error.response.data.details || errorMessage;
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        errorMessage = "Server did not respond. Please check your connection.";
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Request error:', error.message);
        errorMessage = error.message || errorMessage;
      }
      
      setOcrResult(`Error: ${errorMessage}`);
      
      Swal.fire({
        title: "OCR Error!",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#58869e",
      });
    } finally {
      setOcrLoading(false);
    }
  };

  // Status chip based on status value
  const StatusChip = ({ status }) => {
    if (status === 'pending') {
      return <Chip label="Pending" color="warning" size="small" />;
    } else if (status === 'approved') {
      return <Chip label="Approved" color="success" size="small" />;
    } else if (status === 'rejected') {
      return <Chip label="Rejected" color="error" size="small" />;
    }
    return <Chip label={status} size="small" />;
  };

  return (
    <>
      <Typography
        gutterBottom
        variant="h5"
        component="div"
        sx={{ padding: "20px" }}
      >
        Medicine Requests
      </Typography>
      
      {loading ? (
        <LinearProgress />
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="medicine requests table">
              <TableHead>
                <TableRow>
                  <TableCell>Recipient Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Medicine Name</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : rows
                ).map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.city || 'Not specified'}</TableCell>
                    <TableCell>{row.medicineName}</TableCell>
                    <TableCell>{row.medicineQty}</TableCell>
                    <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <StatusChip status={row.status} />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton 
                            size="small" 
                            onClick={() => handleViewDetails(row)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        
                        {row.status === 'pending' && (
                          <>
                            <Tooltip title="Approve">
                              <IconButton 
                                size="small" 
                                color="success" 
                                onClick={() => handleApproveClick(row._id, row.medicineName, row.medicineQty)}
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject">
                              <IconButton 
                                size="small" 
                                color="error" 
                                onClick={() => handleRejectClick(row._id, row.medicineName)}
                              >
                                <CancelIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        
                        {row.status === 'approved' && (
                          <Tooltip title={emailSentRequests.has(row._id) ? "Email Already Sent" : "Send Email to Recipient"}>
                            <span>
                              <IconButton 
                                size="small" 
                                color={emailSentRequests.has(row._id) ? "success" : "primary"}
                                onClick={() => handleSendEmailClick(row._id, row.name)}
                                disabled={emailSentRequests.has(row._id)}
                              >
                                {emailSentRequests.has(row._id) ? <CheckCircleIcon /> : <EmailIcon />}
                              </IconButton>
                            </span>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No medicine requests found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
            <Typography variant="body2" sx={{ mr: 2, color: '#666', display: 'flex', alignItems: 'center' }}>
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
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
              labelRowsPerPage=""
            />
          </Box>
        </>
      )}

      {/* Details Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        {actionLoading && <LinearProgress />}
        <DialogTitle>Medicine Request Details</DialogTitle>
        <DialogContent dividers>
          {selectedRequest && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Request ID: {selectedRequest._id}</Typography>
                <StatusChip status={selectedRequest.status} />
              </Box>
              
              <Divider />
              
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2">Recipient Information</Typography>
                  <Typography><strong>Name:</strong> {selectedRequest.name}</Typography>
                  <Typography><strong>Email:</strong> {selectedRequest.email}</Typography>
                  <Typography><strong>Phone:</strong> {selectedRequest.phoneNumber}</Typography>
                  <Typography><strong>City:</strong> {selectedRequest.city || 'Not specified'}</Typography>
                  <Typography><strong>Address:</strong> {selectedRequest.address}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2">Medicine Information</Typography>
                  <Typography><strong>Medicine Name:</strong> {selectedRequest.medicineName}</Typography>
                  <Typography><strong>Quantity:</strong> {selectedRequest.medicineQty}</Typography>
                  <Typography><strong>Request Date:</strong> {new Date(selectedRequest.createdAt).toLocaleString()}</Typography>
                </Box>
              </Box>
              
              <Box>
                <Typography variant="subtitle2">Reason for Request</Typography>
                <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                  <Typography>{selectedRequest.reason || 'No reason provided'}</Typography>
                </Paper>
              </Box>
              
              {selectedRequest.prescriptionUrl && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2">Prescription</Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      disabled={ocrLoading}
                      onClick={handleOCR}
                      startIcon={ocrLoading ? <CircularProgress size={16} color="inherit" /> : <DocumentScannerIcon />}
                      sx={{ 
                        borderRadius: '8px',
                        textTransform: 'none',
                      }}
                    >
                      {ocrLoading ? "Processing..." : "Verify with OCR"}
                    </Button>
                  </Box>
                  
                  <Box sx={{ textAlign: 'center', mt: 1, position: 'relative' }}>
                    {!imageLoaded && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress size={24} />
                      </Box>
                    )}
                    <img 
                      src={selectedRequest.prescriptionUrl} 
                      alt="Prescription" 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '300px', 
                        border: '1px solid #ddd', 
                        borderRadius: '8px',
                        display: imageLoaded ? 'block' : 'none'
                      }}
                      onLoad={() => setImageLoaded(true)}
                      onError={(e) => {
                        console.error("Image failed to load:", e);
                        // Fallback to direct HTTP URL if the URL might be relative
                        if (!selectedRequest.prescriptionUrl.startsWith('http')) {
                          e.target.src = `http://localhost:4000${selectedRequest.prescriptionUrl}`;
                        }
                      }}
                    />
                  </Box>
                  
                  {ocrResult && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2">OCR Result</Typography>
                      <Paper 
                        sx={{ 
                          p: 2, 
                          bgcolor: '#f5f5f5',
                          borderLeft: '4px solid #58869e',
                          maxHeight: '200px',
                          overflow: 'auto'
                        }}
                      >
                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>{ocrResult}</Typography>
                      </Paper>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 