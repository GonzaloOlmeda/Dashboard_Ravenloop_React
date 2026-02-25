import { useEffect, useState, useCallback } from "react";

export default function Alertas() {

 
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState("todos");
    const [busqueda, setBusqueda] = useState("");
    const [alertaEditando, setAlertaEditando] = useState(null);
    const [alertas, setAlertas] = useState([]);
    const [paginaActual, setPaginaActual] = useState(0);
    const [fechaBusqueda, setFechaBusqueda] = useState("");


    const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const año = fecha.getFullYear();
    return `${dia}/${mes}/${año}`;
  };


  const fetchAlertas = useCallback(async (fechaFiltro = null) => {
    try {
        setLoading(true);
        console.log('Iniciando fetch de alertas...');

        // Construir URL según si hay fecha o no
        let url = 'http://localhost:8080/api/alertas';
        if (fechaFiltro) {
            url = `http://localhost:8080/api/alertas/fecha?fecha=${fechaFiltro}`;
            console.log('Buscando por fecha:', fechaFiltro);
        }

        const response = await fetch(url);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const dataAlertas = await response.json();
        console.log('Datos recibidos:', dataAlertas);

        // Filtrar solo alertas activas y mapear a la estructura que necesita el componente
        const alertasActivas = dataAlertas.content
            .filter(alerta => alerta.activo)
            .map(alerta => ({
                id: alerta.id,
                nombre: alerta.servidorNombre || alerta.integracionNombre || 'NO ENCONTRADO',
                categoria: alerta.categoria,
                fecha: formatearFecha(alerta.fechaAlerta),
                tipo: alerta.tipo,
                mensaje: alerta.mensaje,
                activo: alerta.activo,
                integracionId: alerta.integracionId || 0,
                servidorNombre: alerta.servidorNombre || '',
                revisado: false
            }));
      
        console.log('Alertas procesadas:', alertasActivas);
        setAlertas(alertasActivas);

    } catch (error) {
        console.error('Error al cargar alertas:', error);
    } finally {
        setLoading(false);
    }
  }, []);

  
  useEffect(() => {
      fetchAlertas();
  }, [fetchAlertas]);

  // Función para buscar por fecha
  const buscarPorFecha = () => {
    if (fechaBusqueda) {
      // Convertir fecha de YYYY-MM-DD a YYYY/MM/DD
      const fechaFormateada = fechaBusqueda.replace(/-/g, '/');
      fetchAlertas(fechaFormateada);
      setPaginaActual(0); // Resetear a primera página
    } else {
      fetchAlertas(); // Si no hay fecha, traer todas
    }
  };

  // Función para limpiar búsqueda por fecha
  const limpiarFecha = () => {
    setFechaBusqueda("");
    fetchAlertas();
    setPaginaActual(0);
  };

  // Función para marcar la alerta como inactiva en la BD
  const toggleRevisado = async (alertaId) => {
    try {
      // Buscar la alerta actual para enviar todos sus datos
      const alertaActual = alertas.find(a => a.id === alertaId);
      if (!alertaActual) return;

      // Primero actualizar el estado local para mostrar el check
      setAlertas(prev =>
        prev.map(a => a.id === alertaId ? { ...a, revisado: true } : a)
      );

      // Esperar 800ms para que se vea el check
      await new Promise(resolve => setTimeout(resolve, 400));

      // Preparar el objeto con la estructura que requiere el backend
      const alertaActualizada = {
        categoria: alertaActual.categoria,
        tipo: alertaActual.tipo,
        mensaje: alertaActual.mensaje,
        integracionId: alertaActual.integracionId,
        servidorNombre: alertaActual.servidorNombre,
        activo: false
      };

      const response = await fetch(`http://localhost:8080/api/alertas/${alertaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alertaActualizada),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      console.log(`Alerta ${alertaId} desactivada exitosamente`);
      
      // Actualizar el estado local - remover de la lista
      setAlertas(prev => prev.filter(alerta => alerta.id !== alertaId));
      
    } catch (error) {
      console.error('Error al desactivar la alerta:', error);
    }
  };

    const alertasFiltradas = alertas.filter(a => {
        const coincideFiltro = filtro === "todos" || a.categoria === filtro;
        const coincideBusqueda =
            a.tipo.toLowerCase().includes(busqueda.toLowerCase()) ||
            a.mensaje.toLowerCase().includes(busqueda.toLowerCase()) ||
            a.nombre.toLowerCase().includes(busqueda.toLowerCase());
        return coincideFiltro && coincideBusqueda;
    });

    // -----------------------------
    // PAGINACIÓN
    // -----------------------------
   
    const elementosPorPagina = 5;

    const totalPaginas = Math.ceil(alertasFiltradas.length / elementosPorPagina);

    const alertasPaginadas = alertasFiltradas.slice(
        paginaActual * elementosPorPagina,
        paginaActual * elementosPorPagina + elementosPorPagina
    );

  
    const guardarEdicion = async () => {
        try {
            // Preparar el objeto con la estructura que requiere el backend
            const alertaActualizada = {
                categoria: alertaEditando.categoria,
                tipo: alertaEditando.tipo,
                mensaje: alertaEditando.mensaje,
                integracionId: alertaEditando.integracionId,
                servidorNombre: alertaEditando.servidorNombre,
                activo: alertaEditando.activo
            };

            const response = await fetch(`http://localhost:8080/api/alertas/${alertaEditando.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(alertaActualizada),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log(`Alerta ${alertaEditando.id} actualizada exitosamente`);

            // Actualizar el estado local
            setAlertas(prev =>
                prev.map(a => (a.id === alertaEditando.id ? alertaEditando : a))
            );
            setAlertaEditando(null);

        } catch (error) {
            console.error('Error al actualizar la alerta:', error);
        }
    };

   
    return (
        <div className="p-8 text-white">

            {/* TÍTULO */}
            <h2 className='text-gray-400 text-lg mb-6'>Alertas / Eventos</h2>

            {loading ? (
                <div className="text-center py-8">
                    <p className="text-gray-400">Cargando alertas...</p>
                </div>
            ) : (
                <>
                    {/* FILTROS */}
                    <div className="flex gap-4 mb-6">
                        <button onClick={() => setFiltro("CRITICA")} className="px-4 py-2 rounded-md bg-[#61B1CE] font-bold">Crítica</button>
                        <button onClick={() => setFiltro("ADVERTENCIA")} className="px-4 py-2 rounded-md bg-[#61B1CE] font-bold">Advertencia</button>
                        <button onClick={() => setFiltro("INFORMATIVA")} className="px-4 py-2 rounded-md bg-[#61B1CE] font-bold">Informativa</button>
                        <button onClick={() => setFiltro("todos")} className="px-4 py-2 rounded-md bg-[#11A8FF] font-bold">Todos</button>
                    </div>

            {/* BUSCADOR */}
            <input
                type="text"
                placeholder="Buscar alertas..."
                className="w-full p-3 rounded-md bg-[#61B1CE] text-white placeholder-white mb-4"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
            />

            {/* BÚSQUEDA POR FECHA */}
            <div className="flex gap-3 mb-6">
                <input
                    type="date"
                    className="flex-1 p-3 rounded-md bg-[#61B1CE] text-white [color-scheme:dark]"
                    value={fechaBusqueda}
                    onChange={(e) => setFechaBusqueda(e.target.value)}
                />
                <button 
                    onClick={buscarPorFecha}
                    className="px-6 py-3 rounded-md bg-green-500 font-bold hover:bg-green-600 transition"
                >
                    Buscar por Fecha
                </button>
                <button 
                    onClick={limpiarFecha}
                    className="px-6 py-3 rounded-md bg-red-500 font-bold hover:bg-red-600 transition"
                >
                    Limpiar
                </button>
            </div>

            {/* TABLA */}
            <div className="overflow-x-auto">
                <table className="w-full text-left rounded-lg overflow-hidden">

                    {/* CABECERA */}
                    <thead className="bg-[#61B1CE] text-white">
                        <tr>
                            <th className="p-3">Categoría</th>
                            <th className="p-3">Tipo</th>
                            <th className="p-3">Mensaje</th>
                            <th className="p-3">Sistema/Servidor</th>
                            <th className="p-3">Fecha</th>
                            <th className="p-3">Revisado</th>
                            <th className="p-3">Acciones</th>
                        </tr>
                    </thead>

                    {/* FILAS */}
                    <tbody>
                        {alertasPaginadas.map((a, index) => (
                            <tr key={index} className="bg-[#11A8FF] border-b border-white/20 text-white">
                                <td className="p-3">{a.categoria}</td>
                                <td className="p-3">{a.tipo}</td>
                                <td className="p-3">{a.mensaje}</td>
                                <td className="p-3">{a.nombre}</td>
                                <td className="p-3">{a.fecha}</td>

                                {/* CHECKBOX REVISADO */}
                                <td className="p-3">
                                    <input
                                        type="checkbox"
                                        checked={a.revisado}
                                        onChange={() => toggleRevisado(a.id)}
                                        className="w-6 h-6 accent-green-500 cursor-pointer"
                                        disabled={a.revisado}
                                    />
                                </td>

                                {/* BOTÓN EDITAR */}
                                <td className="p-3">
                                    <button
                                        onClick={() => setAlertaEditando(a)}
                                        className="px-3 py-1 bg-[#61B1CE] rounded-md font-bold"
                                    >
                                        Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

            {/* PAGINACIÓN NUEVA */}
            <div className="flex justify-between items-center mt-6">
                <p className="text-gray-400">
                    Página {paginaActual + 1} de {totalPaginas}
                </p>

                <div className="flex gap-3">

                    {/* ANTERIOR */}
                    <button
                        onClick={() => setPaginaActual(prev => Math.max(0, prev - 1))}
                        disabled={paginaActual === 0}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-[#11A8FF] text-white hover:bg-blue-600 transition disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>

                    {/* SIGUIENTE */}
                    <button
                        onClick={() => setPaginaActual(prev => Math.min(totalPaginas - 1, prev + 1))}
                        disabled={paginaActual >= totalPaginas - 1}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-[#11A8FF] text-white hover:bg-blue-600 transition disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>

                </div>
            </div>

            </>
            )}

            {/* MODAL DE EDICIÓN */}
            {alertaEditando && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
                    <div className="bg-[#11A8FF] p-6 rounded-lg w-96 shadow-xl">

                        <h2 className="text-2xl font-bold mb-4">Editar alerta</h2>

                        <label className="block mb-2">Categoría</label>
                        <select
                            className="w-full p-2 rounded bg-[#61B1CE] mb-4 text-white"
                            value={alertaEditando.categoria}
                            onChange={(e) =>
                                setAlertaEditando({ ...alertaEditando, categoria: e.target.value })
                            }
                        >
                            <option value="CRITICA">CRITICA</option>
                            <option value="ADVERTENCIA">ADVERTENCIA</option>
                            <option value="INFORMATIVA">INFORMATIVA</option>
                        </select>

                        <label className="block mb-2">Tipo</label>
                        <input
                            className="w-full p-2 rounded bg-[#61B1CE] mb-4"
                            value={alertaEditando.tipo}
                            onChange={(e) =>
                                setAlertaEditando({ ...alertaEditando, tipo: e.target.value })
                            }
                        />

                        <label className="block mb-2">Mensaje</label>
                        <input
                            className="w-full p-2 rounded bg-[#61B1CE] mb-4"
                            value={alertaEditando.mensaje}
                            onChange={(e) =>
                                setAlertaEditando({ ...alertaEditando, mensaje: e.target.value })
                            }
                        />

                        <label className="block mb-2">Sistema/Servidor</label>
                        <input
                            className="w-full p-2 rounded bg-[#61B1CE] mb-4"
                            value={alertaEditando.servidorNombre}
                            onChange={(e) =>
                                setAlertaEditando({ 
                                    ...alertaEditando, 
                                    servidorNombre: e.target.value,
                                    nombre: e.target.value 
                                })
                            }
                        />

                        {/* BOTONES */}
                        <div className="flex justify-end gap-4 mt-4">
                            <button
                                onClick={() => setAlertaEditando(null)}
                                className="px-4 py-2 bg-gray-700 rounded-md"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={guardarEdicion}
                                className="px-4 py-2 bg-green-500 rounded-md font-bold"
                            >
                                Guardar
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
