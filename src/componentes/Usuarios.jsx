import { useState, useEffect } from "react";

export default function IdentidadesUsuario() {
    const [usuarios, setUsuarios] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [filtroPlataforma, setFiltroPlataforma] = useState("Office 365");
    const [usuariosActivosOffice365, setUsuariosActivosOffice365] = useState(null);
    const [usuariosGitlab, setUsuariosGitlab] = useState(null);
    const [usuariosJira, setUsuariosJira] = useState(null);
    const [paginaActual, setPaginaActual] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [totalElementos, setTotalElementos] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Cargar datos de Microsoft 365
        const cargarDatosMicrosoft = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/usuarios/microsoft365');
                const data = await response.json();
                setUsuariosActivosOffice365(data.totalUsers);
            } catch (error) {
                console.error('Error al cargar datos de Microsoft 365:', error);
            }
        };

        // Cargar lista de usuarios
        const cargarUsuarios = async () => {
            try {
                setLoading(true);
                // Construir URL con parámetros de búsqueda si existe
                let url = `http://localhost:8080/api/usuarios/microsoft365/users?page=${paginaActual}&size=20`;
                if (busqueda.trim()) {
                    url += `&search=${encodeURIComponent(busqueda.trim())}`;
                }
                
                const response = await fetch(url);
                const data = await response.json();
                
                console.log('Datos recibidos:', data);
                
                // El endpoint devuelve un objeto con estructura: { usuarios: [], totalPages: X, totalItems: Y }
                if (data.usuarios && Array.isArray(data.usuarios)) {
                    const usuariosMapeados = data.usuarios.map(usuario => ({
                        id: usuario.id,
                        nombre: usuario.nombre,
                        email: usuario.email,
                        rol: usuario.rol,
                        activo: usuario.activo
                    }));
                    setUsuarios(usuariosMapeados);
                    setTotalPaginas(data.totalPages || 1);
                    setTotalElementos(data.totalItems || usuariosMapeados.length);
                } else if (Array.isArray(data)) {
                    // Si devuelve un array directamente
                    const usuariosMapeados = data.map(usuario => ({
                        id: usuario.id,
                        nombre: usuario.nombre,
                        email: usuario.email,
                        rol: usuario.rol,
                        activo: usuario.activo
                    }));
                    setUsuarios(usuariosMapeados);
                } else {
                    console.error('Formato de respuesta inesperado:', data);
                    setUsuarios([]);
                }
            } catch (error) {
                console.error('Error al cargar usuarios:', error);
            } finally {
                setLoading(false);
            }
        };

        cargarDatosMicrosoft();
        cargarUsuarios();
        
    }, [paginaActual, busqueda]);

    // Resetear a página 0 cuando cambia la búsqueda
    const handleBusquedaChange = (e) => {
        setBusqueda(e.target.value);
        setPaginaActual(0);
    };

    return (
        <div className="p-8 bg-gray-950 min-h-screen text-white">

            {/* TÍTULO */}
            <h2 className='text-gray-400 text-lg mb-6'>Identidades / Usuario</h2>

            {/* TARJETAS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-[#11A8FF] text-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold">Usuarios Activos Office 365</h2>
                    <p className="text-4xl font-extrabold mt-2">
                        {usuariosActivosOffice365 !== null ? usuariosActivosOffice365 : '--'}
                    </p>
                </div>

                <div className="bg-[#11A8FF] text-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold">Gitlab</h2>
                    <p className="text-4xl font-extrabold mt-2">
                        {usuariosGitlab !== null ? usuariosGitlab : '--'}
                    </p>
                </div>

                <div className="bg-[#11A8FF] text-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold">Jira</h2>
                    <p className="text-4xl font-extrabold mt-2">
                        {usuariosJira !== null ? usuariosJira : '--'}
                    </p>
                </div>
            </div>

            {/* BUSCADOR + SELECT */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <input
                    type="text"
                    placeholder="Introduce un email de usuario..."
                    value={busqueda}
                    onChange={handleBusquedaChange}
                    className="flex-1 p-3 rounded-md bg-[#61B1CE] text-white placeholder-white border border-[#61B1CE] focus:ring-2 focus:ring-[#61B1CE]"
                />


                <select
                    value={filtroPlataforma}
                    onChange={(e) => setFiltroPlataforma(e.target.value)}
                    className="p-3 rounded-md bg-[#61B1CE] text-white border border-[#61B1CE] focus:ring-2 focus:ring-[#61B1CE]"
                >
                    <option className="text-black">Office 365</option>
                    <option className="text-black">Gitlab</option>
                    <option className="text-black">Jira</option>
                </select>

            </div>

            {/* TABLA */}
            <div className="overflow-x-auto rounded-lg shadow-lg">
                <table className="w-full text-left text-white">
                    <thead className="bg-[#11A8FF] text-black">
                        <tr>
                            <th className="p-3">Nombre</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Rol</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="p-3 text-center text-gray-400">
                                    Cargando usuarios...
                                </td>
                            </tr>
                        ) : usuarios.length > 0 ? (
                            usuarios.map((usuario) => (
                                <tr key={usuario.id} className="border-b border-gray-700 hover:bg-[#0D141F] transition">
                                    <td className="p-3">{usuario.nombre}</td>
                                    <td className="p-3">{usuario.email}</td>
                                    <td className="p-3">{usuario.rol}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-3 text-center text-gray-400">
                                    No se encontraron usuarios
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINACIÓN */}
            <div className="flex justify-between items-center mt-6">
                <p className="text-gray-400">Página {paginaActual + 1} de {totalPaginas}</p>
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
    );
}
