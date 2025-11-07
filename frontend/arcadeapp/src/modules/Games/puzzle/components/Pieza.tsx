interface PiezaProps {
  letra: string | null;
  seleccionarPiezas: (id: number) => void;
  moverPieza: (id: number) => void;
  indice: number;
}

const Pieza = ({ letra, seleccionarPiezas, indice, moverPieza }: PiezaProps) => {
  const handleClick = () => {
    if (letra) seleccionarPiezas(indice);
    else moverPieza(indice);
  };

  return (
    <div
      onClick={handleClick}
      className={`aspect-square w-full border-2 rounded-md overflow-hidden cursor-pointer 
        ${letra ? "border-white-400" : "border-white-400 bg-gray-200"}`}
    >
      {letra ? (
        <img
          src={letra}
          alt={`pieza-${indice}`}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-500"></div>
      )}
    </div>
  );
};

export default Pieza;
