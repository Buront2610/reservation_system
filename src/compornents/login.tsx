import React, { useState, ReactElement } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from './authContext';
import RenovationOverview from './renovationOverview';

interface LoginProps {}

const Login: React.FC<LoginProps> = (): ReactElement => {
  const [username, setUsername] = useState<string | null>("");  // Here, initial value changed to empty string
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const auth  = useAuth();

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
        const user = await auth.loginUser(username, password); // receive the user info
        if(user) { // check if user is not null
          console.log('foundUser', user);
          if(user.role === 'admin') {
            navigate("/lock");
          } else if(user.role === 'user') {
            navigate("/userReservation");
          } else {
            alert("ログインに失敗しました"); 
            throw new Error("Invalid role");
          }
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
        minHeight="100vh"
        padding={4}
        gap={4}
        flexWrap="wrap"
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
                  {error && (
                    <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                      {error}
                    </Typography>
                  )}
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
        <RenovationOverview />
    </Box>
  );
};

export default React.memo(Login);
