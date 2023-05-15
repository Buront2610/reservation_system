import React, { createContext, useContext, useState } from "react";
import { login } from "./API";
import { Login } from "./types";

export async function loginUser(username: number, password: string): Promise<Login | null> {
    const users = await login();
    const user = users.find((user) => user.id === username && user.passWord === password);
    return user || null;
  }
  