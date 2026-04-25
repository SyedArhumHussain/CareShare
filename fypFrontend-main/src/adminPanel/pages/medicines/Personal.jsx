import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { Card } from '@mui/material';
import { CardContent } from '@mui/material';
import {Stack} from '@mui/material';

export default function Personal() {
    return (
        <>
            <Box height={20} >
                
                <Grid container spacing={2}>
                    
                    <Grid item xs={8}>
                        
                        <Card sx={{ height: 60 + "vh" }}>
                            
                            <CardContent>
                                <Stack direction="row">
                                <Box
                                    component="form"
                                    sx={{
                                        '& > :not(style)': { m: 1, width: '33ch' },
                                    }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    <TextField id="outlined-basic" label="Name" variant="outlined" />
                                </Box>
                                <Box
                                    component="form"
                                    sx={{
                                        '& > :not(style)': { m: 1, width: '33ch' },
                                    }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    <TextField id="outlined-basic" label="Location" variant="outlined" />
                                </Box>
                                </Stack>
                                <Stack direction="row">
                                <Box
                                    component="form"
                                    sx={{
                                        '& > :not(style)': { m: 1, width: '33ch' },
                                    }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    <TextField id="outlined-basic" label="Phone No" variant="outlined" />
                                </Box>
                                <Box
                                    component="form"
                                    sx={{
                                        '& > :not(style)': { m: 1, width: '33ch' },
                                    }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    <TextField id="outlined-basic" label="Email" variant="outlined" />
                                </Box>
                                </Stack>
                                <Stack direction="row">
                                
                                <Box 
                                    component="form"
                                    sx={{
                                        '& > :not(style)': { m: 1, width: '68ch'}, 
                                        
                                    }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    <TextField id="outlined-basic" label="Email" variant="outlined" />
                                </Box>
                                </Stack>
                                <Stack direction="row">
                                
                                <Box 
                                    component="form"
                                    sx={{
                                        '& > :not(style)': { m: 1, width: '68ch'}, 
                                        
                                    }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    <TextField id="outlined-basic" label="Address" variant="outlined" />
                                </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={4}>
                        <Card sx={{ height: 60 + "vh" }}>
                            <CardContent>
                                <Box>
                                    
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

        </>
    );
}
