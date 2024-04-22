import { Container, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const Contratar = () => {
	const containerVariants = {
		hidden: { opacity: 0, y: 50 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
	};

	const navigate = useNavigate();
	return (
		<>
			<motion.div initial="hidden" animate="visible" variants={containerVariants}>
				<Container maxWidth="xxl" className="ContainerProximamente" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
					<Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
						<Typography variant="h1" sx={{ fontWeight: 'bold' }}>
							Proximamente
						</Typography>
						<Typography variant="h4" sx={{ fontWeight: 'bold', paddingTop: 5 }}>
							¡Pronto tendremos novedades
						</Typography>
						<Typography variant="h4" sx={{ fontWeight: 'bold' }}>
							de las nuevas funcionalidades del sistema!
						</Typography>
						<Button
							variant="contained"
							size="large"
							color="warning"
							sx={{ marginTop: 10, width: '20%' }}
							onClick={() => {
								navigate('/dashboard');
							}}
						>
							Volver
						</Button>
					</Container>
				</Container>
			</motion.div>
		</>
	);
};
