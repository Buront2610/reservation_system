import React, { useState, useEffect } from 'react';
import DatePicker, {registerLocale} from 'react-datepicker';
import { Box, Button, Typography, Tab, Tabs } from '@mui/material';
import ja from 'date-fns/locale/ja';
import 'react-datepicker/dist/react-datepicker.css';

// 日本語ロケールをDatePickerに登録
registerLocale('ja', ja);

// 予約ページの関数コンポーネント
function TestReservationPage(){
    const hasReservation = false;  // ここではデフォルト値としてfalseを設定
    // タブの定義
    const [activeTab, setActiveTab] = useState(0);
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);

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

    // UIのレンダリング
    return (
        <Box>
            <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label="個別予約" />
                <Tab label="まとめて予約" />
            </Tabs>
            <div style={{ display: activeTab === 0 ? 'block' : 'none' }}>
                <Typography variant="h6">予約: お弁当の名前</Typography>  
                {hasReservation ? (
                    <Button variant="outlined" color="secondary">
                        予約キャンセル
                    </Button>
                ) : (
                    <Button variant="contained" color="primary">
                        予約
                    </Button>
                )}
            </div>
            <div style={{ display: activeTab === 1 ? 'block' : 'none' }}>
                <DatePicker
                    inline
                    selected={null}
                    locale="ja"
                    onChange={handleDateChange}
                    highlightDates={selectedDates}
                    startDate={new Date()}
                />
                <Button variant="contained" color="primary">
                    まとめて予約
                </Button>
            </div>
        </Box>
    );
}

export default TestReservationPage;

