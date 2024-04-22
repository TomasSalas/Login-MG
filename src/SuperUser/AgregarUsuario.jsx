import { useEffect, useContext, useState } from 'react';
import { NavBar } from '../components/Navbar/NavBar';
import { DrawerContext } from '../components/Provider/Provider';
import { VerificarToken } from '../functions/VerificarToken';
import { useNavigate } from 'react-router-dom';
import { Avatar, Backdrop, Box, Button, CircularProgress, Container, FormControl, InputLabel, MenuItem, Select, TextField, Typography, useMediaQuery } from '@mui/material';
import { Toaster, toast } from 'sonner';
import { FormatRut } from '../helpers/FormatRut';
import { motion } from 'framer-motion';
import { Controller, useForm } from 'react-hook-form';
import { GetEmpresas } from '../functions/GetEmpresas';
import { AgregarUsuarioF } from '../functions/AgregarUsuarioF';
import { GetRol } from '../functions/GetRol';

export const AgregarUsuario = () => {
	const name = localStorage.getItem('usuario').split(' ')[0] + ' ' + localStorage.getItem('usuario').split(' ')[1];
	const rol = localStorage.getItem('rol');
	const { isOpen, setIsOpen } = useContext(DrawerContext);
	const isMobile = useMediaQuery('(max-width:600px)');
	const verificar = VerificarToken(setIsOpen);
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const [empresa, setEmpresa] = useState([]);
	const [role, setRole] = useState([]);

	const {
		register,
		setValue,
		reset,
		control,
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

	const getRol = async () => {
		const { data } = await GetRol();
		setRole(data);
	};

	const onChangeInput = (data) => {
		if (data.target.value.includes('NaN-')) {
			setValue('run', '');
		}
		setValue('run', FormatRut(data.target.value));
	};

	const onSubmit = async (parms) => {
		setOpen(true);

		const { error, data } = await AgregarUsuarioF(parms);

		if (!error) {
			setOpen(false);
			toast.success('Empresa agregada');
			reset();
			setTimeout(() => {
				navigate('/gestion-usuario');
			}, 1000);
		} else {
			setOpen(false);
			toast.error(data);
			reset();
		}
	};

	const getEmpresas = async () => {
		const { data } = await GetEmpresas();
		setEmpresa(data);
	};

	useEffect(() => {
		if (rol != null) {
			if (rol != '2') {
				navigate('/dashboard');
			} else {
				verificar();
				getEmpresas();
				getRol();
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
					<Container maxWidth="xxl" sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', paddingY: 2, gap: 2, alignItems: 'center' }}>
						<Avatar variant="rounded" sx={{ width: 40, height: 40, bgcolor: '#ed6c02' }}></Avatar>
						<Typography variant="h4">Agregar Usuario</Typography>
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

							<TextField fullWidth label="Apellido" variant="outlined" {...register('apellido', { required: true })}></TextField>
							<Box sx={{ display: 'flex', justifyContent: 'start', minHeight: '2.0em' }}>
								{errors.apellido && (
									<Typography variant="body2" color="error">
										Ingrese Apellido
									</Typography>
								)}
							</Box>

							<TextField
								fullWidth
								label="Rut"
								variant="outlined"
								inputProps={{ maxLength: 12 }}
								{...register('run', {
									onChange: (e) => {
										onChangeInput(e);
									},
									required: true,
								})}
							></TextField>
							<Box sx={{ display: 'flex', justifyContent: 'start', minHeight: '2.0em' }}>
								{errors.run && (
									<Typography variant="body2" color="error">
										Ingrese Rut
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
							<TextField fullWidth label="Contraseña" variant="outlined" type="password" {...register('contrasena', { required: true })}></TextField>
							<Box sx={{ display: 'flex', justifyContent: 'start', minHeight: '2.0em' }}>
								{errors.contrasena && (
									<Typography variant="body2" color="error">
										Ingrese Contraseña
									</Typography>
								)}
							</Box>

							<FormControl fullWidth>
								<InputLabel id="demo-simple-select-label">Rol</InputLabel>
								<Controller
									name="rol"
									control={control}
									defaultValue=""
									rules={{ required: true }}
									render={({ field }) => (
										<Select labelId="demo-simple-select-label" id="demo-simple-select" label="Rol" {...field}>
											{role.map((item, index) => (
												<MenuItem key={index} value={item.idRol}>
													{item.nombreRol}
												</MenuItem>
											))}
										</Select>
									)}
								/>
							</FormControl>
							<Box sx={{ display: 'flex', justifyContent: 'start', minHeight: '2.0em' }}>
								{errors.rol && (
									<Typography variant="body2" color="error">
										Ingrese Rol
									</Typography>
								)}
							</Box>

							<FormControl fullWidth>
								<InputLabel id="demo-simple-select-label">Empresa</InputLabel>
								<Controller
									name="idEmpresa"
									control={control}
									defaultValue=""
									render={({ field }) => (
										<Select labelId="demo-simple-select-label" id="demo-simple-select" label="Empresa" {...field}>
											{empresa.map((item, index) => (
												<MenuItem key={index} value={item.idEmpresa}>
													{item.nombre}
												</MenuItem>
											))}
										</Select>
									)}
								/>
							</FormControl>

							<Box sx={{ display: 'flex', justifyContent: 'start', minHeight: '2.0em' }}>
								{errors.role && (
									<Typography variant="body2" color="error">
										Ingrese Empresa
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
