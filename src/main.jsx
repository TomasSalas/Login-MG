import { createRoot } from 'react-dom/client';
import App from './App';
import '@fontsource/montserrat/300.css';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/700.css';
import './assets/style.css';
import { DrawerProvider } from './components/Provider/Provider.jsx';
import { LoginProvider } from './components/Provider/ProviderLogin.jsx';

createRoot(document.getElementById('root')).render(
	<DrawerProvider>
		<LoginProvider>
			<App />
		</LoginProvider>
	</DrawerProvider>,
);
