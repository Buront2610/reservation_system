import React, { useState , useEffect} from 'react';
import { Bento, Workplace } from './types';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Box, Grid, Tab, Tabs, Select,SelectChangeEvent, MenuItem} from '@mui/material';
import { DataGrid, GridEditCellProps } from '@mui/x-data-grid';
import { getBento, addBento, updateBento, deleteBento, getWorkplaces, addWorkplace, updateWorkplace, deleteWorkplace } from './API';
import Checkbox from '@mui/material/Checkbox';


export default function AdminBentoAndWorkplaceManagePage() {
    const [bento, setBento] = useState<Bento[]>([]);
    const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
    const [newBento, setNewBento] = useState<Partial<Bento>>({});
    const [newWorkplace, setNewWorkplace] = useState<Partial<Workplace>>({});
    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedFlag, setSelectedFlag] = useState<boolean | undefined>();
    
    const [selectedRow, setSelectedRow] = useState<Partial<Bento> | undefined>();

    const [selectedValue, setSelectedValue] = useState('false');




    useEffect(() => {
        loadInitialData();
    }, []);

    async function loadInitialData() {
        const bentoData = await getBento();
        setBento(bentoData);

        const workplaceData = await getWorkplaces();
        setWorkplaces(workplaceData);
    }

    const handleAddBento = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const createdBento = await addBento(newBento);
        setBento([...bento, createdBento]);
        setNewBento({});
    }

    const handleUpdateBento = async (id: number, updatedData: Partial<Bento>) => {
        const updatedBento = await updateBento(id, updatedData);
        setBento(bento.map(b => b.id === id ? updatedBento : b));
    }

    const handleDeleteBento = async (id: number) => {
        await deleteBento(id);
        setBento(bento.filter(b => b.id !== id));
    }

    const handleAddWorkplace = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const createdWorkplace = await addWorkplace(newWorkplace);
        setWorkplaces([...workplaces, createdWorkplace]);
        setNewWorkplace({});
    }

    const handleUpdateWorkplace = async (id: number, updatedData: Partial<Workplace>) => {
        const updatedWorkplace = await updateWorkplace(id, updatedData);
        setWorkplaces(workplaces.map(w => w.id === id ? updatedWorkplace : w));
    }

    const handleDeleteWorkplace = async (id: number) => {
        await deleteWorkplace(id);
        setWorkplaces(workplaces.filter(w => w.id !== id));
    }

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setSelectedTab(newValue);
        console.log(newValue);

    };
    const handleCheckboxChange = async (id: number, updatedFlag: boolean) => {
        const updatedData = await updateBento(id, { choose_flag: updatedFlag });
        setBento(bento.map(b => b.id === id ? updatedData : b));
    }
    

    const handleFlagChange = (event: SelectChangeEvent<string>, row:GridEditCellProps<Bento>) => {
        const updatedFlag = event.target.value === "true" ? true : false;
    
        if (row && row.id) {
            setSelectedRow({...row, choose_flag: updatedFlag});

            
            updateBento(row.id, row.choose_flag);
            // Update the bento array with the new flag value
            setBento(bento.map(b => b.id === row.id ? {...b, choose_flag: updatedFlag} : b));
            console.log(bento);
        }
    };
    
    

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Tabs value={selectedTab} onChange={handleChange}>
                    <Tab label="弁当" />
                    <Tab label="勤務場所" />
                </Tabs>
            </Grid>
            {selectedTab === 0 && (
                <Grid item xs={12}>
                    <h1>弁当管理ページ</h1>
                    <form onSubmit={handleAddBento}>
                        <Box mb={2}>
                            <TextField fullWidth label="弁当名" value={newBento.name || ''} onChange={e => setNewBento({ ...newBento, name: e.target.value })} />
                        </Box>
                        <Box mb={2}>
                            <TextField fullWidth label="価格" value={newBento.price || ''} onChange={e => setNewBento({ ...newBento, price: parseInt(e.target.value) })} />
                        </Box>
                        <Box mb={2}>
                            <div>注文される場合チェックを付けてください</div>
                            <Checkbox
                                checked={newBento.choose_flag || false}
                                onChange={e => setNewBento({ ...newBento, choose_flag: e.target.checked })}
                            />
                        </Box>
                        <Box mb={2}>
                            <Button type="submit" variant="contained" color="primary">登録</Button>
                        </Box>
                    </form>

                    <DataGrid
                        editMode="row"
                        rows={bento}
                        columns={[
                            { field: 'id', headerName: 'ID', width: 70 },
                            { field: 'name', headerName: '弁当名', width: 150, editable: true },
                            { field: 'price', headerName: '価格', width: 100, editable: true },
                            { 
                                field: 'choose_flag', 
                                headerName: '選択フラグ', 
                                width: 150, 
                                renderCell: (params) => (
                                    <Checkbox
                                        checked={params.row.choose_flag}
                                        onChange={e => handleCheckboxChange(params.row.id, e.target.checked)}
                                    />
                                ),
                            },
                            {
                            field: 'action',
                            headerName: '操作',
                            width: 150,
                            renderCell: (params) => (
                                <Button onClick={() => handleDeleteBento(params.row.id)}>削除</Button>
                            ),
                            },
                            {
                            field: 'update',
                            headerName: '更新',
                            width: 150,
                            renderCell: (params) => (
                                <Button onClick={() => handleUpdateBento(params.row.id, params.row)}>更新</Button>
                            ),
                            }
                        ]}
                        />
                </Grid>
            )}
            {selectedTab === 1 && (
                <Grid item xs={12}>
                    <h1>勤務場所管理ページ</h1>
                    <form onSubmit={handleAddWorkplace}>
                        <Box mb={2}>
                            <TextField fullWidth label="勤務場所名" value={newWorkplace.name || ''} onChange={e => setNewWorkplace({ ...newWorkplace, name: e.target.value })} />
                        </Box>
                        <Box mb={2}>
                            <TextField fullWidth label="場所" value={newWorkplace.location || ''} onChange={e => setNewWorkplace({ ...newWorkplace, location: e.target.value })} />
                        </Box>
                        <Box mb={2}>
                            <Button type="submit" variant="contained" color="primary">登録</Button>
                        </Box>
                    </form>
                    <DataGrid
                        rows={workplaces}
                        columns={[
                            { field: 'id', headerName: 'ID', width: 70 },
                            { field: 'name', headerName: '勤務場所名', width: 150, editable: true },
                            { field: 'location', headerName: '場所', width: 200, editable: true },
                            {
                                field: 'action',
                                headerName: '削除ボタン',
                                width: 150,
                                renderCell: (params) => (
                                        <Button onClick={() => handleDeleteWorkplace(params.row.id)}>削除</Button>

                                ),
                            },
                            {
                                field: 'action2',
                                headerName: '更新ボタン',
                                width: 150,
                                renderCell: (params) => (
                                    <Button onClick={() => handleUpdateWorkplace(params.row.id, params.row)}>更新</Button>
                                ),
                            }
                        ]}
                    />
                </Grid>
            )}
        </Grid>
    );
}
