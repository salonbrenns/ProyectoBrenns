import { Search, Filter, ChevronRight } from "lucide-react";

interface FilterSidebarProps {
    title: string;
    // Props para la búsqueda (siempre presente)
    busqueda: string;
    setBusqueda: (value: string) => void;
    // Props para las categorías/niveles (ejemplo: Manicura, Pedicura, etc.)
    categoriasDisponibles: string[];
    categoriasSeleccionadas: string[];
    toggleCategoria: (category: string) => void;
    // Función de limpieza completa
    limpiarFiltros: () => void;
}

export default function FilterSidebar({ 
    title, 
    busqueda, 
    setBusqueda, 
    categoriasDisponibles, 
    categoriasSeleccionadas, 
    toggleCategoria, 
    limpiarFiltros 
}: FilterSidebarProps) {
    
    return (
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-pink-100 sticky top-24">
            <h2 className="font-bold text-xl text-pink-600 mb-6 flex items-center gap-3">
                <Filter className="w-6 h-6" aria-hidden="true" />
                {title}
            </h2>

            {/* BÚSQUEDA */}
            <div className="mb-8">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:border-pink-500 focus:outline-none text-gray-700 placeholder-gray-400 text-sm shadow-sm"
                    />
                </div>
            </div>

            <div className="space-y-6">
                
                {/* FILTRO DE CATEGORÍAS/NIVELES */}
                <details open className="group">
                    <summary className="flex justify-between items-center font-bold text-gray-800 cursor-pointer hover:text-pink-600 transition list-none border-b pb-3 mb-3">
                        Categoría
                        <ChevronRight className="w-5 h-5 text-pink-600 group-open:rotate-90 transition-transform" />
                    </summary>
                    <div className="mt-3 space-y-3 pl-2">
                        {categoriasDisponibles.map((categoria: string) => (
                            <label key={categoria} className="flex items-center gap-3 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={categoriasSeleccionadas.includes(categoria)}
                                    onChange={() => toggleCategoria(categoria)}
                                    className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500 border-gray-300" 
                                />
                                <span className="text-gray-700 font-medium">{categoria}</span>
                            </label>
                        ))}
                    </div>
                </details>

                {/* OTROS FILTROS (Simulación) */}
                {["Marcas", "Ofertas"].map((filtro) => (
                    <details key={filtro} className="group">
                        <summary className="flex justify-between items-center font-bold text-gray-800 cursor-pointer hover:text-pink-600 transition list-none border-b pb-3 mb-3">
                            {filtro}
                            <ChevronRight className="w-5 h-5 text-pink-600 group-open:rotate-90 transition-transform" />
                        </summary>
                    </details>
                ))}
            </div>
            
            <button
                onClick={limpiarFiltros}
                className="mt-8 w-full py-3 bg-pink-100 text-pink-600 font-bold rounded-xl hover:bg-pink-200 transition-colors"
            >
                Limpiar Filtros
            </button>
        </div>
    );
}