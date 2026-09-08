"use client";

import { useEffect, useState, useRef } from "react";

const cheetoImages = [
  "/cheetos.png",
  "/cheetos2.png",
  "/cheetos3.png",
  "/cheetos4.png",
  "/cheetos5.png",
];

type Cheeto = {
  id: number;
  x: number;
  y: number;
  image: string;
};

export default function CheetosPage() {
  const [bagX, setBagX] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [cheetos, setCheetos] = useState<Cheeto[]>([]);
const bagXRef = useRef(0);
const caughtRef = useRef(false);
const [gameTime, setGameTime] = useState(60);
const [gameStarted, setGameStarted] = useState(false);
 

  // -------------------------
  // CENTER BAG
  // -------------------------
  useEffect(() => {
    const center = window.innerWidth / 2;

    setBagX(center);
    bagXRef.current = center;
  }, []);

  // -------------------------
  // TIMER
  // -------------------------
  useEffect(() => {
  if (gameOver || !gameStarted) return;

  const timer = setInterval(() => {
    setTimeLeft((time) => {
      if (time <= 1) {
        clearInterval(timer);
        setGameOver(true);
        return 0;
      }

      return time - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [gameOver, gameStarted]);
 
// SPAWN ONE CHEETO AT A TIME
// -------------------------
useEffect(() => {
  if (gameOver) return;

  const interval = setInterval(() => {
    setCheetos((prev) => {
      // ONLY ONE CHEETO AT A TIME
      if (prev.length > 0) {
  return prev;
}
caughtRef.current = false;



      return [
        {
          
          id: Date.now() + Math.random(),
          x: Math.random() * (window.innerWidth - 250),
          y: -120,
          image:
            cheetoImages[
              Math.floor(
                Math.random() * cheetoImages.length
              )
            ],
        },
      ];
    });
  }, 1200);

  return () => clearInterval(interval);
}, [gameOver]);

 
// FALLING + CATCHING
// -------------------------
useEffect(() => {
  if (gameOver || !gameStarted) return;

  const interval = setInterval(() => {
    setCheetos((prev) => {
      if (prev.length === 0) {
        return prev;
      }

      const c = prev[0];
     const newY = c.y + 10;

      // BAG SIZE
      const bagWidth = 160;
      const bagHeight = 195;
      const bagBottom = 20;

      const bagTop = window.innerHeight - 100;

      // BAG OPENING
      const bagLeft =
        bagXRef.current - bagWidth / 2;

      const bagRight =
        bagXRef.current + bagWidth / 2;

      // CHEETO SIZE
      const cheetoWidth = 250;
      const cheetoHeight = 250;

      const cheetoCenterX =
        c.x + cheetoWidth / 2;

     const cheetoBottom =
  newY + cheetoHeight;

      // Is Cheeto above the opening?
      const insideBagX =
  cheetoCenterX > bagLeft - 10 &&
  cheetoCenterX < bagRight + 10;

     const insideBagY =
  newY + cheetoHeight >= bagTop + 30 &&
  newY <= bagTop + 180;
      // -------------------------
      // CAUGHT!
      // -------------------------
    if (insideBagX && insideBagY) {
  if (caughtRef.current) {
    return [];
  }

  caughtRef.current = true;
  setScore((score) => score + 1);
  return [];
}

      // -------------------------
      // MISSED
      // -------------------------
      if (newY > window.innerHeight + 100) {
        // Remove it, but DON'T increase score
        return [];
      }

      // -------------------------
      // KEEP FALLING
      // -------------------------
      return [{ ...c, y: newY }];
    });
  }, 50);

  return () => clearInterval(interval);
}, [gameOver, gameStarted]);

  // -------------------------
  // MOVE BAG
  // -------------------------
  const moveBag = (e: React.MouseEvent) => {
    const newX = e.clientX;
    setBagX(newX);
    bagXRef.current = newX;
  };

  return (
  <main
    onMouseMove={moveBag}
    style={{
      position: "relative",
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
      background: "#fff7e6",
      cursor: "none",
    }}
  >
{!gameStarted && (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: "#fff7e6",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 300,
    }}
  >
    <h1
      style={{
        fontSize: "3rem",
        marginBottom: 10,
      }}
    >
      How long do you want to play?
    </h1>

    <div
      style={{
        display: "flex",
        gap: 20,
        marginTop: 20,
      }}
    >
      {[30, 60].map((seconds) => (
        <button
          key={seconds}
          onClick={() => {
            setGameTime(seconds);
            setTimeLeft(seconds);
          }}
          style={{
            padding: "14px 30px",
            minWidth: 120,
            fontSize: "1.3rem",
            fontFamily: "inherit",
            fontWeight: "bold",
            background: "#fff",
            color: "#111",
            border: "3px solid #111",
            borderRadius: "14px",
            cursor: "pointer",
            boxShadow: "4px 4px 0 #111",
          }}
        >
          {seconds === 30 ? "30 sec" : "1 min"}
        </button>
      ))}
    </div>

    <button
      onClick={() => {
        setScore(0);
        setCheetos([]);
        setTimeLeft(gameTime);
        setGameOver(false);
        setGameStarted(true);
      }}
      style={{
        marginTop: 30,
        padding: "15px 55px",
        fontSize: "1.5rem",
        fontFamily: "inherit",
        fontWeight: "bold",
        background: "#f28c28",
        color: "#fff",
        border: "3px solid #111",
        borderRadius: "14px",
        cursor: "pointer",
        boxShadow: "5px 5px 0 #111",
      }}
    >
      PLAY
    </button>
  </div>
)}
      {/* SCORE */}
      <div
        style={{
          position: "absolute",
          top: 25,
          left: 30,
          zIndex: 100,
          fontSize: "2rem",
        }}
      >
        Cheetos Caught: {score}
      </div>

      {/* TIMER */}
      <div
  style={{
    position: "absolute",
    top: 25,
    right: 30,
    zIndex: 100,
    fontSize: "2rem",
  }}
>
  ⏱ {timeLeft}
</div>

      
      {cheetos.map((c) => (
        <img
          key={c.id}
          src={c.image}
          alt=""
          draggable={false}
          style={{
            position: "absolute",
            width: 250,
            left: c.x,
            top: c.y,
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
      ))}

      {/* BAG */}
      <img
  src="/cheetosbag.png"
  alt="Cheetos bag"
  draggable={false}
  style={{
    position: "absolute",
    width: 180,
    height: "auto",
    bottom: 20,
    left: bagX,
    transform: "translateX(-50%)",
    pointerEvents: "none",
    userSelect: "none",
    zIndex: 100,
  }}
/>

      {/* GAME OVER */}
      {gameOver && (
        <div
  style={{
    display: "flex",
    gap: 20,
    marginTop: 20,
  }}
>
  <button
    onClick={() => {
      setScore(0);
      setTimeLeft(gameTime);
      setCheetos([]);
      setGameOver(false);
      setGameStarted(false);
    }}
    style={{
      padding: "14px 28px",
      fontSize: "1.3rem",
      fontFamily: "inherit",
      background: "#f28c28",
      color: "#fff",
      border: "3px solid #111",
      borderRadius: "12px",
      cursor: "pointer",
      boxShadow: "4px 4px 0 #111",
    }}
  >
    PLAY AGAIN
  </button>

  <button
    onClick={() => {
      window.location.href = "/";
    }}
    style={{
      padding: "14px 28px",
      fontSize: "1.3rem",
      fontFamily: "inherit",
      background: "#fff7e6",
      color: "#111",
      border: "3px solid #111",
      borderRadius: "12px",
      cursor: "pointer",
      boxShadow: "4px 4px 0 #111",
    }}
  >
    RETURN TO DESK
  </button>
</div>
        
      )}
      <button
  onClick={() => {
    setTimeLeft(gameTime);
    setScore(0);
    setCheetos([]);
    setGameOver(false);
    setGameStarted(true);
  }}
  style={{
    marginTop: 30,
    padding: "16px 50px",
    fontSize: "1.6rem",
    fontFamily: "inherit",
    fontWeight: "bold",
    background: "#111",
    color: "#fff",
    border: "3px solid #111",
    borderRadius: "12px",
    cursor: "pointer",
    boxShadow: "5px 5px 0 #f28c28",
  }}
>
  PLAY
</button>
    </main>
  );
}