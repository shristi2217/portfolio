"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as Matter from "matter-js";
import { useRef } from "react";


export default function HomePage() {
const router = useRouter();
const [bearMessage, setBearMessage] =
  useState("");
const [isMobile, setIsMobile] = useState(false);
const [showF1Modal, setShowF1Modal] = useState(false);
const engineRef = useRef<Matter.Engine | null>(null);
const renderRef = useRef<Matter.Render | null>(null);
const runnerRef = useRef<Matter.Runner | null>(null);
const [showClearButton, setShowClearButton] =
  useState(false);
const [lampOn, setLampOn] = useState(false);
const redBullContainerRef =
  useRef<HTMLDivElement>(null);

const redBullTriggered = useRef(false);

const textures = [
  "/can.png",
  "/can2.png",
  "/can3.png",

  
  
];

const [adsEnabled, setAdsEnabled] = useState(false);
const [ads, setAds] = useState<
  {
    id: number;
    message: string;
    top: number;
    left: number;
  }[]
>([]);



const clearRedBulls = () => {
  const render = renderRef.current;
  const runner = runnerRef.current;
  const engine = engineRef.current;
  setShowClearButton(false);
  const container = redBullContainerRef.current;

  if (render) {
    Matter.Render.stop(render);
    render.canvas.remove();
    render.textures = {};
  }

  if (runner) {
    Matter.Runner.stop(runner);
  }

  if (engine) {
    Matter.Composite.clear(engine.world, false);
    Matter.Engine.clear(engine);
  }

  if (container) {
    container.innerHTML = "";
  }

  renderRef.current = null;
  runnerRef.current = null;
  engineRef.current = null;
  redBullTriggered.current = false;
};


const summonRedBulls = () => {
 if (redBullTriggered.current) return;
redBullTriggered.current = true;
setShowClearButton(true);
const container =
    redBullContainerRef.current;

  if (!container) return;

  const {
    Engine,
    Render,
    Runner,
    Bodies,
    Composite
  } = Matter;

  const width = window.innerWidth;
  const height = window.innerHeight;

  const engine = Engine.create();
  engine.gravity.y = 1.8;
  engineRef.current = engine;

  const render = Render.create({
    
    
    element: container,
    engine,
    options: {
      width,
      height,
      wireframes: false,
      background: "transparent",
      
    },
  });
  console.log("Render created", render);

  renderRef.current = render;

  const floor = Bodies.rectangle(
    width / 2,
    height + 50,
    width,
    100,
    {
      isStatic: true,
    }
  );

  
const canCount = 250; // adjust to taste

Composite.add(engine.world, floor);

for (let i = 0; i < canCount; i++) {
  const texture =
    textures[Math.floor(Math.random() * textures.length)];

  const can = Bodies.rectangle(
    Math.random() * width,
    -Math.random() * 2000,
    52,
    64,
    {
      restitution: 0.2,
      friction: 0.8,
      render: {
        sprite: {
          texture,
          xScale: 0.09,
          yScale: 0.09,
        },
      },
    }
  );

  Composite.add(engine.world, can);
}

Render.run(render);
console.log("Render running");
const runner = Runner.create();
Runner.run(runner, engine);
console.log("Runner running");
runnerRef.current = runner;
};
    


const adMessages = [
  "Cute ducks near you!!.",
  "You won 700 Red Bulls.",
  "Local fish thinks you're cool.",
  "One weird trick to pass calculus.",
  "FREE GARLIC BREAD!",
  "This frog has your IP address.",
  "Download more RAM now.",
  "You are today's lucky winner.",
  "Click here for emotional damage.",
  "Hydration levels critical.",
   "Touch grass immediately.",
    "You have 14 unfinished projects.",
    "Error 404: Motivation not found.",
    "Congratulations. Nothing happened."
];

const bearMessages = [
  "hi! :)",
  "i guard the desk.",
  "don't touch the red bull.",
  "don't touch the star.",
  "go finish your project.",
  "do something productive.",
  "have water!",
  "the desk is under my protection.",
  "i'm just a little guy.",
  "the frog and i are friends.",
  "red bull count: concerning.",
  "why are you clicking me again"
];


const handleBearClick = () => {
  const randomMessage =
    bearMessages[
      Math.floor(
        Math.random() *
          bearMessages.length
      )
    ];

  setBearMessage(randomMessage);

  setTimeout(() => {
    setBearMessage("");
  }, 5000);
};





const [showFlowerModal, setShowFlowerModal] = useState(false);

useEffect(() => {
  const checkScreen = () => {
    setIsMobile(window.innerWidth < 900);
  };

  checkScreen();

  window.addEventListener("resize", checkScreen);

  return () =>
    window.removeEventListener("resize", checkScreen);
}, []);

const [showFrog, setShowFrog] = useState(false);

const summonFrog = () => {
  setShowFrog(true);

  setTimeout(() => {
    setShowFrog(false);
  }, 4000);
};

const startAds = () => {
  setAdsEnabled(true);
};

useEffect(() => {
  if (!adsEnabled) return;

  const interval = setInterval(() => {
    setAds((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        message:
          adMessages[
            Math.floor(
              Math.random() * adMessages.length
            )
          ],
       top: Math.random() * (window.innerHeight - 250),
left: Math.random() * (window.innerWidth - 380),
      },
    ]);
  }, 150);


  return () => clearInterval(interval);
}, [adsEnabled]);
  const toggleLamp = () => {
  const sound = new Audio(
    lampOn
      ? "/sounds/lamp-off-click.mp3"
      : "/sounds/lamp-on-click.mp3"
  );

  sound.volume = 0.3;
  sound.play();

  setLampOn(!lampOn);
};

const playDuckSound = () => {
  const ducks = [
    "/sounds/duck-sound.mp3",
    "/sounds/duck-sound2.mp3",
    "/sounds/duck-sound3.mp3",
    "/sounds/duck-sound4.mp3",
  ];

  const randomDuck =
    ducks[Math.floor(Math.random() * ducks.length)];

  const sound = new Audio(randomDuck);

  sound.volume = 0.5;
  sound.play();
};

const playImperialMarch = () => {
  const sound = new Audio("/sounds/darth-vader.mp3");

  sound.volume = 0.4;
  sound.play();
};
const openF1Modal = () => {
  const sound = new Audio("/sounds/f1-car.mp3");

  sound.volume = 0.4;
  sound.play();

  setShowF1Modal(true);
};
  if (isMobile) {
    return (
      <main className="mobileMessage">
        <h1>My Desk</h1>

        <p>
          This interactive desk was designed for larger
          screens. Please visit on a laptop or desktop
          for the full experience.
        </p>

        <button
          className="mobileButton"
          onClick={() =>
            window.open(
              "https://github.com/shristi2217",
              "_blank"
            )
          }
        >
          View Projects
        </button>
      </main>
    );
  }

  return (
    <main className="desk-root">
      <img
        src="/deskmain.png"
        alt="desk"
        className="bg"
        draggable="false"
      />
      {lampOn && <div className="lampDarkness" />}
      {lampOn && <div className="lampGlow" />}
{lampOn && <div className="lampGlow" />}
      {/* TOP */}

     <div
  className="hitbox f1"
  onClick={openF1Modal}
>
  
</div>

      <div
  className="hitbox fish-page"
  onClick={() => router.push("/fish")}
>
</div>

      <div
  className="hitbox duck"
  onClick={playDuckSound}
>
  
</div>
      <div className="hitbox cat">
        
      </div>

      <div className="hitbox frog">
        
      </div>

      <div
        className="hitbox clapperboard"
        onClick={() => router.push("/films")}
      >
        <span className="label">films</span>
      </div>

      <div
  className="hitbox flowers"
  onClick={() => setShowFlowerModal(true)}
>
  
</div>

      <div
        className="hitbox filmstrip"
        onClick={() =>
          window.open(
            "https://letterboxd.com/cheetos010/",
            "_blank"
          )
        }
      >
        
      </div>

      <div className="hitbox lego">
        
      </div>

      <div
  className="hitbox dog"
  onClick={() =>
    window.open(
      "https://youtu.be/K6CkfrPvk7Q",
      "_blank"
    )
  }
>
  
</div>

      <div
  className="hitbox vader"
  onClick={playImperialMarch}
>
  
</div>

    <div
  className="hitbox star"
  onClick={startAds}
>
</div>


      {/* MIDDLE */}

      <div
  className="hitbox teddybear"
  onClick={handleBearClick}
>
</div>

{bearMessage && (
  <div className="bearMessage">
    {bearMessage}
  </div>
)}
      <div className="hitbox books">
        
      </div>

      <div
  className="hitbox pen"
  onClick={() => router.push("/pen")}
></div>

      <div className="hitbox pencil">
        
      </div>

      <div className={`hitbox radio ${lampOn ? "radioLit" : ""}`}>
  <span className="label">play me</span>
</div>

<div
  className="hitbox chips"
  onClick={() => router.push("/cheetos")}
/>

      {/* BOTTOM */}

      <div className="hitbox about">
        <span className="label">about me</span>
      </div>

      <div
  className="hitbox piano"
  onClick={() => {
    console.log("PIANO CLICKED");
    router.push("/piano");
  }}
>
        <span className="label">music</span>
      </div>
<div
  className="hitbox energy"
  onClick={summonRedBulls}
/>

      <div
        className="hitbox laptop"
        onClick={() =>
          window.open(
            "https://github.com/shristi2217",
            "_blank"
          )
        }
      >
        <span className="label">projects</span>
      </div>

      

      <div className="desk-signature">
        <p>My Desk</p>
        <span>please ignore the Mess</span>
        <span>— Shristi Sharma</span>
      </div>

    <div
  className="hitbox lampshade"
  onClick={toggleLamp}
>
  <span className="label">lamp</span>
</div>

<div
  className="hitbox lampbase"
  onClick={toggleLamp}
>
  <span className="label">lamp</span>
</div>



{showFlowerModal && (
  <div
    className="modalOverlay"
    onClick={() => setShowFlowerModal(false)}
  >
    <div
      className="modalContent"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="closeButton"
        onClick={() => setShowFlowerModal(false)}
      >
        ×
      </button>

      <pre className="asciiFlower">
{`  /-_-\\
 /  /  \\
/  /    \\
\\  \\    /
 \\__\\__/
    \\\\
    -\\\\    ____
      \\\\  /   /
____   \\\\/___/
\\   \\ -//
 \\___\\//-
    -//
     \\\\
     //
    //-
  -//
  //
  \\\\
   \\\\`}
      </pre>

      <p className="flowerCaption">
        for no reason in particular 🌼
      </p>
    </div>
  </div>
)}
{showF1Modal && (
  <div
    className="modalOverlay"
    onClick={() => setShowF1Modal(false)}
  >
    <div
      className="modalContent"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="closeButton"
        onClick={() => setShowF1Modal(false)}
      >
        ×
      </button>

      <img
        src="/ferrarimeme.JPG"
        alt="Ferrari meme"
        className="f1Meme"
      />
    </div>
  </div>
)}
{ads.map((ad) => (
  <div
  key={ad.id}
  className="fakePopup"
 style={{
  top: `${ad.top}px`,
  left: `${ad.left}px`,
}}
>
  <div className="popupHeader">
    <span>Windows</span>

    <div className="closeX">
      ✕
    </div>
  </div>

  <div className="popupBody">
    <div className="popupInner">
      <div className="popupIcon">
        ⚠️
      </div>

      <div className="popupText">
        {ad.message}
      </div>
    </div>

    <button className="popupButton">
      OK
    </button>
  </div>
</div>
))}

{adsEnabled && (
  <button
    className="leaveMeAlone"
    onClick={() => {
      setAdsEnabled(false);
      setAds([]);
    }}
  >
    LEAVE ME ALONE
  </button>
)}


<div
  ref={redBullContainerRef}
  className="redBullContainer"
/>


{showClearButton && (
  <button
    className="clearRedBulls"
    onClick={clearRedBulls}
  >
    clear red bulls
  </button>
)}

{bearMessage && (
  <div className="bearMessage">
    {bearMessage}
  </div>
)}
  


    </main>
  );
  }

