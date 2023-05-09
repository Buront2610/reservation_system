import React, {FC, Dispatch, SetStateAction} from 'react';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import { Box } from '@mui/material';
import ResponsiveDrawer from './ResponsiveDrawer'
import { Login } from './login'

interface setStateProps{

    setStateProp: object;
}


export default function RouterCompornent(props: setStateProps) {
    
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div>
                            <BrowserRouter>
                                <Routes>
                                    {/* ログイン用ページ */}
                                    <Route path="/" element={<Login/>} />
                                    {/* サイドメニュー */}
                                    <Route path="/reservation"element={<ResponsiveDrawer/>}>
                                        <Route path="/welcome"  element={<Table setStateProp={items} />} />
                                        <Route path="/element" element={<EnhancedTable />} />
                                        <Route path="/email" element={<SortTable/>} />
                                        <Route path="/dashboard" element={<Dashboard/>} />
                                        <Route path="/settings" element={<SettingPCS/>} />
                                    </Route>
                                </Routes>
                            </BrowserRouter>
                            {/* <DrawTable setStateProp ={items2} /> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
}