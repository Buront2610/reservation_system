import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { Box, Button, Typography, Tab, Tabs, Paper, useTheme } from '@mui/material';
import ja from 'date-fns/locale/ja';
import 'react-datepicker/dist/react-datepicker.css';

// 日本語ロケールをDatePickerに登録
registerLocale('ja', ja);

function TestReservationPage() {
    const theme = useTheme();
    const hasReservation = true;
    const [activeTab, setActiveTab] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const [currentTime, setCurrentTime] = useState<Date>(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleDateChange = (date: Date) => {
        const index = selectedDates.findIndex(d => d.toISOString().split('T')[0] === date.toISOString().split('T')[0]);
        if (index !== -1) {
            const newSelectedDates = [...selectedDates];
            newSelectedDates.splice(index, 1);
            setSelectedDates(newSelectedDates);
        } else {
            setSelectedDates([...selectedDates, date]);
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
                <Tabs value={activeTab} onChange={handleTabChange} sx={{ marginBottom: '2em', width: '100%', borderBottom: '1px solid #ccc' }}>
                    <Tab label="個別予約" sx={{ fontSize: '1.5em', color: activeTab === 0 ? theme.palette.primary.main : theme.palette.text.primary }} />
                    <Tab label="まとめて予約" sx={{ fontSize: '1.5em', color: activeTab === 1 ? theme.palette.primary.main : theme.palette.text.primary }} />
                </Tabs>
                <div style={{ visibility: activeTab === 0 ? 'visible' : 'hidden', height: activeTab === 0 ? 'auto' : '0' }}>
                    <Paper sx={{ fontSize: '1.5em', marginBottom: '2em', padding: '1em', backgroundColor: '#222', color: '#fff', textAlign: 'center' }}>
                        {formatDate(currentTime)}<br/>
                        {formatTime(currentTime)}
                    </Paper>
                    {hasReservation ? (
                        <Button variant="outlined" color="secondary" sx={{ fontSize: '1.5em' }}>
                            予約キャンセル
                        </Button>
                    ) : (
                        <Button variant="contained" color="primary" sx={{ fontSize: '1.5em' }}>
                            予約
                        </Button>
                    )}
                </div>
                <div style={{ visibility: activeTab === 1 ? 'visible' : 'hidden', height: activeTab === 1 ? 'auto' : '0' }}>
                    <DatePicker
                        inline
                        selected={selectedMonth}
                        onChange={(date: Date) => setSelectedMonth(date)}
                        dateFormat="MM/yyyy"
                        showMonthYearPicker
                        locale="ja"
                    />
                    <DatePicker
                        inline
                        selected={null}
                        locale="ja"
                        onChange={handleDateChange}
                        highlightDates={selectedDates}
                        startDate={selectedMonth}
                        filterDate={(date: Date) => {
                            return date.getMonth() === selectedMonth.getMonth();
                        }}
                    />
                    <Button variant="contained" color="primary" sx={{ fontSize: '1.5em', marginTop: '2em' }}>
                        まとめて予約
                    </Button>
                </div>
            </Paper>
        </Box>
    );
}

export default TestReservationPage;
