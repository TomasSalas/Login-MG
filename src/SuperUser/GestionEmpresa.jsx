import {
	Container,
	useMediaQuery,
	Typography,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Paper,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	TextField,
	Box,
	DialogContentText,
	DialogActions,
	Avatar,
	CircularProgress,
} from '@mui/material';
import { useEffect, useContext, useState } from 'react';
import { VerificarToken } from '../functions/VerificarToken';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../components/Navbar/NavBar';
import { DrawerContext } from '../components/Provider/Provider';
import { GetEmpresas } from '../functions/GetEmpresas';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import EditIcon from '@mui/icons-material/Edit';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { ActualizarDatosEmpresa } from '../functions/ActualizarDatosEmpresa';
import { Toaster, toast } from 'sonner';
import { FormatRut } from '../helpers/FormatRut';
import { EstadoEmpresa } from '../functions/EstadoEmpresa';
import AddIcon from '@mui/icons-material/Add';
import LocationCityIcon from '@mui/icons-material/LocationCity';

export const GestionEmpresa = () => {
	const rol = localStorage.getItem('rol');
	const navigate = useNavigate();
	const name = localStorage.getItem('usuario').split(' ')[0] + ' ' + localStorage.getItem('usuario').split(' ')[1];
	const { isOpen, setIsOpen } = useContext(DrawerContext);
	const isMobile = useMediaQuery('(max-width:600px)');
	const [empresa, setEmpresa] = useState([]);
	const [dialogEdit, setDialogEdit] = useState(false);
	const [dialogEstado, setDialogEstado] = useState(false);
	const [idEmpresa, setIdEmpresa] = useState({});
	const verificar = VerificarToken(setIsOpen);
	const [empresasLoaded, setEmpresasLoaded] = useState(false);
	const {
		register,
		handleSubmit,
		setValue,
		reset,
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

	const Empresas = async () => {
		const { data } = await GetEmpresas();
		setEmpresa(data);
		setTimeout(() => {
			setEmpresasLoaded(true);
		}, 1000);
	};

	const onChangeInput = (data) => {
		if (data.target.value.includes('NaN-')) {
			setValue('rut', '');
		}
		setValue('rut', FormatRut(data.target.value));
	};

	const onSubmit = async (parms) => {
		const { error } = await ActualizarDatosEmpresa(parms, idEmpresa);
		if (!error) {
			setDialogEdit(false);
			reset();
			toast.success('Información actualizada');
		} else {
			setDialogEdit(false);
			reset();
			toast.error('Error al actualizar la información');
		}
		Empresas();
	};

	const editarClick = async (data) => {
		setValue('nombre', data.nombre);
		setValue('rut', FormatRut(String(data.rut)));
		setValue('direccion', data.direccion);
		setValue('email', data.email);
		setValue('telefono', data.telefono);
		setIdEmpresa(data.idEmpresa);
		setDialogEdit(true);
	};

	const darAltaClick = async (data) => {
		setDialogEstado(true);
		setIdEmpresa({ idEmpresa: data.idEmpresa, estado: data.estado });
	};

	const confirmarAccion = async () => {
		const { error } = await EstadoEmpresa(idEmpresa);

		if (!error) {
			setDialogEstado(false);
			toast.success('Estado de empresa actualizado');
		} else {
			setDialogEstado(false);
			toast.error('Error al actualizar el estado de la empresa');
		}

		cerrarConfirmacion();
		Empresas();
	};

	const cerrarConfirmacion = () => {
		setDialogEstado(false);
	};

	useEffect(() => {
		if (rol != null) {
			if (rol != '2') {
				navigate('/dashboard');
			} else {
				verificar();
				Empresas();
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
						<Typography variant="h4">Gestion Empresa</Typography>
					</Container>
					<Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'row', paddingBottom: 2 }}>
						<Button variant="contained" startIcon={<AddIcon />} color="warning" onClick={() => navigate('/agregar-empresa')}>
							Crear
						</Button>
					</Container>
					<Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>
						{empresasLoaded ? (
							<TableContainer component={Paper}>
								<Table>
									<TableHead>
										<TableRow>
											<TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Nombre </TableCell>
											<TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Rut </TableCell>
											<TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Dirección </TableCell>
											<TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Correo </TableCell>
											<TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Telefono </TableCell>
											<TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Estado </TableCell>
											<TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Acciones</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{empresa.map((item, index) => (
											<TableRow key={index}>
												<TableCell>{item.nombre}</TableCell>
												<TableCell>{FormatRut(String(item.rut))}</TableCell>
												<TableCell>{item.direccion}</TableCell>
												<TableCell>{item.email}</TableCell>
												<TableCell>{item.telefono ? item.telefono : '-'}</TableCell>
												<TableCell>
													{item.estado == 1 ? <span style={{ color: 'green', fontWeight: 'bold' }}>Activa</span> : <span style={{ color: 'red', fontWeight: 'bold' }}>Inativa</span>}
												</TableCell>
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
					<DialogTitle>Editar Empresa</DialogTitle>
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
							<TextField fullWidth label="Telefono" variant="outlined" {...register('telefono', { required: true })}></TextField>
							<Box sx={{ display: 'flex', justifyContent: 'start', minHeight: '2.0em' }}>
								{errors.telefono && (
									<Typography variant="body2" color="error">
										Ingrese Telefono
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
						<DialogContentText>¿Estás seguro de actualizar el estado de la empresa?</DialogContentText>
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
			</motion.div>
		</>
	);
};
