import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, MeshDistortMaterial, Float, Text, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface RunwayProps {
  velocity: number; // Daily budget
}

function RunwayMesh({ velocity }: RunwayProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);
  
  // Calculate health from 0 to 1 based on velocity (0-1500 range for more sensitivity)
  const health = Math.min(1, Math.max(0, velocity / 1500));
  
  // Visual parameters based on health
  const color = new THREE.Color().setHSL(health * 0.3, 1, 0.5);
  const narrowness = 0.2 + (health * 3.8); // 0.2 at min health, 4 at max health
  const distortion = (1 - health) * 2.5; // Up to 2.5 distortion at min health
  const speed = 2 + (1 - health) * 10; // Faster vibration at low health

  useFrame((state) => {
    if (meshRef.current) {
      // Floating and shaking
      const shake = (1 - health) * 0.05;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.position.x = (Math.random() - 0.5) * shake;
      
      // Dramatic tilting
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 3) * (1 - health) * 0.4;
      
      // Update narrowing scale
      meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, narrowness, 0.1);
    }
    
    // Flash emissive intensity when low health
    if (materialRef.current && health < 0.3) {
      materialRef.current.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 15) * 0.5;
    }
  });

  return (
    <group>
      <Float speed={5} rotationIntensity={1} floatIntensity={1}>
        <mesh ref={meshRef} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1, 15, 64, 64]} />
          <MeshDistortMaterial
            ref={materialRef}
            color={color}
            speed={speed}
            distort={distortion}
            radius={1}
            emissive={color}
            emissiveIntensity={0.5}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </Float>
      
      <gridHelper 
        args={[40, 40, health < 0.3 ? 0xff0000 : 0x444444, 0x111111]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -1, 0]} 
      />

      <Text
        position={[0, 2, -4]}
        fontSize={0.8}
        color={health < 0.3 ? "#ff0000" : "white"}
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
      >
        {health < 0.3 ? "SYSTEM FAILURE" : "STATUS: STABLE"}
      </Text>
      
      {health < 0.3 && (
        <Text
          position={[0, 0, -2]}
          fontSize={0.3}
          color="#ff0000"
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
        >
          RUNWAY DISINTEGRATING
        </Text>
      )}
    </group>
  );
}

export function Runway({ velocity }: RunwayProps) {
  return (
    <div style={{ height: '350px', width: '100%', background: '#000', borderRadius: '12px', overflow: 'hidden', marginBottom: '1rem', border: '1px solid #222' }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 3, 6]} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <spotLight position={[0, 5, 0]} angle={0.3} penumbra={1} intensity={2} color={velocity < 500 ? "red" : "white"} />
        <RunwayMesh velocity={velocity} />
        <fog attach="fog" args={['#000', 2, 12]} />
        <Environment preset="night" />
      </Canvas>
    </div>
  );
}
