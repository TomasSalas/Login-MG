import { useContext, useEffect, useCallback, useState } from 'react';
import { NavBar } from './components/Navbar/NavBar';
import { DrawerContext } from './components/Provider/Provider.jsx';
import { Container, useMediaQuery, Card, Typography, Avatar, Accordion, AccordionSummary, AccordionDetails, Box, TextField, Button, Backdrop, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { VerificarToken } from './functions/VerificarToken';
import { useForm } from 'react-hook-form';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ActualizarDatos } from './functions/ActualizarDatos.jsx';
import { Toaster, toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { CerrarSesion } from './helpers/CerrarSesion.jsx';
export const Cuenta = () => {
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm();

	const { isOpen, setIsOpen } = useContext(DrawerContext);
	const [open, setOpen] = useState(false);
	const isMobile = useMediaQuery('(max-width:600px)');
	const verificar = VerificarToken(setIsOpen);
	const name = localStorage.getItem('usuario').split(' ')[0] + ' ' + localStorage.getItem('usuario').split(' ')[1];
	const password = watch('password', '');
	const navigate = useNavigate();
	const rol = localStorage.getItem('rol');

	const containerVariants = {
		hidden: { opacity: 0, y: 50 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.5, ease: 'easeInOut' },
		},
	};

	const formDatosPersonales = async (data) => {
		setOpen(true);
		const item = {
			id: localStorage.getItem('usuario').split(' ')[3],
			email: data.correo,
			contrasena: data.passwordConfirm || '',
		};

		const Actualizar = await ActualizarDatos(item);

		if (Actualizar.error) {
			setOpen(false);
			toast.success('Información actualizada');
			setTimeout(() => {
				CerrarSesion(navigate, setIsOpen);
			}, 2000);
		} else {
			setOpen(false);
			toast.error('Error al actualizar la información');
		}
	};

	const getUser = useCallback(() => {
		const nameUser = localStorage.getItem('usuario').split(' ');
		const name = nameUser[0];
		const lastName = nameUser[1];
		const emailUser = nameUser[2];

		setValue('nombre', name);
		setValue('apellido', lastName);
		setValue('correo', emailUser);
	}, [setValue]);

	useEffect(() => {
		verificar();
		getUser();
	}, [verificar, getUser]);

	return (
		<>
			<Toaster richColors />

			<NavBar name={name} rol={rol} />

			<motion.div initial="hidden" animate="visible" variants={containerVariants}>
				<Container
					maxWidth="xxl"
					style={{
						display: 'flex',
						justifyContent: 'center',
						flexDirection: 'column',
						paddingTop: 50,
						paddingLeft: isOpen && !isMobile ? 200 : 0,
					}}
				>
					<Container
						maxWidth="xxl"
						sx={{
							display: 'flex',
							justifyContent: 'center',
							flexDirection: 'row',
							paddingY: 5,
						}}
					>
						<Card
							sx={{
								width: '100%',
								paddingLeft: 2,
								paddingBottom: 2,
								paddingTop: 2,
								display: 'flex',
								justifyContent: 'flex-start',
								gap: '16px',
								alignItems: 'center',
							}}
						>
							<Avatar sx={{ bgcolor: '#ed6c02' }} variant="rounded">
								<PriorityHighIcon />
							</Avatar>
							<Typography variant="h6">Acá podras actulizar tus datos y cambiar tu contraseña para acceder al sistema.</Typography>
						</Card>
					</Container>

					<Container
						maxWidth="xxl"
						sx={{
							display: 'flex',
							justifyContent: 'center',
							flexDirection: 'column',
						}}
					>
						<Accordion>
							<AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'black' }} />} aria-controls="panel1-content" id="panel1-header">
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									<Avatar sx={{ bgcolor: '#ed6c02', marginRight: 2 }} variant="rounded"></Avatar> <Typography variant="h6">Datos Personales</Typography>
								</Box>
							</AccordionSummary>
							<AccordionDetails>
								<form
									style={{
										width: '100%',
										display: 'flex',
										justifyContent: 'center',
										flexDirection: 'column',
									}}
									onSubmit={handleSubmit(formDatosPersonales)}
								>
									<Box>
										<TextField variant="outlined" label="Nombre" fullWidth InputProps={{ readOnly: true }} {...register('nombre', { required: true })} />
									</Box>
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'start',
											minHeight: '2.0em',
										}}
									>
										{errors.nombre && (
											<Typography variant="body2" color="error">
												Debe Ingresar nombre
											</Typography>
										)}
									</Box>
									<Box>
										<TextField variant="outlined" label="Apellido" fullWidth InputProps={{ readOnly: true }} {...register('apellido', { required: true })} />
									</Box>
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'start',
											minHeight: '2.0em',
										}}
									>
										{errors.apellido && (
											<Typography variant="body2" color="error">
												Debe Ingresar apellido
											</Typography>
										)}
									</Box>
									<Box>
										<TextField variant="outlined" label="Correo" type="email" fullWidth {...register('correo', { required: true })} />
									</Box>
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'start',
											minHeight: '2.0em',
										}}
									>
										{errors.correo && (
											<Typography variant="body2" color="error">
												Debe Ingresar correo
											</Typography>
										)}
									</Box>
									<Box>
										<TextField variant="outlined" label="Nueva Contraseña" type="password" fullWidth {...register('password')} />
									</Box>
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'start',
											minHeight: '2.0em',
										}}
									>
										{errors.password && (
											<Typography variant="body2" color="error">
												Debe Ingresar contraseña
											</Typography>
										)}
									</Box>
									<Box>
										<TextField
											variant="outlined"
											label="Confirmar Nueva Contraseña"
											type="password"
											fullWidth
											{...register('passwordConfirm', {
												required: password !== '' ? true : false,
												validate: (value) => value === password || 'Las contraseñas no coinciden',
											})}
										/>
									</Box>
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'start',
											minHeight: '2.0em',
										}}
									>
										{errors.passwordConfirm && (
											<Typography variant="body2" color="error">
												{errors.passwordConfirm.message || 'Debe confirmar su contraseña'}
											</Typography>
										)}
									</Box>
									<Box sx={{ display: 'flex', justifyContent: 'center' }}>
										<Button sx={{ width: '30%' }} variant="contained" color="warning" type="submit">
											{' '}
											Actualizar{' '}
										</Button>
									</Box>
								</form>
							</AccordionDetails>
						</Accordion>
					</Container>
				</Container>
			</motion.div>

			<Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
				<CircularProgress color="error" />
			</Backdrop>
		</>
	);
};
