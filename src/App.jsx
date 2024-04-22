import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './Login';
import { Olvidar } from './Olvidar';
import { Dashboard } from './Dashboard';
import { Contratar } from './Contratar';
import { Cuenta } from './Cuenta';
import { GestionUsuario } from './SuperUser/GestionUsuario';
import { GestionEmpresa } from './SuperUser/GestionEmpresa';
import { AgregarEmpresa } from './SuperUser/AgregarEmpresa';
import { AgregarUsuario } from './SuperUser/AgregarUsuario';

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="*" element={<Login />} />
				<Route path="/" element={<Login />} />
				<Route path="/recuperar-password" element={<Olvidar />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/contratar" element={<Contratar />} />
				<Route path="/mi-cuenta" element={<Cuenta />} />
				<Route path="/gestion-usuario" element={<GestionUsuario />} />
				<Route path="/gestion-empresa" element={<GestionEmpresa />} />
				<Route path="/agregar-empresa" element={<AgregarEmpresa />} />
				<Route path="/agregar-usuario" element={<AgregarUsuario />} />
			</Routes>
		</BrowserRouter>
	);
}
