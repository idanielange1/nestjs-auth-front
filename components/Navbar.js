import React, {useEffect, useState} from 'react';
import './Navbar.css';
import Button from '@mui/material/Button';
import AuthService from '@/services/AuthService';
import { useRouter } from 'next/navigation';

const Navbar = () => {
    const router = useRouter();
    const [user, setUser] = useState({name:""});

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('user')));
    }, []);

    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        const result = await AuthService.logOut(token);
        if(result){
            router.push('/login');
        }
    }

    const handleFindByFilter = async () => {
        router.push('/users/findUsers');
    }
    const handleUsers = async () => {
        router.push('/users');
    }
    const handleBulk = async () => {
        router.push('/users/bulkCreate');
    }

    return (
        <div className="navbar">
            <div className="navbar-item">
                {user?.name}
            </div>
            <div className="navbar-item">
                <Button onClick={handleUsers}>
                    Users
                </Button>
            </div>
            <div className="navbar-item">
                <Button onClick={handleFindByFilter}>
                    Search by filter
                </Button>
            </div>
            <div className="navbar-item">
                <Button onClick={handleBulk}>
                    Bulk Create
                </Button>
            </div>
            <div className="navbar-item">
                <Button onClick={handleLogout}>
                    Logout
                </Button>
            </div>
        </div>
    )
}

export default Navbar;