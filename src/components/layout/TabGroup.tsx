import Tab from '@mui/material/Tab';
import * as React from 'react';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Registration from './Registration';
import Login from './Login';
import Typography from '@mui/material/Typography';

function TabGroup() {
    const [value, setValue] = React.useState('1');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList
                        onChange={handleChange}
                        aria-label="lab API tabs example"
                        sx={{
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#14b8a6',
                                transition: 'all 0.3s ease',
                            },
                            '& .MuiTab-root': {
                                color: '#52635f',
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '1rem',
                                transition: 'color 0.3s ease',
                                '&:hover': {
                                    color: '#14b8a6',
                                    opacity: 0.85,
                                }
                            },
                            '& .MuiTab-root.Mui-selected': {
                                color: '#14b8a6',
                            }
                        }}
                    >
                        <Tab label={<Typography variant="h6">Register</Typography>} value="1" />
                        <Tab label={<Typography variant="h6">Login</Typography>} value="2" />
                    </TabList>
                </Box>
                <TabPanel value="1" ><Registration setValue={setValue} /></TabPanel>
                <TabPanel value="2"><Login setValue={setValue} /></TabPanel>
            </TabContext>
        </Box>
    );
}

export default TabGroup;
