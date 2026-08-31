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

  // Center bag
  useEffect(() => {
    const center = window.innerWidth / 2;

    setBagX(center);
    bagXRef.current = center;
  }, []);

  // Timer
  useEffect(() => {
    if (gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((time) => {
        if (time <= 1) {
          setGameOver(true);
          return 0;
        }

        return time - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameOver]);

  // Spawn ONE cheeto at a time
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setCheetos((prev) => {
        // Prevent too many existing on screen
        if (prev.length >= 8) return prev;

        return [
          ...prev,
          {
            id: Date.now() + Math.random(),
            x: Math.random() * (window.innerWidth - 120),
            y: -150,
            image:
              cheetoImages[
                Math.floor(
                  Math.random() * cheetoImages.length
                )
              ],
          },
        ];
      });
    }, 900);

    return () => clearInterval(interval);
  }, [gameOver]);

  // Falling animation
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setCheetos((prev) => {
        const remaining: Cheeto[] = [];
        let caughtCount = 0;

        for (const c of prev) {
          const newY = c.y + 5;

          const caught =
            newY > window.innerHeight - 260 &&
            c.x > bagXRef.current - 160 &&
            c.x < bagXRef.current + 160;

          if (caught) {
            caughtCount++;
          } else if (newY < window.innerHeight + 150) {
            remaining.push({
              ...c,
              y: newY,
            });
          }
        }

        if (caughtCount > 0) {
          setScore((score) => score + caughtCount);
        }

        return remaining;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [gameOver]);

  const moveBag = (
    e: React.MouseEvent<HTMLElement>
  ) => {
    if (gameOver) return;

    bagXRef.current = e.clientX;
    setBagX(e.clientX);
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
        🌽 {score}
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

      {/* CHEETOS */}
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
    width: 350,
    height: "auto",
    bottom: 20,
    left: bagX,
    pointerEvents: "none",
    userSelect: "none",
    zIndex: 100,
  }}
/>

      {/* GAME OVER */}
      {gameOver && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(255, 247, 230, 0.92)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 200,
          }}
        >
          <h1
            style={{
              fontSize: "3rem",
              marginBottom: 10,
            }}
          >
            TIME'S UP!
          </h1>

          <p
            style={{
              fontSize: "2rem",
            }}
          >
            You caught {score} Cheetos 🌽
          </p>
        </div>
      )}
    </main>
  );
}