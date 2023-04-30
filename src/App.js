import './App.css'

import { 
  useState,
  useRef,
  useMemo
 } from 'react';

import * as THREE from 'three';

import {
  useFrame,
  useThree,
  Canvas,
  extend
} from "@react-three/fiber";

import { 
  Lightformer, 
  Environment,
  shaderMaterial,
  OrbitControls
} from "@react-three/drei";

import glsl from 'babel-plugin-glsl/macro';



//
const vertexShader = glsl`
  uniform float u_time;
  varying float vZ;
  varying vec3 vPosition;
  varying vec3 vNormal;

  void main() {
    vPosition = position;
    vNormal = normal;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    modelPosition.z += sin(modelPosition.y * 5.0 + u_time * 3.0) * 0.1;
    modelPosition.x += sin(modelPosition.y * 5.0 + u_time * 2.0) * 0.1;
    
    vZ = modelPosition.y;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
  }
`
const fragmentShader = glsl`
  uniform float u_time;
  varying vec3 vPosition;
  varying vec3 vNormal;
  uniform vec3 u_colorA;
  uniform vec3 u_colorB;
  uniform vec3 u_cameraPosition; // declare the uniform variable
  varying float vZ;

  void main() {
    vec3 viewDirection = normalize(u_cameraPosition - vPosition);
    float fresnel = dot(viewDirection, vNormal);
    vec3 color = (vec3(u_colorB) - vec3( fresnel )*2.0);
    gl_FragColor = vec4(color, 1.0);
  }
  `
  //vec3 color = mix(u_colorA, u_colorB, vZ * 2.0 + 0.5); 

//
const Geometry = () => {
  const camera = useThree((state) => state.camera)
  const mesh = useRef();

  const uniforms = useMemo(
    () => ({
      u_time:   { value: 0.0 },
      u_cameraPosition: { value: new THREE.Vector3() },
      u_colorA: { value: new THREE.Color("#FFE486") },
      u_colorB: { value: new THREE.Color("white") },
    }), []
  );

  useFrame((state) => {
    const { clock } = state;
    mesh.current.material.uniforms.u_time.value = clock.getElapsedTime();
    mesh.current.material.uniforms.u_cameraPosition.value = state.camera.position;
  });

  return (
    <mesh 
      ref={mesh}
    >
      <sphereGeometry args={[2, 128, 128]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
        wireframe={false}
      />
    </mesh>
  );
};


//
const Scene = () => {
  return (
    <Canvas>
      <Enviroment/>
      <OrbitControls/>
      <Geometry/>
    </Canvas>
  );
};

//
const Enviroment = () => {
  return (
    <Environment resolution={1024} >
    {/* Ceiling */}
    <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, -9]} scale={[10, 1, 1]} />
    <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, -6]} scale={[10, 1, 1]} />
    <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, -3]} scale={[10, 1, 1]} />
    <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 0]} scale={[10, 1, 1]} />
    <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 3]} scale={[10, 1, 1]} />
    <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 6]} scale={[10, 1, 1]} />
    <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 9]} scale={[10, 1, 1]} />
    {/* Sides */}
    <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-50, 2, 0]} scale={[100, 2, 1]} />
    <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[50, 2, 0]} scale={[100, 2, 1]} />
    {/* Key */}
    {/*
    <Lightformer form="ring" color="red" intensity={10} scale={2} position={[10, 5, 10]} onUpdate={(self) => self.lookAt(0, 0, 0)} />
    <mesh scale={100}>
      <sphereGeometry args={[1, 64, 64]} />
      <LayerMaterial side={THREE.BackSide}>
        <Color color="blue" alpha={1} mode="normal" />
        <Depth colorA="#00ffff" colorB="#ff8f00" alpha={0.5} mode="normal" near={0} far={300} origin={[100, 100, 100]} />
        <Noise mapping="local" type="cell" scale={0.5} mode="softlight" />
      </LayerMaterial>
    </mesh>
    */}
  </Environment>
  );
}

function App() {
  return (
      <Scene/>
  )
}

export default App;
