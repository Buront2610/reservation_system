import React, { useState } from "react";
import { changeUserPassword } from './API';
import { Button, TextField } from "@mui/material";

export default function ChangePassword() {
    const [newPassword, setNewPassword] = useState("");
    const [userId, setUserId] = useState<number | null>(null); // ユーザーが自分のIDを入力するためのstate

    const onClickChangePassword = async () => {
        if(userId !== null && newPassword !== "") {
            try {
                const result = await changeUserPassword(userId, newPassword);
                console.log('Password changed', result);
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <div>
            <TextField
                fullWidth
                id="userId"
                type="number"
                label="User ID"
                placeholder="User ID"
                margin="normal"
                onChange={(e) => setUserId(Number(e.target.value))}
            />
            <TextField
                fullWidth
                id="newPassword"
                type="password"
                label="New Password"
                placeholder="New Password"
                margin="normal"
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button
                variant="contained"
                size="large"
                color="primary"
                onClick={onClickChangePassword}
            >
                Change Password
            </Button>
        </div>
    );
}
