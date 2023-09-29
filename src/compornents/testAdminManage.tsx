import React, { useState , useEffect, useRef, CSSProperties} from 'react';
import { User, Workplace } from './types';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Box, Grid, Tab, Tabs } from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { getAllUsers, createUser, updateUser, deleteUser, getWorkplaces, changeUserPassword } from './API';
import { Theme, useTheme } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import Select ,{SelectChangeEvent} from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { FormControl, OutlinedInput } from '@mui/material';

import {
    useCSVReader,
    lightenDarkenColor,
    formatFileSize,
} from 'react-papaparse';

import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './authContext';
import { useUserAuthenticationLogoutNavigate } from './useUserAuthLogoutNavigate';
// CSVReaderをインポート

const GREY = '#CCC';
const GREY_LIGHT = 'rgba(255, 255, 255, 0.4)';
const DEFAULT_REMOVE_HOVER_COLOR = '#A01919';
const REMOVE_HOVER_COLOR_LIGHT = lightenDarkenColor(
    DEFAULT_REMOVE_HOVER_COLOR,
    40
);
const GREY_DIM = '#686868';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
PaperProps: {
    style: {
    maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    width: 250,
    },
},
};



const styles = {
    zone: {
    alignItems: 'center',
    border: `2px dashed ${GREY}`,
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    padding: 20,
    } as CSSProperties,
    file: {
    background: 'linear-gradient(to bottom, #EEE, #DDD)',
    borderRadius: 20,
    display: 'flex',
    height: 120,
    width: 120,
    position: 'relative',
    zIndex: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    } as CSSProperties,
    info: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 10,
    paddingRight: 10,
    } as CSSProperties,
    size: {
    backgroundColor: GREY_LIGHT,
    borderRadius: 3,
    marginBottom: '0.5em',
    justifyContent: 'center',
    display: 'flex',
    } as CSSProperties,
    name: {
    backgroundColor: GREY_LIGHT,
    borderRadius: 3,
    fontSize: 12,
    marginBottom: '0.5em',
    } as CSSProperties,
    progressBar: {
    bottom: 14,
    position: 'absolute',
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
    } as CSSProperties,
    zoneHover: {
    borderColor: GREY_DIM,
    } as CSSProperties,
    default: {
    borderColor: GREY,
    } as CSSProperties,
    remove: {
    height: 23,
    position: 'absolute',
    right: 6,
    top: 6,
    width: 23,
    } as CSSProperties,
};

export default function TestAdminManage() {
    const theme = useTheme();
    const [users, setUsers] = useState<User[]>([]);
    const [newEntry, setNewEntry] = useState<Partial<User>>({});
    const [selectedTab, setSelectedTab] = React.useState(0);
    const [selectedUserId, setSelectedUserId] = React.useState("");
    const [newPassword, setNewPassword] = useState('');
    const [roles, setRoles] = React.useState('');
    const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
    const [workplace, setWorkplace] = useState(0);
    const [importing, setImporting] = useState(false);
    const { CSVReader } = useCSVReader();
    const [zoneHover, setZoneHover] = useState(false);
    const [removeHoverColor, setRemoveHoverColor] = useState(
        DEFAULT_REMOVE_HOVER_COLOR
    );

    useUserAuthenticationLogoutNavigate();
    const handleCSVImport = async (results: {data: string[][], errors: any[], meta: any[]}) => {
        setImporting(true);
        console.log('result:',results)
    
        for (let data of results.data) {
            let user = {
                employee_number: data[0],
                password: data[1],
                name: data[2],
                email_address: data[3],
                telephone: data[4],
                workplace_id: Number(data[5]), // convert string to number
                role: data[6],
            };
            console.log('user:',user)
    
            if (user.employee_number && user.password && user.name &&  user.role && user.workplace_id) {
                const existingUser = users.find(u => u.employee_number === user.employee_number);
                if (!existingUser) {
                    await createUser(user);
                } else {
                    await updateUser(existingUser.id, user);
                }
            }
            else{
                console.log('error')
            }
        }
    
        const updatedUsers = await getAllUsers();
        setUsers(updatedUsers);
        setImporting(false);
    };
    
    const handleChangeRole = (event: SelectChangeEvent) => {
        setRoles(event.target.value);
        setNewEntry ({...newEntry, role: event.target.value});
    };
    const handleChangeWorkplace = (event: SelectChangeEvent<string>) => {
        const newValue = parseInt(event.target.value);
        setWorkplace(newValue);  // This is a number now.
        setNewEntry({...newEntry, workplace_id: newValue});  // This value is also a number.
    };
    const rolesList =[
        'user',
        'admin',
        'guest',
    ]
    useEffect(() => {
        loadInitialData();
    }, []);

    async function loadInitialData() {
        const users = await getAllUsers();
        const workplaces = await getWorkplaces();
        setWorkplaces(workplaces);
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

    const handleChangePassword = async () => {
        if(selectedUserId !== null && newPassword !== ''){
            await changeUserPassword(selectedUserId, newPassword);
            setNewPassword('');
        }
    };

    const downloadTemplate = () => {
        const header = '社員番号,パスワード,名前,メールアドレス,電話番号,勤務場所ID,Role\n'; // CSVヘッダー
        const exampleRow = '123456,pass123,John Doe,johndoe@example.com,123-456-7890,1,user\n'; // 例となるデータ行
    
        // Blobを用いてテンプレートCSVを生成
        const blob = new Blob([header, exampleRow], { type: 'text/csv' });

        // ダウンロードのためのリンクを生成
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'user_template.csv';

        // リンクをDOMに追加し、プログラム的にクリック
        document.body.appendChild(a);
        a.click();

        // リソースのクリーンアップ
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };


    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Tabs value={selectedTab} onChange={handleChange}>
                    <Tab label="ユーザ登録" />
                    <Tab label="CSV登録" />
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
                            <FormControl sx={{ m: 1, minWidth: 80 }}>
                                <InputLabel id="demo-simple-select-workplace-label">職場</InputLabel>
                                <Select
                                    labelId="demo-simple-select-workplace-label"
                                    id="demo-simple-select-workplace"
                                    value={workplace.toString()}                                  
                                    onChange={handleChangeWorkplace}
                                    autoWidth
                                    label="職場ID"
                                >
                                    {workplaces.map((workplace) => (
                                        <MenuItem
                                            key={workplace.id}
                                            value={workplace.id}
                                        >
                                            {workplace.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box mb={2}>
                            <FormControl sx={{ m: 1, minWidth: 80 }}>
                                <InputLabel id="demo-simple-select-autowidth-label">Role</InputLabel>
                                <Select
                                labelId="demo-simple-select-autowidth-label"
                                id="demo-simple-select-autowidth"
                                value={roles}
                                onChange={handleChangeRole}
                                autoWidth
                                label="Role"
                                >
                                        {rolesList.map((role) => (
                                            <MenuItem
                                                key={role}
                                                value={role}
                                            >
                                                {role}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box mb={2}>
                            <Button type="submit" variant="contained" color="primary">登録</Button>
                        </Box>
                    </form>
                    
                </Grid>
            )}
            {selectedTab === 1 && (
                <Grid item xs={12}>
                    <h1>CSVユーザ登録</h1>
                    <p>CSVファイルは以下のデータ順序である必要があります：</p>
                    <ul>
                        <li>1. 社員番号</li>
                        <li>2. パスワード</li>
                        <li>3. 名前</li>
                        <li>4. メールアドレス</li>
                        <li>5. 電話番号</li>
                        <li>6. 職場ID（数値）</li>
                        <li>7. 役割</li>
                    </ul>
                    <p>この順序に従ったCSVファイルをアップロードしてください。</p>
                    <Button variant="contained" color="secondary" onClick={downloadTemplate}>CSVテンプレートをダウンロード</Button>                            
                    <CSVReader
                        onUploadAccepted={(results: any) => {
                            console.log('---------------------------');
                            console.log(results);
                            console.log('---------------------------');
                            setZoneHover(false);
                            handleCSVImport(results);
                        }}
                        onDragOver={(event: DragEvent) => {
                            event.preventDefault();
                            setZoneHover(true);
                        }}
                        onDragLeave={(event: DragEvent) => {
                            event.preventDefault();
                            setZoneHover(false);
                        }}
                        >
                        {({
                            getRootProps,
                            acceptedFile,
                            ProgressBar,
                            getRemoveFileProps,
                            Remove,
                        }: any) => (
                            <>
                            <div
                                {...getRootProps()}
                                style={Object.assign(
                                {},
                                styles.zone,
                                zoneHover && styles.zoneHover
                                )}
                            >
                                {acceptedFile ? (
                                <>
                                    <div style={styles.file}>
                                    <div style={styles.info}>
                                        <span style={styles.size}>
                                        {formatFileSize(acceptedFile.size)}
                                        </span>
                                        <span style={styles.name}>{acceptedFile.name}</span>
                                    </div>
                                    <div style={styles.progressBar}>
                                        <ProgressBar />
                                    </div>
                                    <div
                                        {...getRemoveFileProps()}
                                        style={styles.remove}
                                        onMouseOver={(event: Event) => {
                                        event.preventDefault();
                                        setRemoveHoverColor(REMOVE_HOVER_COLOR_LIGHT);
                                        }}
                                        onMouseOut={(event: Event) => {
                                        event.preventDefault();
                                        setRemoveHoverColor(DEFAULT_REMOVE_HOVER_COLOR);
                                        }}
                                    >
                                        <Remove color={removeHoverColor} />
                                    </div>
                                    </div>
                                </>
                                ) : (
                                'Drop CSV file here or click to upload'
                                )}
                            </div>
                            </>
                        )}
                    </CSVReader>
                </Grid> 
            )}
            {selectedTab === 2 && (
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

                    />
                {/* パスワード変更セクション */}
                <Box mb={3}>
                    <h2>パスワード変更</h2>
                    <FormControl fullWidth>
                        <InputLabel id="select-user-label">ユーザーを選択</InputLabel>
                        <Select
                            labelId="select-user-label"
                            value={selectedUserId || ""}
                            onChange={(event) => setSelectedUserId(String(event.target.value))}
                        >
                            {users.map(user => (
                                <MenuItem key={user.id} value={user.id}>
                                    {user.name || user.id}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={async () => {
                            if (!selectedUserId) {
                                alert('ユーザが選択されていません。');
                                return;
                            }

                            const selectedUser = users.find(user => String(user.id) === selectedUserId);
                            if (selectedUser) {
                                try {
                                    await changeUserPassword(selectedUserId, selectedUser.employee_number);
                                    alert('パスワードが正常に変更されました。');
                                } catch (error) {
                                    console.error('パスワードの変更に失敗しました。', error);
                                    alert('パスワードの変更に失敗しました。');
                                }
                            } else {
                                alert('選択されたユーザが存在しません。');
                            }
                        }}
                    >
                        パスワード変更
                    </Button>
                </Box>



                </Grid>
                
            )}
        </Grid>
    );
}
