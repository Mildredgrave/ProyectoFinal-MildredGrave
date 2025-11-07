import { useEffect } from "react";

export type BalloonType = {
  color: string;
  top: number;
  left: number;
  id: number;
  size: number;
};

interface BalloonProps extends BalloonType {
  onClickBalloon: (id: number) => void;      
  eliminarBalloonTimeout: (id: number) => void; 
}

export const Ballon = ({
  color,
  top,
  left,
  id,
  size,
  onClickBalloon,
  eliminarBalloonTimeout,
}: BalloonProps) => {

  useEffect(() => {
    const timeout = setTimeout(() => {
      eliminarBalloonTimeout(id);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [id, eliminarBalloonTimeout]);

  return (
    <div
      className={`absolute ${color} rounded-full`}
      style={{ top: top + "%", left: left + "%", width: size + "px", height: size + "px" }}
      onClick={() => onClickBalloon(id)} 
    />
  );
};
