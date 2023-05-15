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

  const onClickLogin = async () => {
    if(username !== null) {
      const user = await loginUser(username, password);
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
