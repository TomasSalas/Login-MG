import {
	Container,
	TableContainer,
	Typography,
	useMediaQuery,
	Paper,
	TableHead,
	Table,
	TableCell,
	TableBody,
	TableRow,
	Box,
	Button,
	Avatar,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	CircularProgress,
} from '@mui/material';
import { useEffect, useContext, useState } from 'react';
import { VerificarToken } from '../functions/VerificarToken';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../components/Navbar/NavBar';
import { DrawerContext } from '../components/Provider/Provider';
import { GetUsuarios } from '../functions/GetUsuarios';
import { FormatRut } from '../helpers/FormatRut';
import AddIcon from '@mui/icons-material/Add';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import EditIcon from '@mui/icons-material/Edit';
import { EstadoUsuario } from '../functions/EstadoUsuario';
import { Toaster, toast } from 'sonner';
import { Controller, useForm } from 'react-hook-form';
import { GetEmpresas } from '../functions/GetEmpresas';
import { ActualizarUsuario } from '../functions/ActulizarUsuario';
import { GetRol } from '../functions/GetRol';
export const GestionUsuario = () => {
	const rol = localStorage.getItem('rol');
	const { isOpen, setIsOpen } = useContext(DrawerContext);

	const verificar = VerificarToken(setIsOpen);
	const navigate = useNavigate();
	const name = localStorage.getItem('usuario').split(' ')[0] + ' ' + localStorage.getItem('usuario').split(' ')[1];
	const isMobile = useMediaQuery('(max-width:600px)');
	const [dataUser, setDataUser] = useState([]);
	const [dataEmpresa, setDataEmpresa] = useState([]);
	const [empresa, setEmpresa] = useState([]);
	const [role, setRole] = useState([]);
	const [dialogEdit, setDialogEdit] = useState(false);
	const [dialogEstado, setDialogEstado] = useState(false);
	const [runUsuario, setRunUsuario] = useState({});
	const [empresasLoaded, setEmpresasLoaded] = useState(false);
	const {
		register,
		handleSubmit,
		setValue,
		control,
		reset,
		formState: { errors },
	} = useForm();

	const getUsuarios = async () => {
		const { data } = await GetUsuarios();
		setDataUser(data);
	};

	const getRol = async () => {
		const { data } = await GetRol();
		setRole(data);
	};

	const getEmpresas = async () => {
		const { data } = await GetEmpresas();
		setEmpresa(data);
		setDataEmpresa(data);
		setTimeout(() => {
			setEmpresasLoaded(true);
		}, 1000);
	};

	const editarClick = async (data) => {
		setValue('nombre', data.nombre);
		setValue('apellido', data.apellido);
		setValue('run', FormatRut(String(data.run)));
		setValue('email', data.email);
		setValue('rol', data.rol);
		setValue('idEmpresa', data.idEmpresa);
		setRunUsuario(data.run);
		setDialogEdit(true);
	};

	const darAltaClick = async (data) => {
		setDialogEstado(true);
		setRunUsuario({ run: data.run, estado: data.estado });
	};

	const confirmarAccion = async () => {
		const { error } = await EstadoUsuario(runUsuario);
		if (!error) {
			setDialogEstado(false);
			toast.success('Estado de usuario actualizado');
		} else {
			setDialogEstado(false);
			toast.error('Error al actualizar el estado del usuario');
		}

		getUsuarios();
	};

	const cerrarConfirmacion = () => {
		setDialogEstado(false);
	};

	const onChangeInput = (data) => {
		if (data.target.value.includes('NaN-')) {
			setValue('run', '');
		}
		setValue('run', FormatRut(data.target.value));
	};

	const onSubmit = async (parms) => {
		const { error } = await ActualizarUsuario(parms);

		if (!error) {
			setDialogEdit(false);
			toast.success('Información actualizada');
		} else {
			setDialogEdit(false);
			toast.error('Error al actualizar la información');
			reset();
		}
		getUsuarios();
	};

	const FindNameEmpresa = (arrayEmp) => {
		if (empresasLoaded) {
			const data = empresa.find((emp) => emp.idEmpresa == arrayEmp);
			return data ? data.nombre : 'Empresa no encontrada';
		}
	};

	useEffect(() => {
		if (rol != null) {
			if (rol != '2') {
				navigate('/dashboard');
			} else {
				verificar();
				getUsuarios();
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
			<Container maxWidth="xxl" style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', paddingTop: 50, paddingLeft: isOpen && !isMobile ? 200 : 0 }}>
				<Container maxWidth="xxl" sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', paddingY: 5, gap: 2, alignItems: 'center' }}>
					<Avatar variant="rounded" sx={{ width: 40, height: 40, bgcolor: '#ed6c02' }}></Avatar>
					<Typography variant="h4">Gestion Usuarios</Typography>
				</Container>
				<Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'row', paddingBottom: 2 }}>
					<Button variant="contained" startIcon={<AddIcon />} color="warning" onClick={() => navigate('/agregar-usuario')}>
						Crear
					</Button>
				</Container>
				<Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>
					{empresasLoaded ? (
						<TableContainer component={Paper}>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}> Nombre Apellido </TableCell>
										<TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}> Rut </TableCell>
										<TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}> Email </TableCell>
										<TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}> Tipo Usuario </TableCell>
										<TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}> Fecha </TableCell>
										<TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}> Empresa </TableCell>
										<TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}> Estado </TableCell>
										<TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}> Acción </TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{dataUser.map((item, index) => (
										<TableRow key={index}>
											<TableCell>
												{item.nombre.charAt(0).toUpperCase() + item.nombre.slice(1).toLowerCase() + ' ' + item.apellido.charAt(0).toUpperCase() + item.apellido.slice(1).toLowerCase()}
											</TableCell>
											<TableCell>{FormatRut(String(item.run))}</TableCell>
											<TableCell>{item.email}</TableCell>
											<TableCell>{item.nombreRol}</TableCell>
											<TableCell>{item.fechaRegistro}</TableCell>
											<TableCell>{FindNameEmpresa(item.idEmpresa)}</TableCell>
											<TableCell>{item.estado == 1 ? <span style={{ color: 'green', fontWeight: 'bold' }}>Activo</span> : <span style={{ color: 'red', fontWeight: 'bold' }}>Inativo</span>}</TableCell>
											<TableCell>
												<Box sx={{ display: 'flex' }}>
													<Button variant="contained" color="warning" onClick={() => editarClick(item)}>
														<EditIcon />
													</Button>
													<Button variant="contained" color={item.estado == 1 ? 'error' : 'success'} sx={{ marginLeft: 2 }} onClick={() => darAltaClick(item)}>
														{item.estado == 1 ? <ArrowCircleDownIcon /> : <ArrowCircleUpIcon />}
													</Button>
												</Box>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					) : (
						<CircularProgress color="warning" />
					)}
				</Container>
			</Container>

			<Dialog open={dialogEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth>
				<DialogTitle>Editar Usuario</DialogTitle>
				<DialogContent>
					<form style={{ display: 'flex', flexDirection: 'column', marginTop: 10 }} onSubmit={handleSubmit(onSubmit)}>
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
							{errors.nombre && (
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
						<FormControl fullWidth>
							<InputLabel id="demo-simple-select-label">Rol</InputLabel>
							<Controller
								name="rol"
								control={control}
								defaultValue=""
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
							{errors.role && (
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
										{dataEmpresa.map((item, index) => (
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

						<TextField fullWidth label="Contraseña" variant="outlined" type="password" {...register('contrasena')}></TextField>
						<Box sx={{ display: 'flex', justifyContent: 'start', minHeight: '2.0em' }}>
							{errors.nombre && (
								<Typography variant="body2" color="error">
									Ingrese Contraseña
								</Typography>
							)}
						</Box>

						<Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, marginTop: 5 }}>
							<Button variant="contained" color="success" type="submit" size="large">
								Editar
							</Button>
							<Button variant="contained" color="error" size="large" onClick={() => setDialogEdit(false)}>
								Cerrar
							</Button>
						</Box>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog open={dialogEstado}>
				<DialogTitle>Confirmación</DialogTitle>
				<DialogContent>
					<DialogContentText>¿Estás seguro de actualizar el estado del usuario?</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={cerrarConfirmacion} color="primary">
						Cancelar
					</Button>
					<Button onClick={confirmarAccion} color="primary">
						Confirmar
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};
