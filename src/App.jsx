import { useState } from 'react';
import './App.css'
import Sidebar from './componentes/sidebar';
import Inicio from './componentes/Inicio';

function App() {
  const [vistaActual, setVistaActual] = useState('Inicio');

  const renderizarContenido = () => {
    switch(vistaActual) {
      case 'Inicio':
        return <Inicio />;
      case 'Usuarios':
        return <div className='p-8 text-white'><h1 className='text-3xl'>Usuarios</h1></div>;
      case 'Alertas':
        return <div className='p-8 text-white'><h1 className='text-3xl'>Alertas</h1></div>;
      case 'Infraestructura':
        return <div className='p-8 text-white'><h1 className='text-3xl'>Infraestructura</h1></div>;
      default:
        return <Inicio />;
    }
  };

  return (
     <div className="flex">
      <Sidebar cambiarVista={setVistaActual} vistaActual={vistaActual} />
      <div className="flex-1 min-h-screen bg-gray-950">
        {renderizarContenido()}
      </div>
     </div>
  );
}

export default App
