import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import ja from 'date-fns/locale/ja';
import 'react-datepicker/dist/react-datepicker.css';
import { Reservation, Bento, Employee } from './types';
import { getBento, addReservation, deleteReservation, getReservations, getEmployees } from './api';
import { Box, Button, Typography, Tab, Tabs } from '@mui/material';

registerLocale('ja', ja);

// 予約ページ
//個別の予約とまとめて予約の両方を実装する
//個別予約とまとめて予約はタブで切り替える
//個別予約は予約済みの場合はキャンセルボタンを表示する
//呼び出し時にIDを渡すようにする？
function ReservationPage() {
    //各種変数の定義
    const [bentoList, setBentoList] = useState<Bento[]>([]);
    const [employeeList, setEmployeeList] = useState<Employee[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [hasReservation, setHasReservation] = useState<boolean>(false);

    useEffect(() => {
        getBento().then(bento => setBentoList(bento));
        getEmployees().then(employee => setEmployeeList(employee));
        getReservations().then(reservation => {
            setReservations(reservation);
            checkReservation(reservation);
        });
    }, []);

    const checkReservation = (reservations: Reservation[]) => {
        const employeeReservation = reservations.find(
            reservation => reservation.employee_id === employeeList[0].id && !reservation.is_delivered
        );
        setHasReservation(!!employeeReservation);
    };
    //予約情報更新ハンドル
    const handleReservation = () => {
        const newReservation: Partial<Reservation> = {
            employee_id: employeeList[0].id, // This should be obtained from logged in user
            reservation_date: new Date().toISOString().split('T')[0], // Today's date
            bento_id: bentoList[0].id, // Default Bento
            quantity: 1, // Default quantity
            is_delivered: false,
        };
        addReservation(newReservation).then(() => setHasReservation(true));
    };
    //予約キャンセルハンドル
    const handleCancellation = () => {
        const reservationToCancel = reservations.find(
            reservation => reservation.employee_id === employeeList[0].id && !reservation.is_delivered
        );
        if (reservationToCancel) {
            deleteReservation(reservationToCancel.id).then(() => setHasReservation(false));
        }
    };

    //タブの定義
    const [activeTab, setActiveTab] = useState(0);
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);

    //日付選択ハンドル
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

    //予約送信ハンドル※改修予定
    const handleSubmit = async () => {
        const employeeId = 1; // 適切な値に置き換えてください
        const bentoId = 1; // 適切な値に置き換えてください

        try {
            await Promise.all(
                selectedDates.map(async date => {
                    await addReservation({
                        employee_id: employeeId,
                        reservation_date: date.toISOString().split('T')[0],
                        bento_id: bentoId,
                        quantity: 1,
                        is_delivered: false
                    });
                })
            );

            setSelectedDates([]);
            alert('予約が完了しました');
        } catch (error) {
            console.error(error);
            alert('予約に失敗しました');
        }
    };

    return (
        <Box>
            <Tabs>
                <Tab label="個別予約" />
                <Tab label="まとめて予約" />
            </Tabs>
            {/* Wrap each tab content in a div and toggle visibility based on the active tab */}
            <div style={{ display: activeTab === 0 ? 'block' : 'none' }}>
            <Typography variant="h6">予約: {bentoList[0]?.name}</Typography>
              {hasReservation ? (
                  <Button onClick={handleCancellation} variant="outlined" color="secondary">
                      予約キャンセル
                  </Button>
              ) : (
                  <Button onClick={handleReservation} variant="contained" color="primary">
                      予約
                  </Button>
              )}
            </div>
            <div style={{ display: activeTab === 1 ? 'block' : 'none' }}>
                <DatePicker
                    inline
                    selected={null}
                    onChange={handleDateChange}
                    locale="ja"
                    highlightDates={selectedDates}
                    startDate={new Date()}
                />
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    まとめて予約
                </Button>
            </div>

        </Box>
    );
}

export default ReservationPage;
