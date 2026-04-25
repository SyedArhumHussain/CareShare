import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { Box, useTheme, useMediaQuery } from '@mui/material';

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square={false} {...props} />
))(({ theme }) => ({
  borderRadius: 12,
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'}`,
  '&:not(:last-child)': {
    marginBottom: 16,
  },
  '&:before': {
    display: 'none',
  },
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={
      <ArrowForwardIosSharpIcon 
        sx={{ 
          fontSize: '0.9rem',
          color: '#58869e',
          transition: 'transform 0.3s ease'
        }} 
      />
    }
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
  flexDirection: 'row',
  padding: '12px 20px',
  '& .MuiAccordionSummary-expandIconWrapper': {
    transition: 'transform 0.3s ease',
  },
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(88, 134, 158, 0.05)',
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(3),
  borderTop: '1px solid rgba(0, 0, 0, 0.08)',
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.8)',
}));

export default function AccordionDash({ items = [] }) {
  const [expanded, setExpanded] = React.useState('panel1');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {items.map((item, index) => (
        <motion.div
          key={`panel${index + 1}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: index * 0.1,
            duration: 0.5,
            type: 'spring',
            stiffness: 100,
            damping: 15
          }}
        >
          <Accordion
            expanded={expanded === `panel${index + 1}`}
            onChange={handleChange(`panel${index + 1}`)}
            sx={{ 
              mb: 2,
              backgroundColor: expanded === `panel${index + 1}` ? 'rgba(88, 134, 158, 0.03)' : 'transparent',
            }}
          >
            <AccordionSummary
              aria-controls={`panel${index + 1}d-content`}
              id={`panel${index + 1}d-header`}
              sx={{ 
                '& .MuiAccordionSummary-content': { 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2 
                } 
              }}
            >
              {item.icon && (
                <Box
                  sx={{
                    color: '#58869e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(88, 134, 158, 0.1)',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                  }}
                >
                  {item.icon}
                </Box>
              )}
              <Box>
                <Typography 
                  variant={isMobile ? "subtitle1" : "h6"} 
                  sx={{ 
                    fontWeight: expanded === `panel${index + 1}` ? 600 : 500,
                    color: expanded === `panel${index + 1}` ? '#58869e' : '#333',
                    transition: 'color 0.3s ease'
                  }}
                >
                  {item.title}
                </Typography>
                {item.subtitle && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      mt: 0.5,
                      display: { xs: 'none', sm: 'block' }
                    }}
                  >
                    {item.subtitle}
                  </Typography>
                )}
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {typeof item.content === 'string' ? (
                  <Typography variant="body1" sx={{ color: '#637381', lineHeight: 1.6 }}>
                    {item.content}
                  </Typography>
                ) : (
                  item.content
                )}
              </motion.div>
            </AccordionDetails>
          </Accordion>
        </motion.div>
      ))}
    </Box>
  );
}