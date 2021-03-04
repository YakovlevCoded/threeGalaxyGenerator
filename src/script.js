import './style.css'
import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { PointsMaterial } from 'three'

/**
 * Base
 */
const textureLoader = new THREE.TextureLoader();
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Galaxy
 */
const paramets = {}
paramets.count = 85000;
paramets.size = 0.02;
paramets.distance = 23;
paramets.radius = 5;
paramets.branches = 5;
paramets.spin = 1;
paramets.randomness = 6;
paramets.randomnessPower = 2;
paramets.insideColor = '#ff6030';
paramets.outsideColor = '#1b3984';
let geometry = null;
let material = null;
let points = null;

const generateGalaxy = () => {
    if (points !== null) {
        geometry.dispose();
        material.dispose();
        scene.remove(points);
    }
    geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(paramets.count * 3);
    const colors = new Float32Array(paramets.count * 3);
    const colorInside = new THREE.Color(paramets.insideColor);
    const colorOutside = new THREE.Color(paramets.outsideColor);

    for (let i = 0; i < paramets.count; i++) {
        const i3 = i * 3;
        
        // Position
        const radius = Math.random() * paramets.radius;
        const spinAngle = radius * paramets.spin;
        const branchAngle = (i % paramets.branches) / paramets.branches * Math.PI * 2;

        const randomX = (Math.pow(Math.random(), paramets.randomnessPower) * (Math.random < 0.5 ? 1 : -1))
        const randomY = (Math.pow(Math.random(), paramets.randomnessPower) * (Math.random < 0.5 ? 1 : -1))
        const randomZ = (Math.pow(Math.random(), paramets.randomnessPower) * (Math.random < 0.5 ? 1 : -1))

        positions[i3    ] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

        // Color
        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / paramets.radius)

        colors[i3    ] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    material = new PointsMaterial({
        size: paramets.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })

    points = new THREE.Points(geometry, material);
    scene.add(points);
};
generateGalaxy()

gui.add(paramets, 'count', 0, 1000000, 1).onFinishChange(generateGalaxy);
gui.add(paramets, 'size', 0, 0.5, 0.001).onFinishChange(generateGalaxy);
gui.add(paramets, 'distance', 0, 100, 0.001).onFinishChange(generateGalaxy);
gui.add(paramets, 'radius', 0.01, 20, 0.01).onFinishChange(generateGalaxy);
gui.add(paramets, 'branches', 2, 20, 1).onFinishChange(generateGalaxy);
gui.add(paramets, 'spin', -5, 5, 0.01).onFinishChange(generateGalaxy);
gui.add(paramets, 'randomness', 0, 20, 0.01).onFinishChange(generateGalaxy);
gui.add(paramets, 'randomnessPower', 0, 10, 0.01).onFinishChange(generateGalaxy);
gui.addColor(paramets, 'insideColor').onFinishChange(generateGalaxy);
gui.addColor(paramets, 'outsideColor').onFinishChange(generateGalaxy);
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Animating

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
console.log(points);

const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    points.rotation.y = elapsedTime/8;
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()