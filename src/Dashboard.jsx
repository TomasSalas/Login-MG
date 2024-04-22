import { Avatar, Button, Card, CardContent, CardMedia, CardActions, Container, Typography, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { useState, useContext, useEffect } from 'react';
import { NavBar } from './components/Navbar/NavBar';
import ChecklistIcon from '@mui/icons-material/Checklist';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import ArticleIcon from '@mui/icons-material/Article';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PaymentIcon from '@mui/icons-material/Payment';
import { DrawerContext } from './components/Provider/Provider';
import SchoolIcon from '@mui/icons-material/School';
import ApartmentIcon from '@mui/icons-material/Apartment';
import { VerificarToken } from './functions/VerificarToken';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
	const [hoverStates, setHoverStates] = useState([false, false, false, false, false]);
	const { isOpen, setIsOpen } = useContext(DrawerContext);
	const isMobile = useMediaQuery('(max-width:600px)');
	const verificar = VerificarToken(setIsOpen);
	const [nombreEmpresa, setNombreEmpresa] = useState('');
	const [servicios, setServicios] = useState([]);
	const rol = localStorage.getItem('rol');
	const navigate = useNavigate();
	const name = localStorage.getItem('usuario').split(' ')[0] + ' ' + localStorage.getItem('usuario').split(' ')[1];

	const handleMouseEnter = (index) => {
		setHoverStates((prevStates) => {
			const newStates = [...prevStates];
			newStates[index] = true;
			return newStates;
		});
	};

	const handleMouseLeave = (index) => {
		setHoverStates((prevStates) => {
			const newStates = [...prevStates];
			newStates[index] = false;
			return newStates;
		});
	};

	const buttonVariants = {
		rest: {
			backgroundColor: '#d32f2f',
			color: 'white',
			transition: {
				duration: 0.5,
			},
		},
		hover: {
			backgroundColor: '#ed6c02',
			color: 'white',
			transition: {
				duration: 0.5,
			},
		},
	};

	const cardVariants = {
		initial: { scale: 1 },
		onHover: { scale: 1.03 },
	};

	const containerVariants = {
		hidden: { opacity: 0, y: 50 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.5, ease: 'easeInOut' },
		},
	};

	const getServicios = async () => {
		const idEmpresa = localStorage.getItem('idEmpresa');
		const url = `https://app-prod-eastus-login-api.azurewebsites.net/api/Administrador/ObtenerServiciosContratados?idEmpresa=${idEmpresa}`;
		const token = localStorage.getItem('token');

		const headers = {
			Authorization: `Bearer ${token}`,
		};

		const response = await fetch(url, { headers });
		const resultado = await response.json();
		setServicios(resultado.resultado ? resultado.resultado : []);
	};

	const getIcon = (iconType, index) => {
		switch (iconType) {
			case 'checklist':
				return <ChecklistIcon fontSize="large" className="hovericon" sx={{ width: 90, height: 90, color: hoverStates[index] ? '#ed6c02' : '#d32f2f' }} />;
			case 'keyboard':
				return <KeyboardIcon fontSize="large" className="hovericon" sx={{ width: 90, height: 90, color: hoverStates[index] ? '#ed6c02' : '#d32f2f' }} />;
			case 'article':
				return <ArticleIcon fontSize="large" className="hovericon" sx={{ width: 90, height: 90, color: hoverStates[index] ? '#ed6c02' : '#d32f2f' }} />;
			case 'attach':
				return <AttachMoneyIcon fontSize="large" className="hovericon" sx={{ width: 90, height: 90, color: hoverStates[index] ? '#ed6c02' : '#d32f2f' }} />;
			case 'payment':
				return <PaymentIcon fontSize="large" className="hovericon" sx={{ width: 90, height: 90, color: hoverStates[index] ? '#ed6c02' : '#d32f2f' }} />;
			case 'school':
				return <SchoolIcon fontSize="large" className="hovericon" sx={{ width: 90, height: 90, color: hoverStates[index] ? '#ed6c02' : '#d32f2f' }} />;
			default:
				return null;
		}
	};
	const EnviarToken = () => {
		const token = localStorage.getItem('token');
		document.cookie = `token=${token}; path=/; samesite=strict`;
		const url = `https://app-prod-micro-portalevaluadores-front.azurewebsites.net/`;

		window.open(url, '_blank');
	};

	useEffect(() => {
		if (rol != null) {
			if (rol != '1') {
				navigate('/gestion-usuario');
			} else {
				verificar();
				setNombreEmpresa(localStorage.getItem('nombreEmpresa'));
				getServicios();
			}
		} else {
			navigate('/');
		}
	}, [verificar, getServicios]);

	return (
		<>
			<NavBar name={name} rol={rol} />
			<motion.div initial="hidden" animate="visible" variants={containerVariants}>
				<Container maxWidth="xxl" style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', paddingTop: 50, paddingLeft: isOpen && !isMobile ? 200 : 0 }}>
					<Container maxWidth="xxl" sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', paddingY: 5 }}>
						<Card sx={{ width: '100%', paddingLeft: 2, paddingTop: 2, paddingBottom: 2, display: 'flex', justifyContent: 'flex-start', gap: '16px', alignItems: 'center' }}>
							<Avatar sx={{ bgcolor: '#d32f2f' }} variant="rounded">
								<ApartmentIcon />
							</Avatar>
							<Typography variant="h6">Empresa {nombreEmpresa.toLocaleUpperCase()}</Typography>
						</Card>
					</Container>

					<Container maxWidth="xxl" className="Container-Main" sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
						{servicios.map((item, index) => (
							<motion.div
								key={index}
								variants={cardVariants}
								initial="initial"
								whileHover="onHover"
								transition={{ duration: 0.3 }}
								style={{ minWidth: 200, maxWidth: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column', flex: 1, flexBasis: 'calc(33.3333% - 16px)' }}
							>
								<Card sx={{ boxShadow: '2px 2px 2px 2px rgba(0.1, 0.1, 0.1, 0.1)' }}>
									<CardMedia sx={{ display: 'flex', maxHeight: 120, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
										{getIcon(item.icono, index)}
										<Typography gutterBottom variant="h6" component="div" sx={{ textAlign: 'center' }}>
											{item.servicioDerivado}
										</Typography>
									</CardMedia>

									<CardContent sx={{ display: 'flex', height: 110, overflow: 'hidden', justifyContent: 'start', alignItems: 'center', flexDirection: 'column', paddingTop: 5 }}>
										<Typography gutterBottom variant="subtitle1" component="div" sx={{ display: 'flex', justifyContent: 'start', textAlign: 'justify' }}>
											{item.descripcion}
										</Typography>
									</CardContent>

									<CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
										<Button
											variant="contained"
											className="btn-change btn-hover"
											onMouseEnter={() => handleMouseEnter(index)}
											onMouseLeave={() => handleMouseLeave(index)}
											component={motion.button}
											variants={buttonVariants}
											initial="rest"
											animate={hoverStates[index] ? 'hover' : 'rest'}
											style={{ display: 'flex', alignItems: 'center', borderRadius: '100%', height: 40, width: 40, minWidth: 0, fontWeight: 'bold', fontSize: '20px', color: 'white' }}
											onClick={EnviarToken}
										>
											{'>'}
										</Button>
									</CardActions>
								</Card>
							</motion.div>
						))}
					</Container>
				</Container>
			</motion.div>
		</>
	);
};
