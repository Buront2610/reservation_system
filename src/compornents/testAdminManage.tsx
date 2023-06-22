import React, { useState , useEffect} from 'react';
import { User } from './types';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Box, Grid, Tab, Tabs } from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { getAllUsers, createUser, updateUser, deleteUser } from './API';

export default function TestAdminManage() {
   
    const [users, setUsers] = useState<User[]>([]);
    const [newEntry, setNewEntry] = useState<Partial<User>>({});
    const [selectedTab, setSelectedTab] = React.useState(0);

    useEffect(() => {
        loadInitialData();
    }, []);

    async function loadInitialData() {
        const users = await getAllUsers();
        setUsers(users);
    }

    const handleAddUser = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const createdUser = await createUser(newEntry);
        setUsers([...users, createdUser]);
        setNewEntry({});
    }

    const handleUpdateUser = async (id: number, updatedData: Partial<User>) => {
        const updatedUser = await updateUser(id, updatedData);
        setUsers(users.map(user => user.id === id ? updatedUser : user));
    }

    const handleDeleteUser = async (id: number) => {
        await deleteUser(id);
        setUsers(users.filter(user => user.id !== id));
    }

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setSelectedTab(newValue);
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Tabs value={selectedTab} onChange={handleChange}>
                    <Tab label="ユーザ登録" />
                    <Tab label="ユーザ一覧" />
                </Tabs>
            </Grid>
            {selectedTab === 0 && (
                <Grid item xs={12}>
                    <h1>ユーザ登録ページ</h1>
                    <form onSubmit={handleAddUser}>
                        <Box mb={2}>
                            <TextField fullWidth label="社員番号" value={newEntry.employee_number || ''} onChange={e => setNewEntry({ ...newEntry, employee_number: e.target.value })} />
                        </Box>
                        <Box mb={2}>
                            <TextField fullWidth label="パスワード" value={newEntry.password || ''} onChange={e => setNewEntry({ ...newEntry, password: e.target.value })} />
                        </Box>
                        <Box mb={2}>
                            <TextField fullWidth label="名前" value={newEntry.name || ''} onChange={e => setNewEntry({ ...newEntry, name: e.target.value })} />
                        </Box>
                        <Box mb={2}>
                            <TextField fullWidth label="メールアドレス" value={newEntry.email_address || ''} onChange={e => setNewEntry({ ...newEntry, email_address: e.target.value })} />
                        </Box>
                        <Box mb={2}>
                            <TextField fullWidth label="電話番号" value={newEntry.telephone || ''} onChange={e => setNewEntry({ ...newEntry, telephone: e.target.value })} />
                        </Box>
                        <Box mb={2}>
                            <TextField fullWidth label="職場ID" value={newEntry.workplace_id || ''} onChange={e => setNewEntry({ ...newEntry, workplace_id: parseInt(e.target.value) })} />
                        </Box>
                        <Box mb={2}>
                            <TextField fullWidth label="役割" value={newEntry.role || ''} onChange={e => setNewEntry({ ...newEntry, role: e.target.value })} />
                        </Box>
                        <Box mb={2}>
                            <Button type="submit" variant="contained" color="primary">登録</Button>
                        </Box>
                    </form>
                </Grid>
            )}
            {selectedTab === 1 && (
                <Grid item xs={12}>
                    <h1>ユーザ一覧ページ</h1>
                    <DataGrid
                        editMode='row'
                        rows={users}
                        columns={[
                            { field: 'id', headerName: 'ID', width: 70 },
                            { field: 'employee_number', headerName: '社員番号', width: 120, editable: true },
                            { field: 'name', headerName: '名前', width: 150, editable: true },
                            { field: 'email_address', headerName: 'メールアドレス', width: 200, editable: true },
                            { field: 'telephone', headerName: '電話番号', width: 150, editable: true },
                            { field: 'role', headerName: '役割', width: 100, editable: true },
                            { field: 'workplace_id', headerName: '職場ID', width: 100, editable: true },
                            {
                                field: 'action',
                                headerName: '操作',
                                width: 150,
                                renderCell: (params) => (
                                    <Button onClick={() => handleDeleteUser(params.row.id)}>削除</Button>
                                ),
                            },
   
                            {
                            field: 'update',
                            headerName: '更新',
                            width: 150,
                            renderCell: (params) => (
                                <Button onClick={() => handleUpdateUser(params.row.id, params.row)}>更新</Button>
                            ),
                            }
                        ]}
                        // onCellEditCommit={(params, event) => {
                        //     handleUpdateUser(params.id as number, {[params.field]: params.value});
                        // }}
                        // components={{
                        //     Toolbar: GridToolbarContainer,
                        // }}
                        // componentsProps={{
                        //     toolbar: {
                        //         children: [<GridToolbarExport />],
                        //     },
                        // }}
                    />
                </Grid>
            )}
        </Grid>
    );
}
