import { useState } from "react";

export default function Alertas() {

    // -----------------------------
    // ESTADOS PRINCIPALES
    // -----------------------------
    const [filtro, setFiltro] = useState("todos");
    const [busqueda, setBusqueda] = useState("");
    const [alertaEditando, setAlertaEditando] = useState(null);
//Hcer eque la bbdd se vaya actualizando cada ciertos dias o cada cierto tiempo, para que no se quede obsoleta y se puedan ver las alertas mas recientes
    const [alertas, setAlertas] = useState([
        { id: 1, categoria: "Critical", tipo: "SERVICE_DOWN", mensaje: "Uso elevado", servidor: "ServidorXX", fecha: "2026-02-16", revisado: false },
        { id: 2, categoria: "Critical", tipo: "DISK_FULL", mensaje: "Disco casi lleno", servidor: "ServidorXX", fecha: "2026-02-16", revisado: true },
        { id: 3, categoria: "Informativa", tipo: "CPU_HIGH", mensaje: "CPU alta temporal", servidor: "ServidorXX", fecha: "2026-02-16", revisado: false },
        { id: 4, categoria: "Warning", tipo: "MEMORY_HIGH", mensaje: "Memoria elevada", servidor: "ServidorXX", fecha: "2026-02-16", revisado: false },
    ]);

    const alertasFiltradas = alertas.filter(a => {
        const coincideFiltro = filtro === "todos" || a.categoria.toLowerCase() === filtro;
        const coincideBusqueda =
            a.tipo.toLowerCase().includes(busqueda.toLowerCase()) ||
            a.mensaje.toLowerCase().includes(busqueda.toLowerCase()) ||
            a.servidor.toLowerCase().includes(busqueda.toLowerCase());
        return coincideFiltro && coincideBusqueda;
    });

    // -----------------------------
    // PAGINACIÓN
    // -----------------------------
    const [paginaActual, setPaginaActual] = useState(0);
    const elementosPorPagina = 5;

    const totalPaginas = Math.ceil(alertasFiltradas.length / elementosPorPagina);

    const alertasPaginadas = alertasFiltradas.slice(
        paginaActual * elementosPorPagina,
        paginaActual * elementosPorPagina + elementosPorPagina
    );

    // -----------------------------
    // GUARDAR EDICIÓN
    // -----------------------------
    const guardarEdicion = () => {
        setAlertas(prev =>
            prev.map(a => (a.id === alertaEditando.id ? alertaEditando : a))
        );
        setAlertaEditando(null);
    };

    // -----------------------------
    // RETURN
    // -----------------------------
    return (
        <div className="p-8 text-white">

            {/* TÍTULO */}
            <h2 className='text-gray-400 text-lg mb-6'>Alertas / Eventos</h2>

            {/* FILTROS */}
            <div className="flex gap-4 mb-6">
                <button onClick={() => setFiltro("critical")} className="px-4 py-2 rounded-md bg-[#61B1CE] font-bold">Crítica</button>
                <button onClick={() => setFiltro("warning")} className="px-4 py-2 rounded-md bg-[#61B1CE] font-bold">Advertencia</button>
                <button onClick={() => setFiltro("informativa")} className="px-4 py-2 rounded-md bg-[#61B1CE] font-bold">Informativa</button>
                <button onClick={() => setFiltro("todos")} className="px-4 py-2 rounded-md bg-[#11A8FF] font-bold">Todos</button>
            </div>

            {/* BUSCADOR */}
            <input
                type="text"
                placeholder="Buscar alertas..."
                className="w-full p-3 rounded-md bg-[#61B1CE] text-white placeholder-white mb-6"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
            />

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
                        {alertasPaginadas.map((a) => (
                            <tr key={a.id} className="bg-[#11A8FF] border-b border-white/20 text-white">
                                <td className="p-3">{a.categoria}</td>
                                <td className="p-3">{a.tipo}</td>
                                <td className="p-3">{a.mensaje}</td>
                                <td className="p-3">{a.servidor}</td>
                                <td className="p-3">{a.fecha}</td>

                                {/* CHECKBOX REVISADO */}
                                <td className="p-3">
                                    <input
                                        type="checkbox"
                                        checked={a.revisado}
                                        onChange={() =>
                                            setAlertas(prev =>
                                                prev.map(x =>
                                                    x.id === a.id ? { ...x, revisado: !x.revisado } : x
                                                )
                                            )
                                        }
                                        className="w-5 h-5 accent-green-400"
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

            {/* MODAL DE EDICIÓN */}
            {alertaEditando && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
                    <div className="bg-[#11A8FF] p-6 rounded-lg w-96 shadow-xl">

                        <h2 className="text-2xl font-bold mb-4">Editar alerta</h2>

                        <label className="block mb-2">Categoría</label>
                        <input
                            className="w-full p-2 rounded bg-[#61B1CE] mb-4"
                            value={alertaEditando.categoria}
                            onChange={(e) =>
                                setAlertaEditando({ ...alertaEditando, categoria: e.target.value })
                            }
                        />

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

                        <label className="block mb-2">Servidor</label>
                        <input
                            className="w-full p-2 rounded bg-[#61B1CE] mb-4"
                            value={alertaEditando.servidor}
                            onChange={(e) =>
                                setAlertaEditando({ ...alertaEditando, servidor: e.target.value })
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
