import { useState, useEffect } from "react";

export default function IdentidadesUsuario() {
    const [usuarios, setUsuarios] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [filtroPlataforma, setFiltroPlataforma] = useState("Office 365");

    // -----------------------------
    // FUTURO: AQUÍ IRÁ LA API DE MICROSOFT
    // -----------------------------
    useEffect(() => {
        // Ejemplo de estructura para cuando conectes MS Graph:
        /*
        async function cargarUsuarios() {
          const response = await graphClient
            .api("/users")
            .select("displayName,mail,jobTitle")
            .get();
    
          setUsuarios(response.value);
        }
    
        cargarUsuarios();
        */
        setUsuarios([
            {
                id: 1,
                nombre: "Ana Pérez",
                email: "ana@email.com",
                rol: "admin",
                foto: "https://i.pravatar.cc/40?img=1"
            },
            {
                id: 2,
                nombre: "Juan Gomez",
                email: "juan@email.com",
                rol: "IT",
                foto: "https://i.pravatar.cc/40?img=2"
            },
            {
                id: 3,
                nombre: "Carlos Mendez",
                email: "carlos@email.com",
                rol: "Developer",
                foto: "https://i.pravatar.cc/40?img=3"
            }
        ]);
    }, []);
    const usuariosFiltrados = usuarios.filter((u) =>
        u.email.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="p-8 bg-gray-950 min-h-screen text-white">

            {/* TÍTULO */}
            <h2 className='text-gray-400 text-lg mb-6'>Identidades / Usuario</h2>

            {/* TARJETAS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-[#11A8FF] text-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold">Usuarios Office 365</h2>
                    <p className="text-4xl font-extrabold mt-2">160</p>
                </div>

                <div className="bg-[#11A8FF] text-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold">Gitlab</h2>
                    <p className="text-4xl font-extrabold mt-2">161</p>
                </div>

                <div className="bg-[#11A8FF] text-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold">Jira</h2>
                    <p className="text-4xl font-extrabold mt-2">16</p>
                </div>
            </div>

            {/* BUSCADOR + SELECT */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <input
                    type="text"
                    placeholder="Introduce un email de usuario..."
                    className="flex-1 p-3 rounded-md bg-[#61B1CE] text-white placeholder-white border border-[#61B1CE] focus:ring-2 focus:ring-[#61B1CE]"
                />


                <select
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
                            <th className="p-3">Foto</th>
                            <th className="p-3">Nombre</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Rol</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr className="border-b border-gray-700 hover:bg-[#0D141F] transition">
                            <td className="p-3">
                                <img
                                    src="https://i.pravatar.cc/40?img=1"
                                    className="w-10 h-10 rounded-full"
                                />
                            </td>
                            <td className="p-3">Ana Pérez</td>
                            <td className="p-3">ana@email.com</td>
                            <td className="p-3">admin</td>
                        </tr>

                        <tr className="border-b border-gray-700 hover:bg-[#0D141F] transition">
                            <td className="p-3">
                                <img
                                    src="https://i.pravatar.cc/40?img=2"
                                    className="w-10 h-10 rounded-full"
                                />
                            </td>
                            <td className="p-3">Juan Gomez</td>
                            <td className="p-3">juan@email.com</td>
                            <td className="p-3">IT</td>
                        </tr>

                        <tr className="border-b border-gray-700 hover:bg-[#0D141F] transition">
                            <td className="p-3">
                                <img
                                    src="https://i.pravatar.cc/40?img=3"
                                    className="w-10 h-10 rounded-full"
                                />
                            </td>
                            <td className="p-3">Carlos Mendez</td>
                            <td className="p-3">carlos@email.com</td>
                            <td className="p-3">Developer</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* PAGINACIÓN */}
            <div className="flex justify-end mt-6 gap-3">

                <button
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#11A8FF] text-white text-xl font-bold hover:bg-blue-400 transition"
                >
                    &lt;
                </button>

                <button
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#11A8FF] text-white text-xl font-bold hover:bg-blue-400 transition"
                >
                    &gt;
                </button>

            </div>


        </div>
    );
}
