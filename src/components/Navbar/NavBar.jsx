import { useState, useContext, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Drawer, ListItemButton, List, ListItemText, Box, Menu, MenuItem, Button, ListItemIcon, Backdrop, CircularProgress, useMediaQuery, Paper } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import logoImg from '../../assets/logo_rakin.png';
import { DrawerContext } from '../Provider/Provider';
import PropTypes from 'prop-types';
import { useNavigate, Link } from 'react-router-dom';
import { CerrarSesion } from '../../helpers/CerrarSesion';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import ApartmentIcon from '@mui/icons-material/Apartment';

const drawerItems = [
	{
		text: 'Servicios Contratados',
		icon: <ContactEmergencyIcon sx={{ color: 'black' }} />,
		path: '/dashboard',
	},
	{
		text: 'Contratar Servicios',
		icon: <LogoutIcon sx={{ color: 'black' }} />,
		path: '/contratar',
	},
];

const drawerItems2 = [
	{
		text: 'Gestionar Usuarios',
		icon: <SupervisedUserCircleIcon sx={{ color: 'black' }} />,
		path: '/gestion-usuario',
	},
	{
		text: 'Gestionar Empresa',
		icon: <ApartmentIcon sx={{ color: 'black' }} />,
		path: '/gestion-empresa',
	},
];
const menuItems = [
	{ text: 'Mi Cuenta', icon: <ContactEmergencyIcon color="warning" /> },
	{ text: 'Cerrar Sesión', icon: <LogoutIcon color="error" /> },
];

export const NavBar = (props) => {
	NavBar.propTypes = {
		name: PropTypes.string,
		rol: PropTypes.string,
	};
	const navigate = useNavigate();
	const { isOpen, handleDrawerOpenPro, setIsOpen } = useContext(DrawerContext);

	const { name, rol } = props;
	const [anchorEl, setAnchorEl] = useState(null);
	const [openBack, setopenBack] = useState(false);

	const isMobile = useMediaQuery('(max-width:800px)');

	const handleDrawerOpen = () => {
		handleDrawerOpenPro();
	};

	const handleMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = (index) => {
		const selectedItem = menuItems[index];

		if (selectedItem == undefined) {
			setAnchorEl(null);
			return;
		}

		if (selectedItem.text === 'Cerrar Sesión') {
			setopenBack(true);
			setAnchorEl(null);
			setTimeout(() => {
				CerrarSesion(navigate, setIsOpen);
			}, 2000);
		}

		if (selectedItem.text === 'Mi Cuenta') {
			setopenBack(true);
			navigate('/mi-cuenta');
			setopenBack(false);
		}
	};

	useEffect(() => {
		if (isMobile) {
			handleDrawerOpenPro();
		}
	}, []);

	return (
		<div>
			<AppBar position="fixed" className="appBar" sx={{ backgroundColor: 'white', boxShadow: 'none', color: 'black', width: `calc(100% - ${isOpen ? 200 : 0}px)`, marginLeft: isOpen ? 200 : 0 }}>
				<Toolbar>
					<IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerOpen}>
						{!isOpen && <MenuIcon />}
					</IconButton>
					<Box sx={{ flexGrow: 1 }}>{!isOpen && <img src={logoImg} style={{ width: 150 }}></img>}</Box>
					<Button color="inherit" onClick={handleMenuOpen}>
						<PersonIcon sx={{ paddingRight: 2 }} /> Bienvenido {` ${name}`}
					</Button>
					<Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
						{menuItems.map((item, index) => (
							<MenuItem onClick={() => handleMenuClose(index)} key={index}>
								<ListItemIcon>{item.icon}</ListItemIcon>
								{item.text}
							</MenuItem>
						))}
					</Menu>
				</Toolbar>
			</AppBar>

			<Drawer variant="persistent" anchor="left" open={isOpen} onClose={handleDrawerOpen} sx={{ width: 250, boxShadow: 'none' }}>
				<Paper sx={{ width: 200, backgroundColor: '#f6f6f7', height: '100vh' }}>
					<Box className="drawer" sx={{ backgroundColor: '#f6f6f7' }}>
						<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f6f6f7' }}>
							<img src={logoImg} style={{ width: 150 }} alt="Logo" />
							{isOpen && (
								<IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerOpen}>
									<KeyboardArrowLeftIcon />
								</IconButton>
							)}
						</Box>
						<List>
							{rol == '2'
								? drawerItems2.map((item, index) => (
										<ListItemButton key={index} component={Link} to={item.path}>
											{item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
											<ListItemText primary={item.text} />
										</ListItemButton>
									))
								: drawerItems.map((item, index) => (
										<ListItemButton key={index} component={Link} to={item.path}>
											{item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
											<ListItemText primary={item.text} />
										</ListItemButton>
									))}
						</List>
					</Box>
				</Paper>
			</Drawer>

			<Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={openBack}>
				<CircularProgress color="warning" />
			</Backdrop>
		</div>
	);
};
