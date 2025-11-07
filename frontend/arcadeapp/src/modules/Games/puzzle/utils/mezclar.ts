export const mezclarPuzzle = (array: any[], pasos = 50) => {
  const copia = [...array];
  let vacio = copia.indexOf(null);

  const movimientos = [-1, 1, -3, 3]; // izquierda, derecha, arriba, abajo

  for (let i = 0; i < pasos; i++) {
    const validos = movimientos.filter((m) => {
      const nuevaPos = vacio + m;
      // evita pasar a otra fila en horizontal
      if ((m === -1 && vacio % 3 === 0) || (m === 1 && vacio % 3 === 2)) return false;
      return nuevaPos >= 0 && nuevaPos < copia.length;
    });

    const mov = validos[Math.floor(Math.random() * validos.length)];
    const nuevaPos = vacio + mov;

    // intercambiar vacio con la pieza
    [copia[vacio], copia[nuevaPos]] = [copia[nuevaPos], copia[vacio]];
    vacio = nuevaPos;
  }

  return copia;
};
