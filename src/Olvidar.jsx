import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { Box, Button, Container, TextField, Typography, Card, CardContent, Backdrop, CircularProgress } from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { EnviarCorreo } from './functions/EnviarCorreo';
import { OlvidarPassword } from './functions/OlvidarPassword';
import { useNavigate } from 'react-router-dom';

export const Olvidar = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const {
		register: register2,
		handleSubmit: handleSubmit2,
		formState: { errors: errors2 },
	} = useForm();
	const {
		register: register3,
		handleSubmit: handleSubmit3,
		watch: watch3,
		formState: { errors: errors3 },
	} = useForm();
	const navigate = useNavigate();

	const [codigo, setCodigo] = useState('');
	const [step1, setStep1] = useState(true);
	const [step2, setStep2] = useState(false);
	const [step3, setStep3] = useState(false);
	const [timerStarted, setTimerStarted] = useState(false);
	const [remainingTime, setRemainingTime] = useState(0);
	const [open, setOpen] = useState(false);
	const [email, setEmail] = useState(false);
	const [containerHeight, setContainerHeight] = useState('100vh');

	const onSubmit = async (params) => {
		setOpen(true);

		const { correo } = params;

		const codigoGenerate = generateRandomString();
		setCodigo(codigoGenerate);

		const param = { correo, codigoGenerate };

		const { error, data } = await EnviarCorreo(param);

		if (!error) {
			setEmail(correo);
			setStep1(false);
			setStep2(true);
			setTimerStarted(true);
			setOpen(false);
		} else {
			setOpen(false);
			toast.error(data[0]);
		}
	};

	const onSubmit2 = async (params) => {
		const { codigoForm } = params;
		if (codigoForm.toString() === codigo.toString()) {
			setStep2(false);
			setStep3(true);
		} else {
			toast.error('Código de estado no valido');
		}
	};

	const onSubmit3 = async (params) => {
		setOpen(true);
		const { contrasena2 } = params;

		const param = {
			contrasena: contrasena2,
			correo: email,
		};

		const { error, data } = await OlvidarPassword(param);

		if (!error) {
			setOpen(false);
			toast.success('Contraseña modificada exitosamente');
			setTimeout(() => {
				navigate('/');
			}, 2000);
		} else {
			setOpen(false);
			toast.error(data[0]);
		}
	};

	const generateRandomString = () => {
		return Math.random().toString(36).substring(2, 8);
	};

	const formatTime = (milliseconds) => {
		const seconds = Math.floor(milliseconds / 1000);
		const minutes = Math.floor(seconds / 60);
		const formattedSeconds = seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60;

		return `${minutes}:${formattedSeconds}`;
	};

	useEffect(() => {
		const updateContainerHeight = () => {
			setContainerHeight(`${window.innerHeight}px`);
		};

		window.addEventListener('resize', updateContainerHeight);
		updateContainerHeight();

		if (timerStarted) {
			setTimerStarted(true);

			const initialTime = 300 * 1000;
			let currentTime = initialTime;

			const timer = setInterval(() => {
				currentTime -= 1000;
				setRemainingTime(currentTime);

				if (currentTime <= 0) {
					setCodigo(null);
					setTimerStarted(false);
					clearInterval(timer);
					location.reload();
				}
			}, 1000);

			return () => {
				window.removeEventListener('resize', updateContainerHeight);
				clearInterval(timer);
			};
		}
	}, [timerStarted]);

	return (
		<>
			<Toaster richColors />
			<Container
				maxWidth="sm"
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: containerHeight,
					flexDirection: 'column',
				}}
			>
				<Box sx={{ display: 'flex', justifyContent: 'center' }}>
					<Typography variant="h4" align="left">
						Recuperar Contraseña
					</Typography>
				</Box>
				{step1 && (
					<motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.5 }}>
						<Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center' }}>
							<Card
								variant="outlined"
								sx={{
									padding: 3,
									marginTop: 5,
									width: '100%',
									maxWidth: '350px',
								}}
							>
								<CardContent>
									<Box sx={{ display: 'flex', justifyContent: 'center' }}>
										<LockOpenIcon sx={{ fontSize: 60 }} />
									</Box>
									<Box sx={{ marginTop: 3 }}>
										<Typography variant="subtitle1" align="left">
											Ingresa tu correo electrónico y te enviaremos un código para recuperar tu contraseña.
										</Typography>
									</Box>
									<Box
										sx={{
											marginTop: 3,
											display: 'flex',
											flexDirection: 'column',
											justifyContent: 'center',
										}}
									>
										<form onSubmit={handleSubmit(onSubmit)}>
											<TextField fullWidth type="email" label="Correo Electrónico" {...register('correo', { required: true })} />
											{errors.correo && (
												<Typography variant="subtitle1" color="error">
													Ingrese correo electrónico
												</Typography>
											)}
											<Button type="submit" sx={{ marginTop: 4 }} variant="contained" fullWidth color="warning">
												Enviar Correo
											</Button>
										</form>
									</Box>
								</CardContent>
							</Card>
						</Container>
					</motion.div>
				)}
				{step2 && (
					<motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.5 }}>
						<Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center' }}>
							<Card
								variant="outlined"
								sx={{
									padding: 3,
									marginTop: 5,
									width: '100%',
									maxWidth: '350px',
								}}
							>
								<Box sx={{ display: 'flex', justifyContent: 'end' }}>
									<Typography variant="h5">{formatTime(remainingTime)}</Typography>
								</Box>
								<CardContent>
									<Box sx={{ display: 'flex', justifyContent: 'center' }}>
										<LockOpenIcon sx={{ fontSize: 60 }} />
									</Box>
									<Box sx={{ marginTop: 3 }}>
										<Typography variant="subtitle1" align="center">
											Ingresa tu código que te enviamos al correo.
										</Typography>
									</Box>
									<Box
										sx={{
											marginTop: 3,
											display: 'flex',
											flexDirection: 'column',
											justifyContent: 'center',
										}}
									>
										<form onSubmit={handleSubmit2(onSubmit2)}>
											<TextField fullWidth label="Codigo" inputProps={{ maxLength: 6 }} {...register2('codigoForm', { required: true })} />
											{errors2.codigoForm && (
												<Typography variant="subtitle1" color="error">
													Ingrese codigo
												</Typography>
											)}
											<Button type="submit" sx={{ marginTop: 4 }} variant="contained" fullWidth color="warning">
												Siguiente
											</Button>
										</form>
									</Box>
								</CardContent>
							</Card>
						</Container>
					</motion.div>
				)}
				{step3 && (
					<motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.5 }}>
						<Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center' }}>
							<Card
								variant="outlined"
								sx={{
									padding: 3,
									marginTop: 5,
									width: '100%',
									maxWidth: '350px',
								}}
							>
								<Box sx={{ display: 'flex', justifyContent: 'end' }}>
									<Typography variant="h5">{formatTime(remainingTime)}</Typography>
								</Box>
								<CardContent>
									<Box sx={{ display: 'flex', justifyContent: 'center' }}>
										<LockOpenIcon sx={{ fontSize: 60 }} />
									</Box>
									<Box sx={{ marginTop: 3 }}>
										<Typography variant="subtitle1" align="center">
											Ingrese su nueva contraseña
										</Typography>
									</Box>
									<Box
										sx={{
											marginTop: 3,
											display: 'flex',
											flexDirection: 'column',
											justifyContent: 'center',
										}}
									>
										<form onSubmit={handleSubmit3(onSubmit3)}>
											<TextField label="Contraseña Nueva" type="password" variant="outlined" autoComplete="current-password" fullWidth sx={{ marginTop: 3 }} {...register3('contrasena', { required: true })} />
											{errors3.contrasena && (
												<Typography variant="subtitle1" color="error">
													Contraseña obligatoria
												</Typography>
											)}

											<TextField
												label="Confirmar Contraseña"
												type="password"
												variant="outlined"
												autoComplete="current-password"
												fullWidth
												sx={{ marginTop: 3 }}
												{...register3('contrasena2', {
													required: true,
													validate: (val) => {
														if (watch3('contrasena') != val) {
															return 'Las contraseñas no coinciden';
														}
													},
												})}
											/>
											{errors3.contrasena2 && (
												<Typography variant="subtitle1" color="error">
													{errors3.contrasena2.message ? errors3.contrasena2.message : 'Confirmación de contraseña obligaroria'}
												</Typography>
											)}
											<Button fullWidth variant="contained" color="warning" sx={{ height: 40, marginTop: 5 }} type="submit">
												{' '}
												Cambiar Contraseña{' '}
											</Button>
										</form>
									</Box>
								</CardContent>
							</Card>
						</Container>
					</motion.div>
				)}
			</Container>

			<Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
				<CircularProgress color="warning" />
			</Backdrop>
		</>
	);
};
