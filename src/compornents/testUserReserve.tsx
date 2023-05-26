import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { Box, Button, Tab, Tabs, Paper, useTheme } from '@mui/material';
import ja from 'date-fns/locale/ja';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('ja', ja);

function TestReservationPage() {
    const theme = useTheme();
    const [hasReservation, setHasReservation] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const [currentTime, setCurrentTime] = useState<Date>(new Date());
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleMonthChange = (date: Date) => {
        setSelectedMonth(date);
        setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    };
    
    const handleReservationToggle = () => {
        setHasReservation(!hasReservation);
    };

    const handleDateChange = (date: Date | null) => {
        if(date) {
            const index = selectedDates.findIndex(d => d.getTime() === date.getTime());
            if (index === -1) {
                setSelectedDates(prevDates => [...prevDates, date]);
            } else {
                setSelectedDates(prevDates => prevDates.filter((_, i) => i !== index));
            }
        }
    };
    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setActiveTab(newValue);
    };

    const formatDate = (date: Date) => {
        return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const formatTime = (date: Date) => {
        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Paper sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '500px', width: '70%', padding: '2em', borderColor: '#ccc' }} elevation={3}>
                <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth" indicatorColor="primary" textColor="primary" sx={{ marginBottom: '2em', width: '100%', borderBottom: '1px solid #ccc' }}>
                    <Tab label="個別予約" sx={{ fontSize: '1.5em', color: activeTab === 0 ? theme.palette.primary.main : theme.palette.text.primary }} />
                    <Tab label="まとめて予約" sx={{ fontSize: '1.5em', color: activeTab === 1 ? theme.palette.primary.main : theme.palette.text.primary }} />
                </Tabs>
                <div style={{ visibility: activeTab === 0 ? 'visible' : 'hidden', height: activeTab === 0 ? 'auto' : '0' }}>
                    <Paper sx={{ fontSize: '1.5em', marginBottom: '2em', padding: '1em', backgroundColor: '#222', color: '#fff', textAlign: 'center' }}>
                        {formatDate(currentTime)}<br/>
                        {formatTime(currentTime)}
                    </Paper>
                    {hasReservation ? (
                        <Button variant="outlined" color="secondary" sx={{ fontSize: '1.5em' }} onClick={handleReservationToggle}>
                            予約キャンセル
                        </Button>
                    ) : (
                        <Button variant="contained" color="primary" sx={{ fontSize: '1.5em' }} onClick={handleReservationToggle}>
                            予約
                        </Button>
                    )}
                </div>
                <div style={{ display: activeTab === 1 ? 'flex' : 'none', flexDirection: 'column', alignItems: 'center', minHeight: '300px'}}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: '2em' }}>
                        <div style={{marginRight: "2em", width: '45%'}}>
                            <DatePicker
                                inline
                                selected={selectedMonth}
                                onChange={handleMonthChange}
                                dateFormat="yyyy-MMdif"
                                showMonthYearPicker
                                locale="ja"
                            />
                        </div>
                        <div style={{marginLeft: "2em", width: '45%'}}>
                            <DatePicker
                                inline
                                selected={currentMonth}
                                onChange={handleDateChange}
                                locale="ja"
                                filterDate={(date) => date.getMonth() === selectedMonth.getMonth()}
                                highlightDates={selectedDates}
                            />
                        </div>
                    </div>
                    <Button variant="contained" color="primary" sx={{ fontSize: '1.5em', alignSelf: 'center' }}>
                        まとめて予約
                    </Button>
                </div>
            </Paper>
        </Box>
    );
}

export default TestReservationPage;
