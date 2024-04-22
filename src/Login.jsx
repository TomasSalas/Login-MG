import { useState, useEffect, useContext } from 'react';
import './assets/style.css';
import { Backdrop, Box, Button, Container, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { FormatRut } from './helpers/FormatRut';
import { IniciarSesion } from './functions/InciarSesion';
import CircularProgress from '@mui/material/CircularProgress';
import { Toaster, toast } from 'sonner';
import ImgLogo from './assets/logo_rakin.png';
import { LoginContext } from './components/Provider/ProviderLogin';
import { useNavigate, Link } from 'react-router-dom';
import { VerificacionCookie } from './functions/VerificacionCookie';

export function Login() {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm();

	const [open, setOpen] = useState(false);
	const [containerHeight, setContainerHeight] = useState('100vh');
	const { setRol, setEmpresa } = useContext(LoginContext);
	const navigate = useNavigate();

	const onSubmit = async (parms) => {
		setOpen(true);
		try {
			const { error } = await IniciarSesion(parms, navigate);
			if (!error) {
				setRol(localStorage.getItem('rol'));
				setEmpresa(localStorage.getItem('IdEmpresa'));
				setOpen(false);
			} else {
				setOpen(false);
				toast.error('Error en usuario y contraseña');
			}
		} catch (error) {
			setOpen(false);
		}
	};

	const onChangeInput = (data) => {
		if (data.target.value.includes('NaN-')) {
			setValue('rut', '');
		}
		setValue('rut', FormatRut(data.target.value));
	};

	useEffect(() => {
		const cookieName = 'invalid';
		const cookie = VerificacionCookie(cookieName);

		if (cookie) {
			toast.info('Sesión finalizada o error en el inicio de sesión');
		}

		const updateContainerHeight = () => {
			setContainerHeight(`${window.innerHeight}px`);
		};

		window.addEventListener('resize', updateContainerHeight);
		updateContainerHeight();

		return () => {
			window.removeEventListener('resize', updateContainerHeight);
		};
	}, []);

	return (
		<>
			<Toaster richColors />

			<Container maxWidth="xxl" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: containerHeight }}>
				<Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
					<Container maxWidth="xs" sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
						<img src={ImgLogo} />
					</Container>

					<Container maxWidth="xs" sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
						<form onSubmit={handleSubmit(onSubmit)}>
							<Box sx={{ display: 'flex', justifyContent: 'start', paddingTop: 1, flexDirection: 'column' }}>
								<TextField
									variant="outlined"
									label="Rut"
									fullWidth
									inputProps={{ maxLength: 12 }}
									{...register('rut', {
										onChange: (e) => {
											onChangeInput(e);
										},
										required: true,
									})}
								/>

								<Box sx={{ display: 'flex', justifyContent: 'start', minHeight: '2.0em' }}>
									{errors.rut && (
										<Typography variant="body2" color="error">
											Ingrese rut
										</Typography>
									)}
								</Box>
							</Box>

							<Box sx={{ display: 'flex', justifyContent: 'start', flexDirection: 'column' }}>
								<TextField variant="outlined" label="Contraseña" type="password" fullWidth {...register('contrasena', { required: true })} />

								<Box sx={{ display: 'flex', justifyContent: 'start', minHeight: '2.0em' }}>
									{errors.contrasena && (
										<Typography variant="body2" color="error">
											Ingrese contraseña
										</Typography>
									)}
								</Box>
							</Box>

							<Button variant="contained" type="submit" fullWidth color="warning">
								Ingresar
							</Button>

							<Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
								<Link to="/recuperar-password" style={{ textDecoration: 'none' }}>
									<Typography variant="subtitle1" sx={{ color: '#595959', fontWeight: 'bold' }}>
										¿Olvidaste tu contraseña?
									</Typography>
								</Link>
							</Box>
						</form>
					</Container>
				</Container>
			</Container>

			<Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
				<CircularProgress color="warning" />
			</Backdrop>
		</>
	);
}
