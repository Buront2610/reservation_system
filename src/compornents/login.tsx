import React, { useState, ReactElement } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UseAuth } from './authContext';
import CryptoJS from 'crypto-js';

interface LoginProps {}

const SALT = 'your-unique-salt-here';

const hashPassword = (password: string): string => {
  const hashedPassword = CryptoJS.PBKDF2(password, SALT, {
    keySize: 256 / 32,
    iterations: 1000,
  }).toString(CryptoJS.enc.Hex);

  return hashedPassword;
}

const Login: React.FC<LoginProps> = (): ReactElement => {
  const [username, setUsername] = useState<string | null>("");  // Here, initial value changed to empty string
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const auth  = UseAuth();

  const cardStyle = {
    display: "block",
    transitionDuration: "0.3s",
    height: "450px",
    width: "400px",
    variant: "outlined",
  };

  const onClickLogin = async () => {
    if(username !== null && username !== "" && auth !== null && password !== "") {
      try {
        await auth.loginUser(username, password);
        console.log(auth)        
  
        if(auth.user?.role === 'admin') {
          navigate("/adminReservationEdit");
        } else if(auth.user?.role === 'user') {
          navigate("/userReservation");
        } else {
          throw new Error("Invalid role");
        }
        
      } catch (error: any) {
        setError(error.message);
        console.log(error);
      }
    } else {
      setError("IDとパスワードを入力してください。");
      alert("IDとパスワードを入力してください。");
    }
  };
  
  
  return (
    <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        padding={20}
    >
        <Card style={cardStyle}>
            <CardHeader title="お弁当予約システム" />
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
                    onClick={onClickLogin}
                >
                ログイン
                </Button>
            </CardActions>
        </Card>
    </Box>
  );
};

export default React.memo(Login);
