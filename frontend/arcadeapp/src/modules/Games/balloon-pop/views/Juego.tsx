import { useCallback, useEffect, useState } from "react";
import { Ballon, type BalloonType } from "../components/Globo";

const Colors = [
  "bg-pink-400",
  "bg-purple-400",
  "bg-sky-400",
  "bg-teal-400",
  "bg-yellow-400",
  "bg-green-400",
  "bg-amber-700",
  "bg-amber-200"
];

const Juego = () => {
  const [listaBalloon, setListaBalloon] = useState<BalloonType[]>([]);
  const [segundos, setSegundos] = useState<number>(0);
  const [juegoTerminado, setJuegoTerminado] = useState<boolean>(false);
  const [puntos, setPuntos] = useState<number>(0);
  const [jugador, setJugador] = useState<string>("");
  const [nombreIngresado, setNombreIngresado] = useState<boolean>(false);

  const crearBalloon = useCallback(() => {
    if (juegoTerminado) return;

    const color = Colors[Math.floor(Math.random() * Colors.length)];
    const newBalloon: BalloonType = {
      color,
      top: Math.floor(Math.random() * 85),
      left: Math.floor(Math.random() * 85),
      size: Math.floor(Math.random() * (100 - 25 + 1) + 25),
      id: Date.now() + Math.random(),
    };

    setListaBalloon(prev => [...prev, newBalloon]);
  }, [juegoTerminado]);

  
  const ClickBalloon = useCallback((id: number) => {
    setListaBalloon(prev => prev.filter(b => b.id !== id));
    setPuntos(prev => prev + 1);
    crearBalloon();
  }, [crearBalloon]);


  const eliminarBalloonTimeout = useCallback((id: number) => {
    setListaBalloon(prev => prev.filter(b => b.id !== id));
  }, []);

  
  useEffect(() => {
    if (juegoTerminado || !nombreIngresado) return;
    const interval = setInterval(crearBalloon, 2000);
    return () => clearInterval(interval);
  }, [crearBalloon, juegoTerminado, nombreIngresado]);

  
  useEffect(() => {
    if (juegoTerminado || !nombreIngresado) return;
    const interval = setInterval(() => setSegundos(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [juegoTerminado, nombreIngresado]);

  
  useEffect(() => {
    if (segundos >= 30) setJuegoTerminado(true);
  }, [segundos]);

  
  const iniciarJuego = () => {
    if (jugador.trim() !== "") { 
      setNombreIngresado(true);
    }
  };

  if (!nombreIngresado) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold mb-4">Ingresa tu nombre: </h1>
        <input
          type="text"
          value={jugador}
          onChange={e => setJugador(e.target.value)}
          className="border p-2 rounded mb-4"
          placeholder="Tu nombre"
        />
        <button
          onClick={iniciarJuego}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Empezar
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center relative">
      <h1 className="text-xl font-semibold my-2">Jugador: {jugador}</h1>
      <h3 className="text-2xl font-semibold my-2">Tiempo: {segundos}s</h3>
      <h3 className="text-xl font-semibold my-2">Puntos: {puntos}</h3>

      <div className="relative bg-black border-2 border-white-600 w-[600px] aspect-[4/3] overflow-hidden rounded-2xl">
        {listaBalloon.map(balloon => (
          <Ballon
            key={balloon.id}
            id={balloon.id} 
            color={balloon.color}
            top={balloon.top}
            left={balloon.left}
            size={balloon.size}
            onClickBalloon={ClickBalloon}
            eliminarBalloonTimeout={eliminarBalloonTimeout}
          />
        ))}
      </div>


      {juegoTerminado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4 text-black">¡Juego Finalizado!</h2>
            <p className="text-xl mb-2 text-black">Jugador: <strong>{jugador}</strong></p>
            <p className="text-xl mb-4 text-black">Puntos: <strong>{puntos}</strong></p>
            <button
              onClick={() => {
                setListaBalloon([]);
                setSegundos(0);
                setPuntos(0);
                setJuegoTerminado(false);
                setNombreIngresado(false);
                setJugador("");
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Jugar de nuevo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Juego;
