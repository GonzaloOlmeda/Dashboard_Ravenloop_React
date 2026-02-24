import { useState } from "react";

export default function Login({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Aquí luego conectarás con Microsoft (MSAL)
    const handleLogin = async () => {
        try {
            // FUTURO: Aquí irá la autenticación real con Microsoft
            // Ejemplo:
            // const result = await msalInstance.loginPopup();

            // Por ahora simula login correcto
            onLogin();
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
        }
    };

    return (
        <div className="flex h-screen w-full">

            {/* Lado izquierdo azul con logo */}
            <div
                className="w-1/2 flex flex-col items-center justify-center"
                style={{ backgroundColor: "#11A8FF" }}
            >
                <img
                    src="/images/logoBlanco.png"
                    alt="Logo Ravenloop"
                    className="w-80 mb-6"
                />
            </div>

            {/* Lado derecho oscuro */}
            <div
                className="w-1/2 flex flex-col justify-center px-24"
                style={{ backgroundColor: "#101925" }}
            >
                <h2 className="text-white text-4xl font-bold mb-10">
                    Iniciar sesión
                </h2>

                {/* Email */}
                <label className="text-white text-sm mb-1">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mb-6 p-3 rounded-md bg-[#0D141F] text-white outline-none focus:ring-2 focus:ring-[#11A8FF]"
                />

                {/* Contraseña */}
                <label className="text-white text-sm mb-1">Contraseña</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mb-4 p-3 rounded-md bg-[#0D141F] text-white outline-none focus:ring-2 focus:ring-[#11A8FF]"
                />

                {/* Recordar */}
                <div className="flex items-center mb-6">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-white text-sm">Recordar contraseña</span>
                </div>

                {/* Botón Acceder */}
                <div className="flex justify-center mt-4">
                    <button
                        onClick={handleLogin}
                        className="w-40 py-2 rounded-md text-white font-semibold text-sm transition-all hover:opacity-90"
                        style={{ backgroundColor: "#0063F2" }}
                    >
                        Acceder
                    </button>
                </div>


            </div>
        </div>
    );
}
