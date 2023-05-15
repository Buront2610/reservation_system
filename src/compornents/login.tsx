import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
} from "@mui/material";
import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "./types";
import { loginUser } from './authContext';
import CryptoJS from 'crypto-js';

export const Login = memo(() => {
  const [username, setUsername] = useState<number | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const cardStyle = {
    display: "block",
    transitionDuration: "0.3s",
    height: "450px",
    width: "400px",
    variant: "outlined",
  };

  const SALT = 'your-unique-salt-here';

  const hashPassword = (password: string): string => {
    const hashedPassword = CryptoJS.PBKDF2(password, SALT, {
      keySize: 256 / 32,
      iterations: 1000,
    }).toString(CryptoJS.enc.Hex);

    return hashedPassword;
  }

  const onClickLogin = async () => {
    if(username !== null) {
      const hashedPassword = hashPassword(password);
      const user = await loginUser(username, hashedPassword);
      if (user) {
        navigate("/home");
      } else {
        setError("ユーザ名またはパスワードが違います。");
      }
    } else {
      setError("ユーザ名を入力してください。");
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
              <CardHeader title="ログインページ" />
              <CardContent>
                  <div>
                  <TextField
                      fullWidth
                      id="username"
                      type="number"
                      label="userName"
                      placeholder="userName"
                      margin="normal"
                      onChange={(e) => setUsername(parseInt(e.target.value))}
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
});
