// 必要なパッケージと型をインポート
import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import ja from 'date-fns/locale/ja';
import 'react-datepicker/dist/react-datepicker.css';
import { Reservation, Bento, Employee } from './types';
import { getBento, addReservation, deleteReservation, getReservations, getEmployees } from './API';
import { Box, Button, Typography, Tab, Tabs } from '@mui/material';
import { useAuth } from './authContext';



// 日本語ロケールをDatePickerに登録
registerLocale('ja', ja);

// 予約ページの関数コンポーネント
function ReservationPage() {
    const { user } = useAuth(); // ログインユーザーの情報を取得
    // ユーザ情報が存在することを確認（ログインしているかどうか）
    if (!user) {
        throw new Error('User is not logged in.');
    }
    // 各種変数の定義
    const [bentoList, setBentoList] = useState<Bento[]>([]);
    const [employeeList, setEmployeeList] = useState<Employee[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [hasReservation, setHasReservation] = useState<boolean>(false);

    // 初回レンダリング時にデータをフェッチ
    useEffect(() => {
        getBento().then(bento => setBentoList(bento));
        getEmployees().then(employee => setEmployeeList(employee));
        getReservations().then(reservation => {
            setReservations(reservation);
            checkReservation(reservation);
        });
    }, []);

    // 'reservations'が変更されたときに予約を確認
    const checkReservation = (reservations: Reservation[]) => {
        const employeeReservation = reservations.find(
            reservation => reservation.employee_id === user.id && !reservation.is_delivered
        );
        setHasReservation(!!employeeReservation);
    };

    // 予約情報更新ハンドル
    const handleReservation = () => {
        const newReservation: Partial<Reservation> = {
            employee_id: user.id, // ログインユーザから取得
            reservation_date: new Date().toISOString().split('T')[0], // 今日の日付
            bento_id: bentoList[0].id, // デフォルトのベントウ
            quantity: 1, // デフォルトの数量
            is_delivered: false,
        };
        addReservation(newReservation).then(() => setHasReservation(true));
    };

    // 予約キャンセルハンドル
    const handleCancellation = () => {
        const reservationToCancel = reservations.find(
            reservation => reservation.employee_id === user.id && !reservation.is_delivered
        );
        if (reservationToCancel) {
            deleteReservation(reservationToCancel.id).then(() => setHasReservation(false));
        }
    };

    // タブの定義
    const [activeTab, setActiveTab] = useState(0);
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);

    // 日付選択ハンドル
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
    // 予約送信ハンドル
    const handleSubmit = async () => {
        const employeeId = user.id; // ログインユーザのidを使用
        const bentoId = bentoList[0].id; // デフォルトのベントウidを使用

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
    // UIのレンダリング
    return (
        <Box>
            <Tabs>
                <Tab label="個別予約" />
                <Tab label="まとめて予約" />
            </Tabs>
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
