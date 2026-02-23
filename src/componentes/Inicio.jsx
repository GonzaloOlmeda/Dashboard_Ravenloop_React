import React, { useState, useEffect } from 'react';

const Inicio = () => {
  // Estados para los datos de las APIs
  const [usuariosGitlab, setUsuariosGitlab] = useState(null);
  const [servidoresOnline, setServidoresOnline] = useState(null);
  const [usuariosOffice365, setUsuariosOffice365] = useState(null);
  const [usuariosJira, setUsuariosJira] = useState(null);
  const [alertas, setAlertas] = useState([]);
  const [usuario, setUsuario] = useState('USUARIO');
  const [loading, setLoading] = useState(true);

  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const año = fecha.getFullYear();
    return `${dia}/${mes}/${año}`;
  };

  const fetchDatos = async () => {
    try {
      setLoading(true);
      console.log('Iniciando fetch de datos...');
      
      // TODO: Reemplazar con las llamadas reales a las APIs
      // const responseGitlab = await fetch('http://localhost:8080/api/gitlab/usuarios');
      // const dataGitlab = await responseGitlab.json();
      // setUsuariosGitlab(dataGitlab.count);

      // const responseServidores = await fetch('http://localhost:8080/api/servidores/online');
      // const dataServidores = await responseServidores.json();
      // setServidoresOnline(dataServidores.count);

      // const responseOffice = await fetch('http://localhost:8080/api/office365/usuarios');
      // const dataOffice = await responseOffice.json();
      // setUsuariosOffice365(dataOffice.count);

      // const responseJira = await fetch('http://localhost:8080/api/jira/usuarios');
      // const dataJira = await responseJira.json();
      // setUsuariosJira(dataJira.count);

      // Cargar alertas desde el endpoint real
      const responseAlertas = await fetch('http://localhost:8080/api/alertas');
      console.log('Response status:', responseAlertas.status);
      
      if (!responseAlertas.ok) {
        throw new Error(`HTTP error! status: ${responseAlertas.status}`);
      }
      
      const dataAlertas = await responseAlertas.json();
      console.log('Datos recibidos:', dataAlertas);
      
      // Filtrar solo alertas activas y mapear a la estructura que necesita el componente
      const alertasActivas = dataAlertas.content
        .filter(alerta => alerta.activo)
        .map(alerta => ({
          nombre: alerta.servidorNombre || alerta.integracionNombre || 'NO ENCONTRADO',
          categoria: alerta.categoria === 'CRITICA' ? 'CRITICA' : 
                     alerta.categoria === 'ADVERTENCIA' ? 'ADVERTENCIA' : 'INFORMATIVA',
          fecha: formatearFecha(alerta.fechaAlerta),
          tipo: alerta.tipo,
          mensaje: alerta.mensaje
        }));
      
      console.log('Alertas procesadas:', alertasActivas);
      setAlertas(alertasActivas);

    } catch (error) {
      console.error('Error al cargar los datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect para cargar los datos
  useEffect(() => {
    fetchDatos();
  }, []);

  return (
    <div className='min-h-screen bg-gray-950 text-white p-8'>
      {/* Header */}
      <div className='mb-8'>
        <h2 className='text-gray-400 text-lg mb-2'>Inicio</h2>
        <h1 className='text-4xl font-bold'>BIENVENIDO ({usuario.toUpperCase()})</h1>
      </div>

      {/* Grid de tarjetas */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        
        {/* Tarjeta Usuarios GitLab */}
        <div className='bg-cyan-500 rounded-xl p-6 shadow-lg'>
          <h3 className='text-white font-bold text-lg mb-4'>Usuarios GitLab</h3>
          <p className='text-5xl font-bold text-gray-900'>
            {usuariosGitlab !== null ? usuariosGitlab : '--'}
          </p>
        </div>

        {/* Tarjeta Servidores Online */}
        <div className='bg-cyan-500 rounded-xl p-6 shadow-lg'>
          <h3 className='text-white font-bold text-lg mb-4'>Servidores Online</h3>
          <p className='text-5xl font-bold text-gray-900'>
            {servidoresOnline !== null ? String(servidoresOnline).padStart(2, '0') : '--'}
          </p>
        </div>

        {/* Tarjeta Usuarios Office 365 */}
        <div className='bg-cyan-500 rounded-xl p-6 shadow-lg'>
          <h3 className='text-white font-bold text-lg mb-4'>Usuarios Office 365</h3>
          <p className='text-5xl font-bold text-gray-900'>
            {usuariosOffice365 !== null ? usuariosOffice365 : '--'}
          </p>
        </div>

        {/* Tarjeta USUARIOS JIRA */}
        <div className='bg-cyan-500 rounded-xl p-6 shadow-lg'>
          <h3 className='text-white font-bold text-lg mb-4'>USUARIOS JIRA</h3>
          <p className='text-5xl font-bold text-gray-900'>
            {usuariosJira !== null ? usuariosJira : '--'}
          </p>
        </div>

        {/* Tarjeta Alertas con tabla */}
        <div className='bg-cyan-500 rounded-xl p-6 shadow-lg md:col-span-2'>
          <div className='mb-4'>
            <h3 className='text-white font-bold text-lg mb-2'>Alertas</h3>
            <p className='text-5xl font-bold text-gray-900'>
              {alertas.length > 0 ? String(alertas.length).padStart(2, '0') : '--'}
            </p>
          </div>
          
          {/* Tabla de alertas */}
          {alertas.length > 0 && (
            <div className='mt-6'>
              <table className='w-full text-left'>
                <thead>
                  <tr className='border-b border-cyan-400'>
                    <th className='pb-2 font-bold text-white'>Nombre</th>
                    <th className='pb-2 font-bold text-white'>Categoría</th>
                    <th className='pb-2 font-bold text-white'>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {alertas.map((alerta, index) => (
                    <tr key={index} className='border-b border-cyan-400/30'>
                      <td className='py-2 text-white'>{alerta.nombre}</td>
                      <td className='py-2'>
                        <span className={`px-2 py-1 rounded text-sm ${
                          alerta.categoria === 'CRITICA' ? 'text-red-500 font-bold' : 'text-yellow-500 font-bold'
                        }`}>
                          {alerta.categoria}
                        </span>
                      </td>
                      <td className='py-2 text-white'>{alerta.fecha}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inicio;
