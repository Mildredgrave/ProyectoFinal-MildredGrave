import { useState, useEffect } from "react";
import "./App.css";
import Pieza from "./components/Pieza";
import { useStore } from "./store/useStore";
import { mezclarPuzzle } from "./utils/mezclar";

function App() {
  const { List, saveList } = useStore((state) => state);

  const piezasOriginales = [
    null,
    "/img/parte1.jpg",
    "/img/parte2.jpg",
    "/img/parte3.jpg",
    "/img/parte4.jpg",
    "/img/parte5.jpg",
    "/img/parte6.jpg",
    "/img/parte7.jpg",
    "/img/parte8.jpg",
  ];

  const [matriz, setMatriz] = useState<any[]>(() => mezclarPuzzle(piezasOriginales, 50));
  const [piezaSelect, setPiezaSelect] = useState<number | null>(null);
  const [movimientos, setMovimientos] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [nombreJugador, setNombreJugador] = useState("");

  const seleccionarPiezas = (indice: number) => setPiezaSelect(indice);

  const moverPieza = (indice: number) => {
    if (piezaSelect === null) return;
    if (validar(indice)) {
      setMatriz((prevList) =>
        prevList.map((pieza, i) => {
          if (i === indice) return prevList[piezaSelect];
          if (i === piezaSelect) return null;
          return pieza;
        })
      );
      setPiezaSelect(null);
      setMovimientos((prev) => prev + 1);
    }
  };

  const validar = (indice: number) => {
    if (piezaSelect === null) return false;
    const sel = piezaSelect;

    if (
      (indice === sel + 1 && (sel + 1 !== 3 && sel + 1 !== 6)) ||
      (indice === sel - 1 && (sel - 1 !== 2 && sel - 1 !== 5))
    )
      return true;

    if (indice === sel + 3 || indice === sel - 3) return true;

    return false;
  };

  const rompecabezasCompleto = () => {
    for (let i = 0; i < piezasOriginales.length; i++) {
      if (matriz[i] !== piezasOriginales[i]) return false;
    }
    return true;
  };

  useEffect(() => {
    if (rompecabezasCompleto()) setModalVisible(true);
  }, [matriz]);

  const guardarEnRanking = () => {
    if (!nombreJugador.trim()) return alert("Escribe tu nombre");
    saveList(nombreJugador, movimientos);
    setNombreJugador("");
    setMovimientos(0);
    setMatriz(mezclarPuzzle(piezasOriginales, 50));
    setModalVisible(false);
  };

  const rankingOrdenado = [...List].sort((a, b) => a.score - b.score);

  return (
    <div className="bg-black min-h-screen text-white px-1">
      <h2 className="text-lg">Movimientos: {movimientos}</h2>

      <div className="flex justify-center mt-0">
        <div className="border border-gray-400 aspect-square w-xl grid grid-cols-3 gap-1 p-2">
          {matriz.map((pieza, index) => (
            <Pieza
              key={index}
              letra={pieza}
              seleccionarPiezas={seleccionarPiezas}
              indice={index}
              moverPieza={moverPieza}
            />
          ))}
        </div>
      </div>

      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80 max-h-[80vh] overflow-auto">
            <h2 className="text-2xl font-bold text-black mb-4">
              ¡Felicidades! 
            </h2>
            <p className="mb-4 text-black">
              Has completado el rompecabezas en <b>{movimientos}</b> movimientos.
            </p>

            <input
              type="text" placeholder="Escribe tu nombre" 
              value={nombreJugador}onChange={(e) => setNombreJugador(e.target.value)} 
              className="border rounded p-2 w-full mb-4 text-black"/>

            <div className="flex justify-center gap-4 mb-4">
              <button onClick={guardarEnRanking} className="bg-amber-400 text-white px-4 py-2 rounded hover:bg-amber-500">
                Guardar
              </button>

              <button
                onClick={() => setModalVisible(false)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
                Cerrar
              </button>
            </div>

            <div className="text-left">
              <h3 className="text-xl mb-2 text-black">Ranking</h3>
              {rankingOrdenado.length === 0 ? (
                <p className="text-black">No hay jugadores todavía</p>
              ) : (
                rankingOrdenado.map((item, index) => (
                  <p key={index} className="text-black">
                    {index + 1}. {item.name} - {item.score} movimientos
                  </p>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
