import './App.css';
import { useState, useEffect } from 'react';

function App() {

  const [bodies, setBodies] = useState([
    {
      mass: 100,
      color: "#ff0000",
      ix: 0,
      iy: 0,
      ivx: 0,
      ivy: 0,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      history: [],
    },
    {
      mass: 100,
      color: "#00ff00",
      ix: 0,
      iy: 0,
      ivx: 0,
      ivy: 0,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      history: [],
    },
  ]);
  const [running, setRunning] = useState(false);
  const [showMenu, setShowMenu] = useState(true);

  const draw = (ctx, bodies) => {
    // deep copy of bodies
    const bodyCopy = bodies.map((body) => {
      return { ...body };
    });
    // draw bodies
    let width = window.innerWidth/2;
    let height = window.innerHeight/2;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    bodies.forEach((body) => {
      // if not running, draw velocity vectors
      if (!running) {
        ctx.strokeStyle = "#ffffff";
        ctx.strokeWidth = 1;
        ctx.beginPath();
        ctx.moveTo(width + body.x, height - body.y);
        ctx.lineTo(width + body.x + body.vx * 5, height - body.y - body.vy * 5);
        ctx.stroke();

        // draw arrowhead outwards from body
        const angle = Math.atan2(body.vy, body.vx);
        console.log(body.color, angle)
        if (body.vx >= 0) {
          // first quadrant
          if (body.vy >= 0) {
            ctx.beginPath();
            ctx.strokeStyle = "#ffffff";
            ctx.moveTo(width + body.x + body.vx * 5, height - body.y - body.vy * 5);
            ctx.lineTo(
              width + body.x + body.vx * 5 - 5 * Math.cos(angle - Math.PI / 4),
              height - body.y - body.vy * 5 + 5 * Math.sin(angle - Math.PI / 4)
            );
            ctx.stroke();
            ctx.beginPath();
            ctx.strokeStyle = "#ffffff";
            ctx.moveTo(width + body.x + body.vx * 5, height - body.y - body.vy * 5);
            ctx.lineTo(
              width + body.x + body.vx * 5 - 5 * Math.cos(angle + Math.PI / 4),
              height - body.y - body.vy * 5 + 5 * Math.sin(angle + Math.PI / 4)
            );
            ctx.stroke();
          }
          // fourth quadrant
          else {
            ctx.beginPath();
            ctx.strokeStyle = "#ffffff";
            ctx.moveTo(width + body.x + body.vx * 5, height - body.y - body.vy * 5);
            ctx.lineTo(
              width + body.x + body.vx * 5 - 5 * Math.cos(angle - Math.PI / 4),
              height - body.y - body.vy * 5 + 5 * Math.sin(angle - Math.PI / 4)
            );
            ctx.stroke();
            ctx.beginPath();
            ctx.strokeStyle = "#ffffff";
            ctx.moveTo(width + body.x + body.vx * 5, height - body.y - body.vy * 5);
            ctx.lineTo(
              width + body.x + body.vx * 5 - 5 * Math.cos(angle + Math.PI / 4),
              height - body.y - body.vy * 5 + 5 * Math.sin(angle + Math.PI / 4)
            );
            ctx.stroke();
          }
        }
        else {
          // second quadrant
          if (body.vy >= 0) {
            ctx.beginPath();
            ctx.strokeStyle = "#ffffff";
            ctx.moveTo(width + body.x + body.vx * 5, height - body.y - body.vy * 5);
            ctx.lineTo(
              width + body.x + body.vx * 5 - 5 * Math.cos(angle - Math.PI / 4),
              height - body.y - body.vy * 5 + 5 * Math.sin(angle - Math.PI / 4)
            );
            ctx.stroke();
            ctx.beginPath();
            ctx.strokeStyle = "#ffffff";
            ctx.moveTo(width + body.x + body.vx * 5, height - body.y - body.vy * 5);
            ctx.lineTo(
              width + body.x + body.vx * 5 - 5 * Math.cos(angle + Math.PI / 4),
              height - body.y - body.vy * 5 + 5 * Math.sin(angle + Math.PI / 4)
            );
            ctx.stroke();
          }
          // third quadrant
          else {
            ctx.beginPath();
            ctx.strokeStyle = "#ffffff";
            ctx.moveTo(width + body.x + body.vx * 5, height - body.y - body.vy * 5);
            ctx.lineTo(
              width + body.x + body.vx * 5 - 5 * Math.cos(angle - Math.PI / 4),
              height - body.y - body.vy * 5 + 5 * Math.sin(angle - Math.PI / 4)
            );
            ctx.stroke();
            ctx.beginPath();
            ctx.strokeStyle = "#ffffff";
            ctx.moveTo(width + body.x + body.vx * 5, height - body.y - body.vy * 5);
            ctx.lineTo(
              width + body.x + body.vx * 5 - 5 * Math.cos(angle + Math.PI / 4),
              height - body.y - body.vy * 5 + 5 * Math.sin(angle + Math.PI / 4)
            );
            ctx.stroke();
          }
        }
      }
      // else draw path history as a thin line
      else {
        ctx.fillStyle = body.color;
        body.history.forEach((path) => {
          ctx.beginPath();
          ctx.arc(width + path.x, height - path.y, 1, 0, 2 * Math.PI);
          ctx.fill();
        });

        // update current position
        let ax = 0;
        let ay = 0;
        bodyCopy.forEach((other) => {
          if (body !== other) {
            const dx = other.x - body.x;
            const dy = other.y - body.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            // if distance is 0, skip
            if (d === 0) {
              console.log("skip")
              return;
            }
            const f = 5 * (body.mass * other.mass) / (d * d);
            console.log(f)
            ax += f * dx / d;
            ay += f * dy / d;
          }
        });
        body.vx += ax / body.mass;
        body.vy += ay / body.mass;
        body.x += body.vx * 0.1;
        body.y += body.vy * 0.1;

        // store history
        body.history.push({ x: body.x, y: body.y });
        if (body.history.length > 100) {
          body.history.shift();
        }
      }

      // draw body
      ctx.fillStyle = body.color;
      ctx.beginPath();
      // origin at center, radius porportional to mass
      ctx.arc(width + body.x, height - body.y, Math.sqrt(body.mass), 0, 2 * Math.PI);
      ctx.fill();
    });

    return bodies;
  }

  useEffect(() => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    
    draw(ctx, bodies);

    let interval;
    if (running) {
      interval = setInterval(() => {
        setBodies(draw(ctx, bodies));
      }, 10);
    }
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, bodies]);

  return (
    <>
      {/* screen divided into 1/4 and 3/4 */}
      <div className="grid grid-cols-1 bg-black md:grid-cols-4 h-screen flex">
          <canvas id="canvas"></canvas>
          {running ? (
            // stop button
            <button
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                setRunning(false);
                // reset bodies
                setBodies(
                  bodies.map((body) => {
                    return {
                      ...body,
                      x: body.ix,
                      y: body.iy,
                      vx: body.ivx,
                      vy: body.ivy,
                      history: [],
                    };
                  })
                );
              }}
            >
              Stop
            </button>
          ) : (
            <button
              className="absolute top-2 right-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                // if any of the values are empty, alert and return
                for (let i = 0; i < bodies.length; i++) {
                  if (
                    bodies[i].mass === "" ||
                    bodies[i].ix === "" ||
                    bodies[i].iy === "" ||
                    bodies[i].ivx === "" ||
                    bodies[i].ivy === ""
                  ) {
                    alert("Please fill in all values");
                    return;
                  }
                }
                setShowMenu(false);
                setRunning(true);
              }}
            >
              Start
            </button>
          )}
        {/* menu */}
        {showMenu ? (
        <div className="absolute top-2 left-2 bg-white p-4 rounded-lg w-1/2 lg:w-1/3 flex container-height">
        <div className="overflow-auto p-2 h-full">
          {/* current bodies */}
          <div className="flex mb-4">
            <h2 className="text-2xl mb-2 font-bold">Bodies</h2>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded justify-self-end ml-auto"
              onClick={() => {
                setBodies([
                  ...bodies,
                  {
                    mass: 100,
                    color: "#0000ff",
                    ix: 0,
                    iy: 0,
                    ivx: 0,
                    ivy: 0,
                    x: 0,
                    y: 0,
                    vx: 0,
                    vy: 0,
                    history: [],
                  },
                ]);
              }}
            >
              Add Body
            </button>
            <button 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded justify-self-end ml-2"
              onClick={() => setShowMenu(!showMenu)}
            >
              Hide Menu
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-auto">
            {bodies.map((body, index) => (
              <div key={index} className="border-gray-600 border-2 rounded-lg p-2 relative">
                <h3 className="font-semibold underline">Body {index + 1}</h3>
                <div className="flex mb-1">
                  <label>Mass: </label>
                  <input
                    className="w-1/2 ml-2 border-gray-600 border-2 rounded-lg pl-1"
                    type="number"
                    value={body.mass}
                    onChange={(e) => {
                      const newBodies = [...bodies];
                      newBodies[index].mass = parseInt(e.target.value);
                      setBodies(newBodies);
                    }}
                  />
                </div>
                <div className="flex mb-1">
                  <label>Color: </label>
                  <input
                    className="w-1/2 ml-2"
                    type="color"
                    value={body.color}
                    onChange={(e) => {
                      const newBodies = [...bodies];
                      newBodies[index].color = e.target.value;
                      setBodies(newBodies);
                    }}
                  />
                </div>
                <h4 className="font-semibold">Initial Conditions:</h4>
                <div className="flex mb-1">
                  <label>Pos: </label>
                  <input
                    className="w-1/4 ml-2 border-gray-600 border-2 rounded-lg pl-1"
                    type="number"
                    value={body.ix}
                    onChange={(e) => {
                      const newBodies = [...bodies];
                      newBodies[index].ix = parseInt(e.target.value);
                      newBodies[index].x = parseInt(e.target.value);
                      setBodies(newBodies);
                    }}
                  />
                  <input
                    className="w-1/4 ml-2 border-gray-600 border-2 rounded-lg pl-1"
                    type="number"
                    value={body.iy}
                    onChange={(e) => {
                      const newBodies = [...bodies];
                      newBodies[index].iy = parseInt(e.target.value);
                      newBodies[index].y = parseInt(e.target.value);
                      setBodies(newBodies);
                    }}
                  />
                </div>
                <div className="flex">
                  <label>Vel: </label>
                  <input
                    className="w-1/4 ml-2 border-gray-600 border-2 rounded-lg pl-1"
                    type="number"
                    value={body.ivx}
                    onChange={(e) => {
                      const newBodies = [...bodies];
                      newBodies[index].ivx = parseInt(e.target.value);
                      newBodies[index].vx = parseInt(e.target.value);
                      setBodies(newBodies);
                    }}
                  />
                  <input
                    className="w-1/4 ml-2 border-gray-600 border-2 rounded-lg pl-1"
                    type="number"
                    value={body.ivy}
                    onChange={(e) => {
                      const newBodies = [...bodies];
                      newBodies[index].ivy = parseInt(e.target.value);
                      newBodies[index].vy = parseInt(e.target.value);
                      setBodies(newBodies);
                    }}
                  />
                </div>
                {/* x button */}
                <button
                  className="absolute top-0 right-0 hover:text-red-700 text-gray-400 font-bold px-2"
                  onClick={() => {
                    const newBodies = [...bodies];
                    newBodies.splice(index, 1);
                    setBodies(newBodies);
                  }}
                >
                  x
                </button>
              </div>
            ))}
          </div>
        </div> 
        </div>) : !running && (
          <button 
            className="absolute top-2 left-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setShowMenu(!showMenu)}
          >
            Show Menu
          </button>
        )}
      </div>
    </>
  );
}

export default App;
