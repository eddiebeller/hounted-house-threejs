import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Fog
const fog = new THREE.Fog('#262837', 1, 15);
// const fog = new THREE.Fog('#ff0000', 1, 15);
scene.fog = fog;
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

// Door Texture
const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load(
	'/textures/door/ambientOcclusion.jpg'
);
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

// Walls texture
const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg');
const bricksAmbientOcclusionTexture = textureLoader.load(
	'/textures/bricks/ambientOcclusion.jpg'
);
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg');
const bricksRoughnessTexture = textureLoader.load(
	'/textures/bricks/roughness.jpg'
);

// Floor textures
const grassColorTexture = textureLoader.load('/textures/grass/color.jpg');
const grassAmbientOcclusionTexture = textureLoader.load(
	'/textures/grass/ambientOcclusion.jpg'
);
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg');
const grassRoughnessTexture = textureLoader.load(
	'/textures/grass/roughness.jpg'
);
grassColorTexture.repeat.set(8, 8);
grassAmbientOcclusionTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);

grassColorTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

grassColorTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

/**
 * House
 */
const house = new THREE.Group();
scene.add(house);

/**
 * Walls
 */
const walls = new THREE.Mesh(
	// geometry
	new THREE.BoxGeometry(4, 2.5, 4),
	// material
	new THREE.MeshStandardMaterial({
		map: bricksColorTexture,
		aoMap: bricksAmbientOcclusionTexture,
		normalMap: bricksNormalTexture,
		roughnessMap: bricksRoughnessTexture,
	})
);
walls.geometry.setAttribute(
	'uv2',
	new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);
walls.position.y = 2.5 / 2;
house.add(walls);

/**
 * Roof
 */
const roof = new THREE.Mesh(
	new THREE.ConeGeometry(3.5, 1, 4),
	new THREE.MeshStandardMaterial({ color: '#b35f45' })
);
roof.position.y = 2.5 + 0.5;
roof.rotation.y = Math.PI * 0.25;
house.add(roof);

/**
 * Door
 */
const door = new THREE.Mesh(
	new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
	new THREE.MeshStandardMaterial({
		map: doorColorTexture,
		transparent: true,
		alphaMap: doorAlphaTexture,
		aoMap: doorAmbientOcclusionTexture,
		displacementMap: doorHeightTexture,
		displacementScale: 0.1,
		normalMap: doorNormalTexture,
		metalnessMap: doorMetalnessTexture,
		roughnessMap: doorRoughnessTexture,
	})
);
door.geometry.setAttribute(
	'uv2',
	new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.y = 1;
door.position.z = 2 + 0.01;
house.add(door);

/**
 * Bush
 */

const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#82CD47' });

const bushData = [
	{
		scale: {
			x: 0.5,
			y: 0.5,
			z: 0.5,
		},
		position: {
			x: 0.8,
			y: 0.2,
			z: 2.2,
		},
	},
	{
		scale: {
			x: 0.25,
			y: 0.25,
			z: 0.25,
		},
		position: {
			x: 1.4,
			y: 0.1,
			z: 2.1,
		},
	},
	{
		scale: {
			x: 0.4,
			y: 0.4,
			z: 0.4,
		},
		position: {
			x: -0.8,
			y: 0.1,
			z: 2.1,
		},
	},
	{
		scale: {
			x: 0.15,
			y: 0.15,
			z: 0.15,
		},
		position: {
			x: -1,
			y: 0.05,
			z: 2.6,
		},
	},
];

// for (let i = 0; i < bushData.length; i++) {
// 	const coordinates = bushData[i];
// 	const bush = new THREE.Mesh(bushGeometry, bushMaterial);
// 	bush.scale.set(coordinates.scale.x, coordinates.scale.y, coordinates.scale.z);
// 	bush.position.set(coordinates.position.x, coordinates.position.y, coordinates.position.z);
// 	house.add(bush);
// }

bushData.forEach((coordinates) => {
	const bush = new THREE.Mesh(bushGeometry, bushMaterial);
	bush.scale.set(coordinates.scale.x, coordinates.scale.y, coordinates.scale.z);
	bush.position.set(
		coordinates.position.x,
		coordinates.position.y,
		coordinates.position.z
	);
	bush.castShadow = true
	house.add(bush);
});

// Gravestones
const gravestones = new THREE.Group();
scene.add(gravestones);

// Gravestones Mehs and Material

const gravestoneGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const gravestoneMaterial = new THREE.MeshStandardMaterial({ color: '#B2b6B1' });

for (let i = 0; i < 40; i++) {
	const angle = Math.random() * Math.PI * 2; // Random angle
	const radius = 3 + Math.random() * 6;
	const x = Math.cos(angle) * radius;
	const z = Math.sin(angle) * radius;

	const gravestone = new THREE.Mesh(gravestoneGeometry, gravestoneMaterial);
	gravestone.position.set(x, 0.3, z);
	gravestone.rotation.y = (Math.random() - 0.5) * 0.4;
	gravestone.rotation.z = (Math.random() - 0.5) * 0.4;

	gravestone.castShadow = true

	gravestones.add(gravestone);
}

// Ghost
const ghost1 = new THREE.PointLight('#ff00ff', 2, 3);
scene.add(ghost1)

const ghost2 = new THREE.PointLight('#00ffff', 2, 3);
scene.add(ghost2)

const ghost3 = new THREE.PointLight('#ffff00', 2, 3);
scene.add(ghost3)



// Floor
const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(30, 30),
	new THREE.MeshStandardMaterial({
		map: grassColorTexture,
		aoMap: grassAmbientOcclusionTexture,
		normalMap: grassNormalTexture,
		roughnessMap: grassRoughnessTexture,
	})
);
floor.geometry.setAttribute(
	'uv2',
	new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12);
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001);
gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001);
gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001);
gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001);
scene.add(moonLight);

//Point Light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7);

doorLight.position.set(0, 2.25, 2.7);
house.add(doorLight);

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener('resize', () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor('#262837');

/**
 * Shadows
 */
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

moonLight.castShadow = true
doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
floor.receiveShadow = true

// Optimize the shadows
doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7
ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7
ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7


/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Update ghost
	const ghostAngle = elapsedTime * 0.5;
	ghost1.position.x = Math.cos(ghostAngle) * 4
	ghost1.position.z = Math.sin(ghostAngle) * 4
	ghost1.position.y = Math.sin(elapsedTime * 3)

	const ghost2Angle =  - elapsedTime * 0.32;
	ghost2.position.x = Math.cos(ghost2Angle) * 6
	ghost2.position.z = Math.sin(ghost2Angle) * 6
	ghost2.position.y = Math.sin(elapsedTime * 3) + Math.sin(elapsedTime * 2.4)

	const ghost3Angle = - elapsedTime * 0.18;
	ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.35))
	ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
	ghost3.position.y = Math.sin(elapsedTime * 5) + Math.sin(elapsedTime * 2)

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
