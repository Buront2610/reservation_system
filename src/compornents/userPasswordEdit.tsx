import React, { useState, useEffect } from "react";
import { changeUserPassword } from './API';
import { Button, TextField } from "@mui/material";
import { useAuth } from './authContext';
import { useNavigate } from 'react-router-dom'; // この行を追加

export default function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [userId, setUserId] = useState("");
    const [passwordMismatch, setPasswordMismatch] = useState(false);

    const { user } = useAuth();
    const navigate = useNavigate(); 

    useEffect(() => {
        if (user && user.id) {
            setUserId(user.id);
        }
    }, [user]);
    const onClickChangePassword = async () => {
        if(userId !== "" && currentPassword !== "" && newPassword !== "" && newPassword === confirmNewPassword) {
            try {
                await changeUserPassword(userId, newPassword);
                alert('パスワードが変更されました。');
                navigate('/userReservation');
            } catch (error) {
                console.error('パスワード変更に失敗しました。', error);
                if (error instanceof Error) {
                    // error オブジェクトが Error インスタンスの場合、メッセージにアクセスできます
                    alert('パスワード変更に失敗しました。エラー: ' + error.message);
                } else {
                    // それ以外の場合、一般的なエラーメッセージを表示します
                    alert('パスワード変更に失敗しました。');
                }
            }
            
        } else if(newPassword !== confirmNewPassword) {
            setPasswordMismatch(true);
            alert('新しいパスワードと確認用パスワードが一致しません。');
        } else {
            alert('全ての必須フィールドを正しく入力してください。');
        }
    }
    
    return (
        <div>
            <TextField
                fullWidth
                id="currentPassword"
                type="password"
                label="現在のパスワードを入力してください"
                placeholder="Current Password"
                margin="normal"
                onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <TextField
                fullWidth
                id="newPassword"
                type="password"
                label="新しいパスワードを入力してください"
                placeholder="New Password"
                margin="normal"
                onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (e.target.value.length === confirmNewPassword.length) {
                        setPasswordMismatch(e.target.value !== confirmNewPassword);
                    }
                }}
            />
            <TextField
                fullWidth
                id="confirmNewPassword"
                type="password"
                label="再度新しいパスワードを入力してください"
                placeholder="Confirm New Password"
                margin="normal"
                error={passwordMismatch}
                helperText={passwordMismatch ? "パスワードが一致していません" : ""}
                onChange={(e) => {
                    setConfirmNewPassword(e.target.value);
                    if (e.target.value.length === newPassword.length) {
                        setPasswordMismatch(e.target.value !== newPassword);
                    }
                }}
            />
            <Button
                variant="contained"
                size="large"
                color="primary"
                onClick={onClickChangePassword}
            >
                パスワード変更
            </Button>
        </div>
    );
}
