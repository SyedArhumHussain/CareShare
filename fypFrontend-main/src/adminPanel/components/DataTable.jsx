import React, { useState } from 'react';
import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TablePagination, 
  TableFooter,
  Box,
  IconButton,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  Tooltip,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Card,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Divider,
  Avatar
} from '@mui/material';

import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import GetAppIcon from '@mui/icons-material/GetApp';
import PrintIcon from '@mui/icons-material/Print';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SortIcon from '@mui/icons-material/Sort';
import { motion, AnimatePresence } from 'framer-motion';

function TablePaginationActions(props) {
  const { count, page, rowsPerPage, onPageChange } = props;
  const theme = useTheme();

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
    <Box sx={{ flexShrink: 0, ml: 2.5, display: 'flex', alignItems: 'center' }}>
      <Typography variant="body2" sx={{ mr: 2, color: 'text.secondary' }}>
        Page {page + 1} of {Math.max(1, Math.ceil(count / rowsPerPage))}
      </Typography>
      <Box 
        sx={{ 
          display: 'flex', 
          borderRadius: 1, 
          overflow: 'hidden',
          border: '1px solid rgba(0, 0, 0, 0.12)'
        }}
      >
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
          size="small"
          sx={{ 
            color: theme.palette.mode === 'light' ? '#58869e' : '#fff',
            borderRadius: 0,
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
            borderRadius: 0,
            borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
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
            borderRadius: 0,
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
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
            borderRadius: 0,
            '&.Mui-disabled': {
              color: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.26)' : 'rgba(255, 255, 255, 0.3)'
            }
          }}
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
    </Box>
  );
}

const DataTable = ({ 
  columns = [], 
  data = [], 
  title = "Data", 
  loading = false,
  onRefresh = null,
  onDelete = null,
  onEdit = null,
  onView = null,
  showActions = true,
  emptyMessage = "No data available"
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  React.useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredData(data);
    } else {
      const lowercasedFilter = searchTerm.toLowerCase();
      const filtered = data.filter(item => {
        return Object.keys(item).some(key => {
          const value = item[key];
          return value && value.toString().toLowerCase().includes(lowercasedFilter);
        });
      });
      setFilteredData(filtered);
    }
    setPage(0);
  }, [data, searchTerm]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenActionMenu = (event, row) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedRow(row);
  };

  const handleCloseActionMenu = () => {
    setActionMenuAnchor(null);
  };

  const handleAction = (action) => {
    if (!selectedRow) return;
    
    if (action === 'view' && onView) {
      onView(selectedRow);
    } else if (action === 'edit' && onEdit) {
      onEdit(selectedRow);
    } else if (action === 'delete' && onDelete) {
      onDelete(selectedRow);
    }
    
    handleCloseActionMenu();
  };

  const handleOpenFilterMenu = (event) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleCloseFilterMenu = () => {
    setFilterMenuAnchor(null);
  };

  // Display columns based on screen size
  const displayColumns = columns.filter(column => {
    if (isMobile && column.hideOnMobile) return false;
    if (isTablet && column.hideOnTablet) return false;
    return true;
  });

  const tableContainerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 80,
        damping: 15 
      } 
    }
  };

  const headerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };

  const renderTableRows = () => {
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredData.length) : 0;
    
    if (loading) {
      return Array.from(new Array(rowsPerPage)).map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          {displayColumns.map((column, idx) => (
            <TableCell key={`skeleton-cell-${idx}`}>
              <Skeleton animation="wave" width="100%" height={24} />
            </TableCell>
          ))}
          {showActions && (
            <TableCell align="right">
              <Skeleton animation="wave" width={30} height={30} variant="circular" />
            </TableCell>
          )}
        </TableRow>
      ));
    }

    if (filteredData.length === 0) {
      return (
        <TableRow>
          <TableCell 
            colSpan={displayColumns.length + (showActions ? 1 : 0)} 
            align="center"
            sx={{ py: 6 }}
          >
            <Typography variant="body1" color="text.secondary">
              {emptyMessage}
            </Typography>
            {onRefresh && (
              <Button 
                startIcon={<RefreshIcon />} 
                onClick={onRefresh}
                size="small"
                sx={{ 
                  mt: 2, 
                  color: '#58869e',
                  '&:hover': {
                    backgroundColor: 'rgba(88, 134, 158, 0.08)'
                  }
                }}
              >
                Refresh Data
              </Button>
            )}
          </TableCell>
        </TableRow>
      );
    }

    return (
      <>
        {(rowsPerPage > 0
          ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          : filteredData
        ).map((row, index) => (
          <motion.tr
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.05,
              ease: "easeInOut"
            }}
            component={TableRow}
            hover
            sx={{ 
              cursor: 'pointer',
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
              '&:last-child td, &:last-child th': { border: 0 },
              transition: 'background-color 0.2s ease' 
            }}
          >
            {displayColumns.map((column, columnIndex) => {
              const value = row[column.field];
              return (
                <TableCell 
                  key={columnIndex}
                  align={column.align || 'left'}
                  sx={{ 
                    py: 1.5,
                    ...(column.sx || {}),
                    whiteSpace: column.wrap ? 'normal' : 'nowrap',
                    maxWidth: column.maxWidth || 'none',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {column.renderCell 
                    ? column.renderCell(row) 
                    : column.format 
                      ? column.format(value) 
                      : value}
                </TableCell>
              );
            })}
            
            {showActions && (
              <TableCell align="right">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenActionMenu(e, row);
                  }}
                  sx={{ 
                    color: '#58869e',
                    '&:hover': {
                      backgroundColor: 'rgba(88, 134, 158, 0.1)',
                    },
                  }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </TableCell>
            )}
          </motion.tr>
        ))}
        
        {emptyRows > 0 && (
          <TableRow style={{ height: 53 * emptyRows }}>
            <TableCell colSpan={displayColumns.length + (showActions ? 1 : 0)} />
          </TableRow>
        )}
      </>
    );
  };

  const actionMenu = (
    <Menu
      anchorEl={actionMenuAnchor}
      open={Boolean(actionMenuAnchor)}
      onClose={handleCloseActionMenu}
      onClick={handleCloseActionMenu}
      PaperProps={{
        elevation: 3,
        sx: {
          minWidth: 180,
          mt: 1.5,
          overflow: 'visible',
          borderRadius: 2,
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
    >
      {onView && (
        <MenuItem
          onClick={() => handleAction('view')}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon>
            <VisibilityIcon fontSize="small" sx={{ color: '#58869e' }} />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
      )}
      
      {onEdit && (
        <MenuItem
          onClick={() => handleAction('edit')}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" sx={{ color: '#58869e' }} />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
      )}
      
      <MenuItem sx={{ py: 1.5 }}>
        <ListItemIcon>
          <PrintIcon fontSize="small" sx={{ color: '#58869e' }} />
        </ListItemIcon>
        <ListItemText>Print</ListItemText>
      </MenuItem>
      
      <Divider />
      
      {onDelete && (
        <MenuItem
          onClick={() => handleAction('delete')}
          sx={{ 
            py: 1.5,
            color: theme.palette.error.main
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: theme.palette.error.main }} />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      )}
    </Menu>
  );

  const filterMenu = (
    <Menu
      anchorEl={filterMenuAnchor}
      open={Boolean(filterMenuAnchor)}
      onClose={handleCloseFilterMenu}
      PaperProps={{
        elevation: 3,
        sx: {
          minWidth: 180,
          mt: 1.5,
          overflow: 'visible',
          borderRadius: 2,
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
    >
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
          Filter Options
        </Typography>
        <TextField
          size="small"
          fullWidth
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Divider />
      <MenuItem onClick={handleCloseFilterMenu} sx={{ py: 1.5 }}>
        <ListItemIcon>
          <SortIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Sort A-Z</ListItemText>
      </MenuItem>
      <MenuItem onClick={handleCloseFilterMenu} sx={{ py: 1.5 }}>
        <ListItemIcon>
          <SortIcon fontSize="small" sx={{ transform: 'scaleY(-1)' }} />
        </ListItemIcon>
        <ListItemText>Sort Z-A</ListItemText>
      </MenuItem>
    </Menu>
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={tableContainerVariants}
    >
      <Card
        elevation={0}
        sx={{ 
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <motion.div variants={headerVariants}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              p: { xs: 2, sm: 3 },
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
              gap: 2
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom={false}>
                {title}
              </Typography>
              {filteredData.length > 0 && (
                <Typography variant="body2" color="text.secondary">
                  Showing {Math.min(filteredData.length, rowsPerPage)} of {filteredData.length} entries
                </Typography>
              )}
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {!isMobile && (
                <TextField
                  size="small"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ 
                    width: { xs: '100%', sm: 200 },
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.1)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#58869e',
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              
              <Tooltip title="Filter">
                <IconButton 
                  onClick={handleOpenFilterMenu}
                  size="small"
                  sx={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.08)',
                    },
                  }}
                >
                  <FilterListIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              
              {onRefresh && (
                <Tooltip title="Refresh">
                  <IconButton 
                    onClick={onRefresh}
                    size="small"
                    sx={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.08)',
                      },
                    }}
                  >
                    <RefreshIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              
              <Tooltip title="Download">
                <IconButton 
                  size="small"
                  sx={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.08)',
                    },
                  }}
                >
                  <GetAppIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </motion.div>
        
        <TableContainer 
          sx={{ 
            flexGrow: 1,
            position: 'relative',
            minHeight: 200
          }}
        >
          <Table stickyHeader size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow>
                {displayColumns.map((column, index) => (
                  <TableCell
                    key={index}
                    align={column.align || 'left'}
                    sx={{ 
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      backgroundColor: '#f8f9fa',
                      color: '#637381',
                      py: 2
                    }}
                  >
                    {column.headerName}
                  </TableCell>
                ))}
                {showActions && (
                  <TableCell 
                    align="right"
                    sx={{ 
                      fontWeight: 600,
                      backgroundColor: '#f8f9fa',
                      color: '#637381',
                      whiteSpace: 'nowrap',
                      py: 2
                    }}
                  >
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {renderTableRows()}
            </TableBody>
          </Table>

          {loading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                zIndex: 1,
              }}
            >
              <CircularProgress size={40} sx={{ color: '#58869e' }} />
            </Box>
          )}
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
          labelRowsPerPage="Rows per page:"
          sx={{ 
            borderTop: '1px solid rgba(0, 0, 0, 0.08)',
            '.MuiTablePagination-toolbar': {
              padding: { xs: '0 16px', sm: '0 24px' },
            },
            '.MuiTablePagination-selectLabel, .MuiTablePagination-select, .MuiTablePagination-selectIcon': {
              color: 'text.secondary',
              display: 'flex',
            },
          }}
        />
      </Card>
      
      {actionMenu}
      {filterMenu}
    </motion.div>
  );
};

export default DataTable;