import { useState, useEffect } from "react";

export default function Infraestructura() {
  const [servidores, setServidores] = useState([]);
  const [servidorSeleccionado, setServidorSeleccionado] = useState(null);
  const [metricas, setMetricas] = useState({});
  const [alertas, setAlertas] = useState([]);

  // ---------------------------------------------------
  // 🔌 CARGAR SERVIDORES DESDE ZABBIX (host.get)
  // ---------------------------------------------------
  useEffect(() => {
    async function cargarServidores() {
      // Aquí irá tu llamada real a Zabbix
      const lista = [
        { id: 1, nombre: "Servidor 01", estado: "online" },
        { id: 2, nombre: "Servidor 02", estado: "offline" },
        { id: 3, nombre: "Servidor 03", estado: "online" }
      ];

      setServidores(lista);

      // Seleccionar automáticamente el primer servidor
      if (lista.length > 0) {
        setServidorSeleccionado(lista[0].id);
      }
    }

    cargarServidores();
  }, []);

  // ---------------------------------------------------
  // 🔌 CARGAR MÉTRICAS DEL SERVIDOR (item.get)
  // ---------------------------------------------------
  useEffect(() => {
    if (!servidorSeleccionado) return;

    async function cargarMetricas() {
      setMetricas({
        cpu: 15,
        ram: 80,
        disco: 60
      });
    }

    cargarMetricas();
  }, [servidorSeleccionado]);

  // ---------------------------------------------------
  // 🔌 CARGAR ALERTAS (trigger.get)
  // ---------------------------------------------------
  useEffect(() => {
    if (!servidorSeleccionado) return;

    async function cargarAlertas() {
      setAlertas([
        { id: 1, nombre: "Servidor 01", categoria: "Crítica", mensaje: "Hace 1 hora", fecha: "12/02/2026" },
        { id: 2, nombre: "Servidor 02", categoria: "Advertencia", mensaje: "Hace 4 horas", fecha: "20/02/2026" }
      ]);
    }

    cargarAlertas();
  }, [servidorSeleccionado]);

  return (
    <div className="pt-4 px-8 bg-gray-950 min-h-screen text-white">

      {/* TÍTULO */}
      <h2 className="text-gray-400 text-lg mb-6">Infraestructura</h2>

      {/* TARJETAS SUPERIORES */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10">

        <div className="bg-[#11A8FF] text-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Servidores Online</h2>
          <p className="text-4xl font-extrabold mt-2">
            {servidores.filter(s => s.estado === "online").length}
          </p>
        </div>

        <div className="bg-[#11A8FF] text-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Servidores Offline</h2>
          <p className="text-4xl font-extrabold mt-2">
            {servidores.filter(s => s.estado === "offline").length}
          </p>
        </div>

        <div className="bg-[#11A8FF] text-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Uso promedio CPU</h2>
          <p className="text-4xl font-extrabold mt-2">50%</p>
        </div>

        <div className="bg-[#11A8FF] text-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Uso promedio RAM</h2>
          <p className="text-4xl font-extrabold mt-2">52%</p>
        </div>

        <div className="bg-[#11A8FF] text-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Capacidad del disco</h2>
          <p className="text-4xl font-extrabold mt-2">30%</p>
        </div>
      </div>

      {/* SELECTOR DE SERVIDOR — YA SELECCIONADO POR DEFECTO */}
      <select
        className="p-3 mb-8 rounded-md bg-[#61B1CE] text-white border border-[#61B1CE]"
        value={servidorSeleccionado || ""}
        onChange={(e) => setServidorSeleccionado(e.target.value)}
      >
        {servidores.map((s) => (
          <option key={s.id} value={s.id} className="text-black">
            {s.nombre}
          </option>
        ))}
      </select>

      {/* PANEL DE MÉTRICAS + ALERTAS */}
      {servidorSeleccionado && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* PANEL DE MÉTRICAS */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg">

            <h3 className="text-2xl font-bold mb-4">
              {servidores.find(s => s.id == servidorSeleccionado)?.nombre}
            </h3>

            <div className="h-48 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 mb-6">
              Gráfica rendimiento (placeholder)
            </div>

            <div className="flex flex-col gap-4 text-lg mt-4">

              <div className="flex justify-between bg-[#11A8FF] text-white p-3 rounded-md">
                <span>Estado:</span>
                <span className="font-bold">{metricas.cpu ? "Online" : "Offline"}</span>
              </div>

              <div className="flex justify-between bg-[#11A8FF] text-white p-3 rounded-md">
                <span>Uso CPU:</span>
                <span className="font-bold">{metricas.cpu}%</span>
              </div>

              <div className="flex justify-between bg-[#11A8FF] text-white p-3 rounded-md">
                <span>Uso RAM:</span>
                <span className="font-bold">{metricas.ram}%</span>
              </div>

              <div className="flex justify-between bg-[#11A8FF] text-white p-3 rounded-md">
                <span>Uso Disco:</span>
                <span className="font-bold">{metricas.disco}%</span>
              </div>

            </div>

          </div>

          {/* ALERTAS */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Alertas recientes</h3>

            <table className="w-full text-left">
              <thead className="bg-[#11A8FF] text-black">
                <tr>
                  <th className="p-3">Nombre</th>
                  <th className="p-3">Categoría</th>
                  <th className="p-3">Mensaje</th>
                  <th className="p-3">Fecha</th>
                </tr>
              </thead>

              <tbody>
                {alertas.map((a) => (
                  <tr key={a.id} className="border-b border-gray-700">
                    <td className="p-3">{a.nombre}</td>
                    <td className="p-3">{a.categoria}</td>
                    <td className="p-3">{a.mensaje}</td>
                    <td className="p-3">{a.fecha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}
    </div>
  );
}
