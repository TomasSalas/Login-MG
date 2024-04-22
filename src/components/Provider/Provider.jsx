/* eslint-disable react/prop-types */
import React, { useState } from 'react';

export const DrawerContext = React.createContext();

export function DrawerProvider({ children }) {
	const [isOpen, setIsOpen] = useState(true);

	const handleDrawerOpenPro = () => {
		setIsOpen(!isOpen);
	};

	return <DrawerContext.Provider value={{ isOpen, handleDrawerOpenPro, setIsOpen }}>{children}</DrawerContext.Provider>;
}
