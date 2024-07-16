"use client"
import React, { useEffect, useState } from 'react';
import { Container, Table, TableBody, TableCell, TableHead, TableRow, Switch } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import { Edit } from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AuthService from "@/services/AuthService";
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Checkbox from '@mui/material/Checkbox';

export default function Users() {
    const router = useRouter();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            router.push('/login');
        } else if (user?.roles?.includes('admin')) {
            fetchUsers();
        } else if (user?.roles?.includes('user')) {
            router.push('/users'); // redirigir a página pública si es un usuario normal
        }
    }, []);

    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        const data = await AuthService.getFilteredUsers(token, filterActive, userFilter);
        if (data.length === 0) alert('No se han encontrado coincidencias.');
        setUsers(data);
    };

    const handleEdit = (user) => {
        router.push('/users/' + user.id + '/edit');
    };

    const [dateRestrictions, setDateRestrictions] = useState({
        range1: {
            startDate: dayjs('2001-01-01'),
            endDate: dayjs('2100-12-31'),
        },
        range2: {
            startDate: dayjs('2002-01-01'),
            endDate: dayjs('2101-12-31'),
        },
    });

    const [userFilter, setUserFilter] = useState({
        name: '',
        login_before_date: null,
        login_after_date: null,
        status: true,
    });

    const [filterActive, setFilterActive] = useState({
        date1: false,
        date2: false,
        status: false,
    });

    const handleChange = (value, field) => {
        if (field === 'login_before_date') {
            setDateRestrictions({
                ...dateRestrictions,
                range1: {
                    ...dateRestrictions.range1,
                    endDate: value.subtract(1, 'day'),
                },
            });
        } else if (field === 'login_after_date') {
            setDateRestrictions({
                ...dateRestrictions,
                range2: {
                    ...dateRestrictions.range2,
                    startDate: value.add(1, 'day'),
                },
            });
        }
        setUserFilter({
            ...userFilter,
            [field]: value,
        });
    };

    const handleFilter = (value, field) => {
        setFilterActive({
            ...filterActive,
            [field]: value,
        });
    };

    return (
        <Container>
            <Navbar />
            <div>
                <h1>Buscar por filtros</h1>
                <Container>
                    <p className="text-small text-default-500">Nombre usuario:</p>
                    <TextField
                        label="Nombre"
                        name="name"
                        variant="outlined"
                        value={userFilter.name}
                        onChange={(e) => handleChange(e.target.value, 'name')}
                    />
                    <div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <p className="text-small text-default-500">Login después de la fecha: {filterActive.date2 ? "" : "(deshabilitado)"}</p>
                            <DatePicker
                                maxDate={dateRestrictions.range1.endDate}
                                minDate={dateRestrictions.range1.startDate}
                                value={userFilter.login_after_date}
                                onChange={(e) => handleChange(e, 'login_after_date')}
                            />
                            <Checkbox
                                checked={filterActive.date2}
                                onChange={(e) => handleFilter(e.target.checked, 'date2')}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <p className="text-small text-default-500">Login antes de la fecha: {filterActive.date1 ? "" : "(deshabilitado)"}</p>
                            <DatePicker
                                minDate={dateRestrictions.range2.startDate}
                                value={userFilter.login_before_date}
                                onChange={(e) => handleChange(e, 'login_before_date')}
                            />
                            <Checkbox
                                checked={filterActive.date1}
                                onChange={(e) => handleFilter(e.target.checked, 'date1')}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </LocalizationProvider>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Switch
                            name="status"
                            checked={userFilter.status}
                            value={userFilter.status}
                            onChange={(e) => handleChange(e.target.checked, 'status')}
                        />
                        <Checkbox
                            checked={filterActive.status}
                            onChange={(e) => handleFilter(e.target.checked, 'status')}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                        <p className="text-small text-default-500">Status: {userFilter.status ? "true" : "false"} {filterActive.status ? "" : "(deshabilitado)"}</p>
                    </div>
                    <Button variant="contained" onClick={fetchUsers}>Buscar</Button>
                </Container>
            </div>
            <h1>Usuarios</h1>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Última Sesión</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.status ? 'ACTIVO' : 'CERRADO'}</TableCell>
                            <TableCell>TBD</TableCell>
                            <TableCell>
                                <IconButton color="primary" aria-label={"Editar usuario " + user.name} onClick={() => handleEdit(user)}>
                                    <Edit />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Container>
    );
}
