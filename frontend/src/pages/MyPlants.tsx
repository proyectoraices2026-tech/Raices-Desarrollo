import BottomNav from "../components/BottomNav";
import NavBar from "../components/NavBar";
import RegisterPlantModal from "../components/RegisterPlantModal";
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import SideMenu from "../components/SideMenu";
import { useAlert } from "../context/AlertContext";
import { useAuth } from "../context/AuthContext";
import { getUserPlants, type UserPlant } from "../services/UserPlantsService";

import PlantDetailModal from "../components/PlantDetailModal";

export default function MyPlants() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const { showAlert } = useAlert();
  const { user, role } = useAuth();

  const [plants, setPlants] = useState<UserPlant[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedPlant, setSelectedPlant] = useState<UserPlant | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const navigate = useNavigate();

  const loadPlants = () => {
    if (!user) return;
    setLoading(true);
    getUserPlants(user.id)
      .then(setPlants)
      .catch(() => setPlants([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPlants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="min-h-screen bg-[#f5f7f2] pb-28">
      <NavBar onMenuClick={() => setMenuOpen(true)} />

      <div className="md:max-w-5xl md:mx-auto">
        {/* Hero */}
        {/* Solo visible para administradores: revisar y aprobar/rechazar pedidos */}
        {role === "admin" && (
          <button
            onClick={() => navigate("/admin")}
            className="text-left px-3 py-3 rounded-xl hover:bg-primarioClaro text-[#1e2d24] text-sm font-medium bg-primarioOscuro text-white mt-8 m-4"
          >
            Volvar al Dashboard de admin
          </button>
        )}
        <div className="p-5 md:px-12 md:py-8">
          <span className="inline-block bg-primarioClaro text-primarioOscuro text-xs font-semibold px-3 py-1 rounded-full mb-3">
            Tu jardín interior te espera
          </span>
          <h1 className="font-poppins text-4xl md:text-5xl leading-tight font-bold text-[#1e2d24] mb-2">
            <span className="block">Cuida tus plantas</span>
            <span className="block text-[#537a63] italic">con intención</span>
          </h1>
          <p className="text-sm md:text-base text-[#537a63] mb-4 md:max-w-md">
            Seguimiento personalizado, recordatorios inteligentes y diagnósticos visuales
            para que cada hoja prospere.
          </p>

          {/* Widget de tareas — texto fijo, sin datos reales */}
          <div className="relative bg-textoSecundario rounded-2xl p-5 text-white mb-4 overflow-hidden">
            <div
              className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-[#FDFEFD]"
              aria-hidden="true"
            />

            <p className="text-[11px] font-semibold tracking-wide opacity-70 mb-1.5">HOY · LUN 1 SEP</p>
            <p className="text-base font-bold mb-3">Tareas pendientes</p>

            <ul className="text-sm space-y-2 mb-4">
              <li className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#7FA8C9] flex-shrink-0" aria-hidden="true" />
                Regar Monstera Deliciosa
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#8FAF7B] flex-shrink-0" aria-hidden="true" />
                Podar Ficus
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#C3D5A8] flex-shrink-0" aria-hidden="true" />
                Abonar Pothos
              </li>
            </ul>

            <button
              onClick={() =>
                showAlert({
                  title: "Próximamente",
                  message: "Esta función todavía no está disponible.",
                  variant: "info",
                })
              }
              className="block ml-auto text-xs font-semibold bg-[#F5F7F2]/15 hover:bg-[#F5F7F2]/25 transition rounded-full px-4 py-2 text-superficie"
            >Ver calendario completo →
            </button>
          </div>
        </div>

        {/* Plantas del usuario, o el estado vacío si aún no tiene ninguna */}
        <div className="px-5 md:px-12">
          {loading ? (
            <p className="text-sm text-[#537a63] text-center py-8">Cargando tus plantas...</p>
          ) : plants.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-[#c8dcc2] flex flex-col items-center justify-center gap-2 py-12 px-6 text-center">
              <p className="text-sm font-semibold text-[#1e2d24]">Todavía no tienes plantas registradas</p>
              <p className="text-xs text-[#537a63] max-w-xs">
                Registra tu primera planta para empezar a llevar su seguimiento.
              </p>
              <button
                onClick={() => setRegisterOpen(true)}
                className="mt-3 inline-flex items-center gap-2 bg-[#645244] text-white text-sm font-semibold rounded-full px-5 py-2.5 hover:bg-[#2B1C1C] transition"
              >
                <span className="text-lg leading-none" aria-hidden="true">+</span>
                Registrar planta
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {plants.map((plant) => (
                <div
                  key={plant.id}
                  onClick={() => {
                    setSelectedPlant(plant);
                    setDetailOpen(true);
                  }}
                  className="bg-white rounded-2xl overflow-hidden border border-[#e8efe4] cursor-pointer hover:border-[#c8dcc2] transition"
                >
                  <div className="h-24 md:h-32 bg-[#e8efe4]" />
                  <div className="p-2">
                    <p className="text-xs font-bold text-[#1e2d24] truncate">{plant.name}</p>
                    <p className="text-[10px] text-[#537a63] truncate">
                      {plant.scientific_name || plant.watering_frequency || ""}
                    </p>
                  </div>
                </div>
              ))}

              <button
                onClick={() => setRegisterOpen(true)}
                className="bg-white rounded-2xl border border-dashed border-[#c8dcc2] flex flex-col items-center justify-center gap-1 py-8 text-[#537a63]"
              >
                <span className="text-2xl">+</span>
                <span className="text-xs font-semibold">Añadir planta</span>
              </button>
            </div>
          )}
        </div>

        <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        <RegisterPlantModal
          isOpen={registerOpen}
          onClose={() => setRegisterOpen(false)}
          onPlantAdded={loadPlants}
        />
        <BottomNav />

        <PlantDetailModal
          plant={selectedPlant}
          userId={user?.id ?? ""}
          isOpen={detailOpen}
          onClose={() => setDetailOpen(false)}
          onChanged={loadPlants}
        />
      </div>
    </div>
  );
}