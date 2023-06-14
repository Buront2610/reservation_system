import React, { useState } from 'react';
import { AppBar, Box, Tab, Tabs, Toolbar } from '@mui/material';
import AdminReserveWorkplacePage from './testAdminReserveStats';
import TestAdminOrderSummaryPage from './testAdminReserveStatus'

export default function AdminPage() {
    const [tabValue, setTabValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Tabs value={tabValue} onChange={handleChange} centered>
                        <Tab label="予約状況" />
                        <Tab label="注文概要" />
                    </Tabs>
                </Toolbar>
            </AppBar>
            <Box pt={2}>
                {tabValue === 0 && <AdminReserveWorkplacePage />}
                {tabValue === 1 && <TestAdminOrderSummaryPage />}
            </Box>
        </Box>
    );
}

