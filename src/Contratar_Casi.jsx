import { useContext, useEffect, useState } from 'react';
import { NavBar } from './components/Navbar/NavBar.jsx';
import { DrawerContext } from './components/Provider/Provider.jsx';
import { Autocomplete, Container, useMediaQuery, TextField, Button, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { motion } from 'framer-motion';
import { VerificarToken } from './functions/VerificarToken.jsx';
import { Toaster, toast } from 'sonner';
import DeleteIcon from '@mui/icons-material/Delete';
export const Contratar = () => {
	const { isOpen, setIsOpen } = useContext(DrawerContext);
	const isMobile = useMediaQuery('(max-width:600px)');
	const name = localStorage.getItem('usuario').split(' ')[0] + ' ' + localStorage.getItem('usuario').split(' ')[1];
	const verificar = VerificarToken();

	const containerVariants = {
		hidden: { opacity: 0, y: 50 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
	};

	const servicios = [
		{ label: 'EVAL-ASSIST', id: 1, precioBase: 100000 },
		{ label: 'Sistema de ticket', id: 2, precioBase: 200000 },
		{ label: 'Portal Evaluadores', id: 3, precioBase: 300000 },
	];

	const serviciosDerivados = [
		{ label: 'Portal Planificación', id: 1, idSer: 1, precioCantidad: 100000 },
		{ label: 'Portal Digitación', id: 2, idSer: 1, precioCantidad: 500000 },
		{ label: 'Portal Generación de informes', id: 3, idSer: 1, precioCantidad: 700000 },
		{ label: 'Portal de Cotizaciones', id: 4, idSer: 1, precioCantidad: 10000 },
		{ label: 'Portal de Estados de pago', id: 5, idSer: 1, precioCantidad: 50000 },
	];

	const [selectedService, setSelectedService] = useState(null);
	const [selectedSubService, setSelectedSubService] = useState(null);
	const [subServices, setSubServices] = useState([]);
	const [tableData, setTableData] = useState([]);
	const [total, setTotal] = useState(0);

	const handleAdd = () => {
		if (selectedService && selectedSubService) {
			const precioTotal = selectedService.precioBase + selectedSubService.precioCantidad;

			const isSubServiceExists = tableData.some((row) => row.subServicio === selectedSubService.label);

			if (!isSubServiceExists) {
				setTableData((prevData) => [
					...prevData,
					{
						servicio: selectedService.label,
						subServicio: selectedSubService.label,
						precioBase: selectedService.precioBase,
						precioCantidad: selectedSubService.precioCantidad,
						precioTotal: selectedSubService.precioCantidad + selectedService.precioBase,
					},
				]);
				setTotal((prevTotal) => prevTotal + precioTotal);
			} else {
				toast.warning('El sub servicio ya existe en la tabla');
			}
		}
	};

	const handleDelete = (indexToDelete) => {
		const priceToDelete = tableData[indexToDelete].precioTotal;
		setTableData((prevData) => prevData.filter((row, index) => index !== indexToDelete));
		setTotal((prevTotal) => prevTotal - priceToDelete);
	};

	useEffect(() => {
		verificar(setIsOpen);
		if (selectedService) {
			setSelectedSubService(null);
			setSubServices(serviciosDerivados.filter((service) => service.idSer === selectedService.id));
		} else {
			setSubServices([]);
		}
	}, [verificar, selectedService]);

	return (
		<>
			<Toaster richColors />
			<NavBar name={name} />
			<motion.div initial="hidden" animate="visible" variants={containerVariants}>
				<Container maxWidth="xxl" style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', paddingTop: 50, paddingLeft: isOpen && !isMobile ? 200 : 0 }}>
					<Container
						maxWidth="xl"
						sx={{
							display: 'flex',
							justifyContent: 'center',
							flexDirection: 'column',
							gap: 3,
							paddingY: 5,
						}}
					>
						<Autocomplete
							disablePortal
							options={servicios}
							isOptio0nEqualToValue={(option, value) => option.id === value.id}
							onChange={(event, newValue) => setSelectedService(newValue)}
							fullWidth
							renderInput={(params) => <TextField {...params} label="Servicio" />}
						/>

						<Autocomplete
							disablePortal
							options={subServices}
							isOptionEqualToValue={(option, value) => option.id === value.id}
							value={selectedSubService}
							noOptionsText="No hay sub servicios disponibles"
							onChange={(event, newValue) => setSelectedSubService(newValue)}
							fullWidth
							renderInput={(params) => <TextField {...params} label="Sub Servicio" />}
						/>
						<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
							<Button variant="contained" color="warning" onClick={handleAdd}>
								Agregar
							</Button>
						</Box>
					</Container>

					<Container
						maxWidth="xl"
						sx={{
							display: 'flex',
							justifyContent: 'center',
							flexDirection: 'column',
							gap: 3,
						}}
					>
						<TableContainer>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell> SERVICIO </TableCell>
										<TableCell> SUB SERVICIO </TableCell>
										<TableCell> PRECIO BASE </TableCell>
										<TableCell> PRECIO POR CANTIDAD </TableCell>
										<TableCell> PRECIO TOTAL </TableCell>
										<TableCell> ELIMINAR </TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{tableData.map((row, index) => (
										<TableRow key={index}>
											<TableCell>{row.servicio}</TableCell>
											<TableCell>{row.subServicio}</TableCell>
											<TableCell>{row.precioBase.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</TableCell>
											<TableCell>{row.precioCantidad.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</TableCell>
											<TableCell>{row.precioTotal.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</TableCell>
											<TableCell>
												<Button onClick={() => handleDelete(index)}>
													<DeleteIcon color="error" />
												</Button>
											</TableCell>
										</TableRow>
									))}
									<TableRow>
										<TableCell align="center" colSpan={5} style={{ fontWeight: 'bold' }}>
											TOTAL
										</TableCell>
										<TableCell>{total.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</TableContainer>
					</Container>
				</Container>
			</motion.div>
		</>
	);
};
