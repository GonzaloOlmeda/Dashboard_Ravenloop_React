import { useEffect, useState, useCallback } from "react";

export default function Alertas() {

    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState("todos");
    const [alertas, setAlertas] = useState([]);
    const [alertaEditando, setAlertaEditando] = useState(null);
    const [alertaNueva, setAlertaNueva] = useState(null);
    const [paginaActual, setPaginaActual] = useState(0);
    const [fechaBusqueda, setFechaBusqueda] = useState("");
    const [servidores, setServidores] = useState([]);

    const formatearFecha = (fechaISO) => {
        const fecha = new Date(fechaISO);
        return fecha.toLocaleDateString("es-ES");
    };

    // SERVIDORES
    const fetchServidores = useCallback(async () => {
        try {
            const response = await fetch("http://localhost:8080/api/infraestructura/servidores");
            if (!response.ok) throw new Error("Error al cargar servidores");
            const data = await response.json();
            const lista = Array.isArray(data) ? data : data.content ?? [];
            setServidores(lista);
        } catch (err) {
            console.error("Error servidores:", err);
            setServidores([]);
        }
    }, []);

    // ALERTAS
    const fetchAlertas = useCallback(async (fechaFiltro = null) => {
        try {
            setLoading(true);

            let url = "http://localhost:8080/api/alertas";
            if (fechaFiltro) url = `http://localhost:8080/api/alertas/fecha?fecha=${fechaFiltro}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error("Error al cargar alertas");

            const data = await response.json();

            const alertasActivas = data.content
                .filter(a => a.activo)
                .map(a => ({
                    id: a.id,
                    categoria: a.categoria,
                    tipo: a.tipo,
                    mensaje: a.mensaje,
                    servidorNombre: a.servidorNombre || a.integracionNombre || "NO ENCONTRADO",
                    fecha: formatearFecha(a.fechaAlerta),
                    revisado: false
                }));

            setAlertas(alertasActivas);

        } catch (err) {
            console.error("Error alertas:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAlertas();
        fetchServidores();
    }, [fetchAlertas, fetchServidores]);

    // BUSCAR POR FECHA
    const buscarPorFecha = () => {
        if (!fechaBusqueda) return fetchAlertas();
        fetchAlertas(fechaBusqueda.replace(/-/g, "/"));
        setPaginaActual(0);
    };

    const limpiarFecha = () => {
        setFechaBusqueda("");
        fetchAlertas();
        setPaginaActual(0);
    };

    // CREAR ALERTA
    const guardarNuevaAlerta = async () => {
        try {
            const nueva = {
                categoria: alertaNueva.categoria,
                tipo: alertaNueva.tipo,
                mensaje: alertaNueva.mensaje,
                servidorNombre: alertaNueva.servidorNombre,
                fechaAlerta: alertaNueva.fecha,
                activo: true
            };

            const response = await fetch("http://localhost:8080/api/alertas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nueva)
            });

            if (!response.ok) throw new Error("Error al crear alerta");

            const data = await response.json();

            setAlertas(prev => [
                ...prev,
                {
                    id: data.id,
                    categoria: data.categoria,
                    tipo: data.tipo,
                    mensaje: data.mensaje,
                    servidorNombre: data.servidorNombre,
                    fecha: formatearFecha(data.fechaAlerta),
                    revisado: false
                }
            ]);

            setAlertaNueva(null);

        } catch (err) {
            console.error("Error creando alerta:", err);
        }
    };

    // EDITAR ALERTA
    const guardarEdicion = async () => {
        try {
            const alertaActualizada = {
                categoria: alertaEditando.categoria,
                tipo: alertaEditando.tipo,
                mensaje: alertaEditando.mensaje,
                servidorNombre: alertaEditando.servidorNombre,
                activo: true
            };

            const response = await fetch(`http://localhost:8080/api/alertas/${alertaEditando.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(alertaActualizada)
            });

            if (!response.ok) throw new Error("Error al editar alerta");

            setAlertas(prev =>
                prev.map(a => (a.id === alertaEditando.id ? alertaEditando : a))
            );

            setAlertaEditando(null);

        } catch (err) {
            console.error("Error editando alerta:", err);
        }
    };

    // PAGINACIÓN
    const elementosPorPagina = 5;
    const totalPaginas = Math.ceil(alertas.length / elementosPorPagina);
    const alertasPaginadas = alertas.slice(
        paginaActual * elementosPorPagina,
        paginaActual * elementosPorPagina + elementosPorPagina
    );

    return (
    <div className="p-8 text-white">

        <h2 className="text-gray-400 text-lg mb-6">Alertas / Eventos</h2>

        {loading ? (
            <p className="text-center text-gray-400">Cargando alertas...</p>
        ) : (
            <>

                {/* FILTROS + FECHA */}
                <div className="flex justify-between items-center mb-6">

                    {/* FILTROS */}
                    <div className="flex gap-4">
                        <button onClick={() => setFiltro("CRITICA")} className="px-4 py-2 rounded-md bg-[#11A8FF] font-bold">Crítica</button>
                        <button onClick={() => setFiltro("ADVERTENCIA")} className="px-4 py-2 rounded-md bg-[#11A8FF] font-bold">Advertencia</button>
                        <button onClick={() => setFiltro("INFORMATIVA")} className="px-4 py-2 rounded-md bg-[#11A8FF] font-bold">Informativa</button>
                        <button onClick={() => setFiltro("todos")} className="px-4 py-2 rounded-md bg-[#11A8FF] font-bold">Todos</button>
                    </div>

                    {/* FECHA */}
                    <div className="flex items-center gap-4">
                        <input
                            type="date"
                            value={fechaBusqueda}
                            onChange={(e) => setFechaBusqueda(e.target.value)}
                            className="p-3 rounded-md bg-[#11A8FF] text-white font-bold [color-scheme:dark]"
                        />

                        <button onClick={buscarPorFecha} className="px-4 py-2 rounded-md bg-[#11A8FF] font-bold">
                            Buscar por fecha
                        </button>

                        <button onClick={limpiarFecha} className="px-4 py-2 rounded-md bg-[#11A8FF] font-bold">
                            Limpiar
                        </button>
                    </div>

                </div>

                {/* CREAR ALERTA */}
                <button
                    onClick={() =>
                        setAlertaNueva({
                            categoria: "",
                            tipo: "",
                            mensaje: "",
                            servidorNombre: "",
                            fecha: ""
                        })
                    }
                    className="px-4 py-2 mb-6 bg-[#11A8FF] rounded-md font-bold"
                >
                    Crear alerta
                </button>

                {/* TABLA */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left rounded-lg overflow-hidden">

                        <thead className="bg-[#61B1CE] text-white">
                            <tr>
                                <th className="p-3">Categoría</th>
                                <th className="p-3">Tipo</th>
                                <th className="p-3">Mensaje</th>
                                <th className="p-3">Sistema/Servidor</th>
                                <th className="p-3">Fecha</th>
                                <th className="p-3">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {alertasPaginadas.map((a) => (
                                <tr key={a.id} className="bg-[#11A8FF] border-b border-white/20 text-white">
                                    <td className="p-3">{a.categoria}</td>
                                    <td className="p-3">{a.tipo}</td>
                                    <td className="p-3">{a.mensaje}</td>
                                    <td className="p-3">{a.servidorNombre}</td>
                                    <td className="p-3">{a.fecha}</td>

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

                {/* PAGINACIÓN */}
                <div className="flex justify-between items-center mt-6">
    <p className="text-gray-400">
        Página {paginaActual + 1} de {totalPaginas}
    </p>

    <div className="flex gap-3">
        <button
            onClick={() => setPaginaActual(prev => Math.max(0, prev - 1))}
            disabled={paginaActual === 0}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#11A8FF] text-white hover:bg-blue-600 transition disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
        </button>

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

        {/* MODAL CREAR ALERTA */}
        {alertaNueva && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
                <div className="bg-[#11A8FF] p-6 rounded-lg w-96 shadow-xl">

                    <h2 className="text-2xl font-bold mb-4">Crear nueva alerta</h2>

                    <label className="block mb-2">Categoría</label>
                    <input
                        className="w-full p-2 rounded bg-[#61B1CE] mb-4"
                        value={alertaNueva.categoria}
                        onChange={(e) => setAlertaNueva({ ...alertaNueva, categoria: e.target.value })}
                    />

                    <label className="block mb-2">Tipo</label>
                    <input
                        className="w-full p-2 rounded bg-[#61B1CE] mb-4"
                        value={alertaNueva.tipo}
                        onChange={(e) => setAlertaNueva({ ...alertaNueva, tipo: e.target.value })}
                    />

                    <label className="block mb-2">Mensaje</label>
                    <textarea
                        className="w-full p-2 rounded bg-[#61B1CE] mb-4"
                        value={alertaNueva.mensaje}
                        onChange={(e) => setAlertaNueva({ ...alertaNueva, mensaje: e.target.value })}
                    />

                    <label className="block mb-2">Sistema / Servidor</label>
                    <select
                        className="w-full p-2 rounded bg-[#61B1CE] mb-4 text-white"
                        value={alertaNueva.servidorNombre}
                        onChange={(e) => setAlertaNueva({ ...alertaNueva, servidorNombre: e.target.value })}
                    >
                        <option value="">Selecciona un servidor</option>
                        {servidores.map(s => (
                            <option key={s.id} value={s.nombre}>{s.nombre}</option>
                        ))}
                    </select>

                    <label className="block mb-2">Fecha</label>
                    <input
                        type="date"
                        className="w-full p-2 rounded bg-[#61B1CE] mb-4"
                        value={alertaNueva.fecha}
                        onChange={(e) => setAlertaNueva({ ...alertaNueva, fecha: e.target.value })}
                    />

                    <div className="flex gap-3">
                    <button
                        onClick={() => setPaginaActual(prev => Math.max(0, prev - 1))}
                        disabled={paginaActual === 0}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-[#11A8FF] text-white hover:bg-blue-600 transition disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>

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
            </div>
        )}

    </div>
);

}