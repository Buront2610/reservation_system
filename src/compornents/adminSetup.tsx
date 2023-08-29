import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UseAuth } from './authContext';
import CryptoJS from 'crypto-js';
import { administratorSetup } from './API';
import { Box, Card, CardHeader, CardContent, CardActions, Button, TextField } from "@mui/material";



export default function AdminSetup() {

    const [username, setUsername] = useState<string | null>("");  // Here, initial value changed to empty string
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const auth  = UseAuth();

    const onClickSetupAdmin = async () => {
        if(username !== null && username !== "" && auth !== null && password !== "") {
            try {
                const user = await administratorSetup(username, password); // receive the user info
                if(user) { // check if user is not null
                    console.log('SetupFirstAdminstrator We welcome your return', user);
                    const set = await auth.loginUser(username, password);
                    if(set) {
                        navigate("/lock");
                    }
                }
            } catch (error: any) {
                setError(error.message);
                console.log(error);
            }
        }
    const cardStyle = {
        display: "block",
        transitionDuration: "0.3s",
        height: "450px",
        width: "400px",
        variant: "outlined",
    };

  return (
    <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        padding={20}
    >
        <Card style={cardStyle}>
            <CardHeader title="初期管理者登録フォーム" />
            <CardContent>
                <div>
                <TextField
                    fullWidth
                    id="username"
                    type="string"
                    label="社員番号"
                    placeholder="社員番号"
                    margin="normal"
                    onChange={(e) => {
                        const newVal = e.target.value;
                        setUsername(newVal);
                    }} 
                />
                <TextField
                    fullWidth
                    id="password"
                    type="password"
                    label="Password"
                    placeholder="Password"
                    margin="normal"
                    onChange={(e) => {
                        const newVal = e.target.value;
                        setPassword(newVal);
                    }}                />
                </div>
            </CardContent>
            <CardActions>
                <Button
                    variant="contained"
                    size="large"
                    color="secondary"
                    onClick={onClickSetupAdmin}
                >
                管理者登録
                </Button>
            </CardActions>
        </Card>
    </Box>
  );
}}
