import React, { useEffect, useState, useRef, useMemo } from "react";
import { bool } from "prop-types";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { DoubleSide, Vector3 } from "three";
import "./App.css";
import {
  OrbitControls,
  Stars,
  Text,
  TrackballControls,
  Html,
  Float,
  PerspectiveCamera,
  Text3D,
  OrthographicCamera,
} from "@react-three/drei";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";

const Model = () => {
  const gltf = useLoader(GLTFLoader, "./spine/scene.gltf");
  return (
    <>
      <Suspense fallback={null}>
        <primitive object={gltf.scene} />
      </Suspense>
    </>
  );
};

const CameraControls = () => {
  // Get a reference to the Three.js Camera, and the canvas html element.
  // We need these to setup the OrbitControls class.
  // https://threejs.org/docs/#examples/en/controls/OrbitControls

  const {
    camera,
    gl: { domElement },
  } = useThree();

  // Ref to the controls, so that we can update them on every frame using useFrame
  const controls = useRef();
  useFrame((state) => controls.current.update());
  return (
    <OrbitControls
      ref={controls}
      args={[camera, domElement]}
      enableZoom={false}
      // maxAzimuthAngle={Math.PI / 2}
      maxPolarAngle={Math.PI}
      // minAzimuthAngle={-Math.PI / 2}
      maxZoom={10}
      minZoom={100}
      enablePan={false}
      minPolarAngle={0}
    />
  );
};

const App = ({ open, ...props }) => {
  // let navigate = useNavigate();

  const isHidden = open ? true : false;
  const tabIndex = isHidden ? 0 : -1;

  function Word({ children, ...props }) {
    const color = new THREE.Color();
    const fontProps = {
      font: "http://fonts.gstatic.com/s/montserrat/v24/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtZ6Ew-Y3tcoqK5.ttf",
      fontSize: 2.5,
      letterSpacing: -0.05,
      lineHeight: 1,
      "material-toneMapped": false,
    };
    const ref = useRef();
    const [hovered, setHovered] = useState(false);
    const over = (e) => (e.stopPropagation(), setHovered(true));
    const out = () => setHovered(false);
    // Change the mouse cursor on hover
    useEffect(() => {
      if (hovered) document.body.style.cursor = "pointer";
      return () => (document.body.style.cursor = "auto");
    }, [hovered]);
    // Tie component to the render-loop
    useFrame(({ camera }) => {
      // Make text face the camera
      ref.current.quaternion.copy(camera.quaternion);
      // Animate font color
      ref.current.material.color.lerp(
        color.set(hovered ? "#fa2720" : "#003e75"),
        0.1
      );
    });

    function handleNavigate() {
      console.log(children);
      // if (children == "Experiement") navigate("../");
      // if (children == "News&Info") navigate("../news");
      // if (children == "Partners") navigate("../partners");
      // if (children == "Team") navigate("../team");
      // if (children == "Contact") navigate("../contact");
      // if (children == "Showroom") navigate("../showroom");
    }

    return (
      // <Float floatIntensity={3} speed={2}>
      //    </Float>
      <Text
        ref={ref}
        onPointerOver={over}
        onPointerOut={out}
        {...props}
        {...fontProps}
        children={children}
        onClick={handleNavigate}
      ></Text>
    );
  }

  function Cloud({ count = 4, radius = 20 }) {
    useFrame(() => {});

    // Create a count x count random words with spherical distribution
    const words = useMemo(() => {
      const temp = [];
      const spherical = new THREE.Spherical();
      const phiSpan = Math.PI / (count + 1);
      const thetaSpan = (Math.PI * 2) / count;
      temp.push([
        new THREE.Vector3().setFromSpherical(
          spherical.set(radius, phiSpan * 1, thetaSpan * 0)
        ),
        "Maia",
      ]);
      temp.push([
        new THREE.Vector3().setFromSpherical(
          spherical.set(radius, phiSpan * 1, thetaSpan * 1)
        ),
        "Kurumsal",
        "news",
      ]);
      temp.push([
        new THREE.Vector3().setFromSpherical(
          spherical.set(radius, phiSpan * 1, thetaSpan * 2)
        ),
        "Uygulamalarımız",
      ]);
      temp.push([
        new THREE.Vector3().setFromSpherical(
          spherical.set(radius, phiSpan * 2, thetaSpan * 3)
        ),
        "MaiaFit Academy",
      ]);
      temp.push([
        new THREE.Vector3().setFromSpherical(
          spherical.set(radius, phiSpan * 2, thetaSpan * 5)
        ),
        "İletişim",
      ]);
      // for (let i = 1; i < count + 1; i++)
      //   // Taken from https://discourse.threejs.org/t/can-i-place-obects-on-a-sphere-surface-evenly/4773/6
      //   for (let j = 0; j < count; j++)
      //     temp.push([
      //       new THREE.Vector3().setFromSpherical(
      //         spherical.set(radius, phiSpan * i, thetaSpan * j)
      //       ),
      //       "heterometa",
      //     ]);
      return temp;
    }, [count, radius]);
    return words.map(([pos, word], index) => (
      <Word key={index} position={pos} children={word} />
    ));
  }

  return (
    <div className="App">
      <section id="first" class="story" data-speed="8" data-type="background">
        <div
          class="smashinglogo"
          id="welcomeimg"
          data-type="sprite"
          data-offsetY="100"
          data-Xposition="50%"
          data-speed="-2"
        ></div>
      </section>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 40, 25], fov: 90, zoom: 1.3 }}
      >
        {/* <OrbitControls  /> */}
        <CameraControls />
        {/* <Stars factor={2} /> */}
        <ambientLight intensity={1} color="yellow" />
        <spotLight position={[0, 40, 25]} angle={1} color="yellow" />
        <Model />

        <ambientLight intensity={0.1} />
        {/* <directionalLight color="red" position={[0, 0, 5]} /> */}
        {/* <MenuItemThree />
            <MenuItemThree /> */}
        {/* <Text color="white" fov={60} position={[120, 145, 120]} fontSize={55}>
              hello world!
            </Text> */}
        {/* <fog attach="fog" args={["#202025", 0, 80]} /> */}
        <Cloud count={3} radius={20} />
        {/* <TrackballControls /> */}
      </Canvas>
    </div>
  );
};

export default App;
