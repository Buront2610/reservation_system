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
  const [username, setUsername] = useState<string | null>(null);
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
    if(username !== null && auth !== null && password !== "") {
      const hashedPassword = hashPassword(password);
      try {
        await auth.loginUser(username, hashedPassword);
        navigate("/home");
      } catch (error: any) {
        setError(error);
      }
    } else {
      setError("IDとパスワードを入力してください。");
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
                    type="number"
                    label="userName"
                    placeholder="userName"
                    margin="normal"
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    fullWidth
                    id="password"
                    type="password"
                    label="Password"
                    placeholder="Password"
                    margin="normal"
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <div style={{ color: 'red' }}>{error}</div>}
                </div>
            </CardContent>
            <CardActions>
                <Button
                    variant="contained"
                    size="large"
                    color="secondary"
                    onClick={onClickLogin}
                >
                Login
                </Button>
            </CardActions>
        </Card>
    </Box>
  );
};

export default React.memo(Login);