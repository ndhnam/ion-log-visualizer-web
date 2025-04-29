import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { Grid } from "@react-three/drei";


function Axes({ size = 2.5 }) {
    return (
      <group>
        {/* X axis - Red */}
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={new Float32Array([0,0,0, size,0,0])}
              count={2}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="red" />
        </line>
        {/* Y axis - Green */}
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={new Float32Array([0,0,0, 0,size,0])}
              count={2}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="green" />
        </line>
        {/* Z axis - Blue */}
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={new Float32Array([0,0,0, 0,0,size])}
              count={2}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="blue" />
        </line>
      </group>
    );
  }
  

export default function Viewport3D({
  objString,
  position = [0, 0, 0],
  quaternion = [0, 0, 0, 1],
}) {
  const [obj3D, setObj3D] = useState(null);

  useEffect(() => {
    if (!objString) return;
    try {
      const loader = new OBJLoader();
      const obj = loader.parse(objString);
      setObj3D(obj);
    } catch (e) {
      setObj3D(null);
      console.error("OBJ Parse Error:", e);
    }
  }, [objString]);

  return (
    <div
      style={{
        width: "100%",
        height: 400,
        background: "#222",
        borderRadius: 8,
      }}
    >
      <Canvas
        style={{
          width: "100%",
          height: 400,
          background: "#1A4D7C",
          borderRadius: 8,
        }}
        camera={{ position: [4, 6, 4], up: [0, 1, 0], zoom: 1.5, fov: 70 }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 8, 5]} intensity={0.7} />
        <OrbitControls />
        <Axes size={1}/>
        <Grid
          position={[0, 0, 0]}
          args={[10, 10]}
          cellSize={0.5}
          cellThickness={0.7}
          sectionColor={"#a0a0a0"}
          cellColor={"#393939"}
          fadeDistance={14}
          fadeStrength={1}
          infiniteGrid={true}
        />
        {obj3D && (
          <primitive
            object={obj3D}
            position={position}
            quaternion={quaternion}
          />
        )}
      </Canvas>
    </div>
  );
}
