import { useEffect, useContext, useState } from 'react';
import { NavBar } from '../components/Navbar/NavBar';
import { DrawerContext } from '../components/Provider/Provider';
import { VerificarToken } from '../functions/VerificarToken';
import { useNavigate } from 'react-router-dom';
import { Avatar, Backdrop, Box, Button, CircularProgress, Container, TextField, Typography, useMediaQuery } from '@mui/material';
import { Toaster, toast } from 'sonner';
import { FormatRut } from '../helpers/FormatRut';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { AgregarEmpresaF } from '../functions/AgregarEmpresaF';
import LocationCityIcon from '@mui/icons-material/LocationCity';
export const AgregarEmpresa = () => {
	const name = localStorage.getItem('usuario').split(' ')[0] + ' ' + localStorage.getItem('usuario').split(' ')[1];
	const rol = localStorage.getItem('rol');
	const { isOpen, setIsOpen } = useContext(DrawerContext);
	const isMobile = useMediaQuery('(max-width:600px)');
	const verificar = VerificarToken(setIsOpen);
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const {
		register,
		setValue,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const containerVariants = {
		hidden: { opacity: 0, y: 50 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.5, ease: 'easeInOut' },
		},
	};

	const onChangeInput = (data) => {
		if (data.target.value.includes('NaN-')) {
			setValue('rut', '');
		}
		setValue('rut', FormatRut(data.target.value));
	};

	const onSubmit = async (parms) => {
		setOpen(true);
		const { error } = await AgregarEmpresaF(parms);

		if (!error) {
			setOpen(false);
			toast.success('Empresa agregada');
			reset();
			setTimeout(() => {
				navigate('/gestion-empresa');
			}, 1000);
		} else {
			setOpen(false);
			toast.error('Error al agregar la empresa');
			reset();
		}
	};

	useEffect(() => {
		if (rol != null) {
			if (rol != '2') {
				navigate('/dashboard');
			} else {
				verificar();
			}
		} else {
			navigate('/');
		}
	}, [verificar]);

	return (
		<>
			<Toaster richColors />
			<NavBar name={name} rol={rol} />

			<motion.div initial="hidden" animate="visible" variants={containerVariants}>
				<Container maxWidth="xxl" style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', paddingTop: 50, paddingLeft: isOpen && !isMobile ? 200 : 0 }}>
					<Container maxWidth="xxl" sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', paddingY: 5, gap: 2, alignItems: 'center' }}>
						<Avatar variant="rounded" sx={{ width: 40, height: 40, bgcolor: '#ed6c02' }}>
							<LocationCityIcon />
						</Avatar>
						<Typography variant="h4">Agregar Empresa</Typography>
					</Container>
					<Container maxWidth="xxl" sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', paddingY: 5 }}>
						<form style={{ display: 'flex', flexDirection: 'column', width: '70%' }} onSubmit={handleSubmit(onSubmit)}>
							<TextField fullWidth label="Nombre" variant="outlined" {...register('nombre', { required: true })}></TextField>
							<Box sx={{ display: 'flex', justifyContent: 'start', minHeight: '2.0em' }}>
								{errors.nombre && (
									<Typography variant="body2" color="error">
										Ingrese Nombre
									</Typography>
								)}
							</Box>
							<TextField
								fullWidth
								label="Rut"
								variant="outlined"
								inputProps={{ maxLength: 12 }}
								{...register('rut', {
									onChange: (e) => {
										onChangeInput(e);
									},
									required: true,
								})}
							></TextField>
							<Box sx={{ display: 'flex', justifyContent: 'start', minHeight: '2.0em' }}>
								{errors.rut && (
									<Typography variant="body2" color="error">
										Ingrese Rut
									</Typography>
								)}
							</Box>
							<TextField fullWidth label="Dirección" variant="outlined" {...register('direccion', { required: true })}></TextField>
							<Box sx={{ display: 'flex', justifyContent: 'start', minHeight: '2.0em' }}>
								{errors.direccion && (
									<Typography variant="body2" color="error">
										Ingrese Dirección
									</Typography>
								)}
							</Box>
							<TextField fullWidth label="Correo" variant="outlined" {...register('email', { required: true })}></TextField>
							<Box sx={{ display: 'flex', justifyContent: 'start', minHeight: '2.0em' }}>
								{errors.email && (
									<Typography variant="body2" color="error">
										Ingrese Email
									</Typography>
								)}
							</Box>
							<TextField
								fullWidth
								inputProps={{ maxLength: 9 }}
								type="tel"
								label="Telefono"
								variant="outlined"
								{...register('telefono', {
									required: true,
									minLength: 9,
									maxLength: 9,
									pattern: /^[0-9]*$/,
								})}
							></TextField>
							<Box sx={{ display: 'flex', justifyContent: 'start', minHeight: '2.0em' }}>
								{errors.telefono && (
									<Typography variant="body2" color="error">
										Ingrese Telefono
									</Typography>
								)}
							</Box>
							<Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, marginTop: 5 }}>
								<Button variant="contained" color="success" type="submit" size="large">
									Guardar
								</Button>
							</Box>
						</form>
					</Container>
				</Container>
			</motion.div>

			<Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
				<CircularProgress color="error" />
			</Backdrop>
		</>
	);
};
