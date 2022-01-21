// File ShaderPlane.js

import * as THREE from './lib/Three/three.module.js';
import Stats from './lib/Three/stats.module.js';
import { GUI } from './lib/Three/dat.gui.module.js';
import { OrbitControls } from './lib/Three/controls/OrbitControls.js';
import { TrackballControls } from './lib/Three/controls/TrackballControls.js';


function draw_scene(){

	// Init the stats

	var stats = new Stats();
	stats.setMode(0);
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	stats.domElement.style.zIndex = 100;
	document.body.appendChild( stats.domElement );

	//Create the Three.js WebGL renderer

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( 1920, 1080 ); 
	document.body.appendChild( renderer.domElement );
	renderer.setClearColor(0xEEEEEE);

	// Create the Three.js scene
	var scene = new THREE.Scene();

	// Create a camera and set it into world space
	// This camera will provide a perspective projection
	// Arguments are (fov, aspect, near_plane, far_plane)

	var camera = new THREE.PerspectiveCamera(75, 1024/768, 0.1, 3000);

	/* var mouseControls = new TrackballControls(camera, renderer.domElement);  //Adds control with mouse
	mouseControls.staticMoving = true;
	mouseControls.dynamicDampingFactor = 0.3; */

	// Alternative mouse controller
	var mouseControls = new OrbitControls( camera, renderer.domElement );
	mouseControls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
	mouseControls.dampingFactor = 0.4;

	mouseControls.screenSpacePanning = false;

	//mouseControls.minDistance = 100;
	//mouseControls.maxDistance = 500;

	mouseControls.maxPolarAngle = Math.PI / 2;

	var clock = new THREE.Clock();

	var controls = new function() {
		this.camerax = 15;
		this.cameray = 23;
		this.cameraz = 50;
		this.camerax_prev = 200;
		this.cameray_prev = 400;
		this.cameraz_prev = 800;

		this.angular_velocity = 1.9;
		this.amplitude = 10.0;
		this.lost_factor = 0.01;


		this.updateCamx = function (e) {
			camera.position.x = e;
			camera.lookAt(scene.position);
		}
		this.updateCamy = function (e) {
			camera.position.y = e;
			camera.lookAt(scene.position);
		}
		this.updateCamz = function (e) {
			camera.position.z = e;
			camera.lookAt(scene.position);
		}

		this.updateAngularVelocity = function (e) {
			uniforms_wave.angular_velocity.value = e;
		}

		this.updateAmplitude = function (e) {
			uniforms_wave.amplitude.value = e;
		}

		this.updateLostFactor = function (e) {
			uniforms_wave.lost_factor.value = e;
		}
	}

	const light = new THREE.PointLight( 0xffffff);
	light.position.set(0, 50, 0);
	const lightHelper = new THREE.PointLightHelper(light, 2);
	scene.add(lightHelper);
	scene.add( light );

	/*********************FORMA 2******************************/

	var vertex = [
		"#define PHONG",
		"varying vec3 vViewPosition;",
		"varying vec2 vUv;",
		"varying vec3 vNormal;",
		THREE.ShaderChunk["common"],
		THREE.ShaderChunk["uv_pars_vertex"],
		THREE.ShaderChunk["uv2_pars_vertex"],
		THREE.ShaderChunk["displacementmap_pars_vertex"],
		//THREE.ShaderChunk["envmap_pars_vertex"],
		THREE.ShaderChunk["color_pars_vertex"],
		//THREE.ShaderChunk["fog_pars_vertex"],
		THREE.ShaderChunk["morphtarget_pars_vertex"],
		THREE.ShaderChunk["skinning_pars_vertex"],
		//THREE.ShaderChunk["shadowmap_pars_vertex"],
		THREE.ShaderChunk["logdepthbuf_pars_vertex"],
		THREE.ShaderChunk["clipping_planes_pars_vertex"],
		VSHADER_CODE,
		"void main() {",
		THREE.ShaderChunk["uv_vertex"],
		THREE.ShaderChunk["uv2_vertex"],
		THREE.ShaderChunk["color_vertex"],
		THREE.ShaderChunk["beginnormal_vertex"],
		THREE.ShaderChunk["morphnormal_vertex"],
		THREE.ShaderChunk["skinbase_vertex"],
		THREE.ShaderChunk["skinnormal_vertex"],
		THREE.ShaderChunk["defaultnormal_vertex"],
		"vNormal = normalize( transformedNormal);",
		THREE.ShaderChunk["begin_vertex"],
		THREE.ShaderChunk["displacementmap_vertex"],
		THREE.ShaderChunk["morphtarget_vertex"],
		THREE.ShaderChunk["skinning_vertex"],
		THREE.ShaderChunk["project_vertex"],
		THREE.ShaderChunk["logdepthbuf_vertex"],
		THREE.ShaderChunk["clipping_planes_vertex"],
		"vViewPosition = - mvPosition.xyz;",
		THREE.ShaderChunk["worldpos_vertex"],
		//THREE.ShaderChunk["envmap_vertex"],
		//THREE.ShaderChunk["shadowmap_vertex"],
		//THREE.ShaderChunk["fog_vertex"],
		"vUv = uv;",
		VSHADER_MAIN,
		"}"
	].join("\n");

		var fragment = [
		"#define PHONG",
		"uniform vec3 diffuse;",
		"uniform float opacity;",
		"uniform vec3 ambient;",
		"uniform vec3 emissive;",
		"uniform vec3 specular;",
		"uniform float shininess;",
		"varying vec2 vUv;",
		THREE.ShaderChunk["common"],
		THREE.ShaderChunk["packing"],
		THREE.ShaderChunk["color_pars_fragment"],
		THREE.ShaderChunk["uv_pars_fragment"],
		THREE.ShaderChunk["uv2_pars_fragment"],
	 	//THREE.ShaderChunk["map_pars_fragment"],
		//THREE.ShaderChunk["alphamap_pars_fragment"],
		//THREE.ShaderChunk["aomap_pars_fragment"],
		//THREE.ShaderChunk["lightmap_pars_fragment"],
		//THREE.ShaderChunk["emissivemap_pars_fragment"],
		//THREE.ShaderChunk["envmap_pars_fragment"],
		//THREE.ShaderChunk["gradientmap_pars_fragment"],
		//THREE.ShaderChunk["fog_pars_fragment"],
		THREE.ShaderChunk["bsdfs"],
		THREE.ShaderChunk["lights_pars"],
		THREE.ShaderChunk["lights_phong_pars_fragment"],
		//THREE.ShaderChunk["shadowmap_pars_fragment"],
		//THREE.ShaderChunk["bumpmap_pars_fragment"],
		//THREE.ShaderChunk["normalmap_pars_fragment"],
		//THREE.ShaderChunk["specularmap_pars_fragment"],
		//THREE.ShaderChunk["logdepthbuf_pars_fragment"],
		THREE.ShaderChunk["clipping_planes_pars_fragment"],
		FSHADER_CODE,
		"void main() {",
		"vec3 color = vec3(1.0);",
		FSHADER_MAIN,
		"vec4 diffuseColor = vec4( color, opacity );",
		"ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );",
		"vec3 totalEmissiveRadiance = emissive;",
		//THREE.ShaderChunk["logdepthbuf_fragment"],
		//THREE.ShaderChunk["map_fragment"],
		//THREE.ShaderChunk["color_fragment"],
		//THREE.ShaderChunk["alphamap_fragment"],
		//THREE.ShaderChunk["alphatest_fragment"],
		THREE.ShaderChunk["specularmap_fragment"],
		//THREE.ShaderChunk["normal_flip"],
		//THREE.ShaderChunk["normal_fragment"],
		//THREE.ShaderChunk["lights_phong_fragment"],
		//THREE.ShaderChunk["lights_template"],
		//THREE.ShaderChunk["aomap_fragment"],
		"vec3 outgoingLight = reflectedLight.directDiffuse +reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;",
		//THREE.ShaderChunk["envmap_fragment"],
		"gl_FragColor = vec4( outgoingLight, diffuseColor.a );",
		//THREE.ShaderChunk["premultiplied_alpha_fragment"],
		//THREE.ShaderChunk["tonemapping_fragment"],
		//THREE.ShaderChunk["encodings_fragment"],
		//THREE.ShaderChunk["fog_fragment"],
		"}"
	].join("\n");
	
	var uniforms_sphere = THREE.UniformsUtils.merge([
		THREE.UniformsLib['ambient'],
		THREE.UniformsLib['lights'],
		THREE.UniformsUtils.clone(THREE.ShaderLib['phong'].uniforms),
		{
		  diffuse: {type: 'c',value: new THREE.Color(0xFF00FF)},
		  dirSpecularWeight: {type: "v3",value: new THREE.Vector3(1, 1, 1)},
		  time: { value: 0.0 },
		  is_sphere:  {value: 1},
		  }
	  ]);
	

	var material_sphere = new THREE.ShaderMaterial({
		uniforms: uniforms_sphere,
		vertexShader: vertex,
		fragmentShader: fragment,
		lights: true
	});

	var uniforms_wave = THREE.UniformsUtils.merge([
		THREE.UniformsLib['ambient'],
		THREE.UniformsLib['lights'],
		THREE.UniformsUtils.clone(THREE.ShaderLib['phong'].uniforms),
		{
		  //emissive: {type: 'c',value: new THREE.Color(0x000000)},
		  ambient: {type: 'c',value: new THREE.Color(0xFFFFFF)},
		  diffuse: {type: 'c',value: new THREE.Color(0xFF00FF)},
		  dirSpecularWeight: {type: "v3",value: new THREE.Vector3(1, 1, 1)},
		  time: { value: 0.0 },
		  angular_velocity: {value: controls.angular_velocity},
		  amplitude: {value: controls.amplitude},
		  lost_factor: {value: controls.lost_factor},
		  is_sphere:  {value: 0}
		}
	  ]);

	  var material_wave = new THREE.ShaderMaterial({
		uniforms: uniforms_wave,
		vertexShader: vertex,
		fragmentShader: fragment,
		lights: true,
		side: THREE.DoubleSide

	});



	/*********************FORMA 1******************************/

	/*
	var uniforms_sphere = THREE.UniformsUtils.merge([
		THREE.UniformsUtils.clone(Three.uniforms),
		{
			time: { value: 1.0 },
			is_sphere:  {value: 1}
		}
	]);

	var material_sphere = new THREE.ShaderMaterial({
	  uniforms: uniforms_sphere,
	  vertexShader: VSHADER_SOURCE,
	  fragmentShader: THREE.ShaderLib["phong"].fragmentShader,
	  lights: true,
	});
	*/

	


	/*
	var uniforms_wave = THREE.UniformsUtils.merge([
		THREE.UniformsUtils.clone(phongShader.uniforms),
		{
			time: { value: 1.0 },
			angular_velocity: {value: controls.angular_velocity},
			amplitude: {value: controls.amplitude},
			lost_factor: {value: controls.lost_factor},
			is_sphere:  {value: 0}
		}
	]);

	var material_wave = new THREE.ShaderMaterial({
	  uniforms: uniforms_wave,
	  vertexShader: VSHADER_SOURCE,
	  fragmentShader: THREE.ShaderLib["phong"].fragmentShader,
	  lights: true
	});

	*/

	var sphere = new THREE.SphereGeometry( 5, 5, 5 );
	sphere.translate(0,20,0);

	sphere = new THREE.Mesh(sphere, material_sphere);
	scene.add(sphere);

	var wave = new THREE.PlaneGeometry( 400, 400, 250, 250 );
	wave.rotateX(-Math.PI/2);

	wave = new THREE.Mesh(wave, material_wave);
	scene.add(wave);

	var globalaxes = new THREE.AxesHelper( 1000 );
	scene.add(globalaxes);  // Global set of coordinate axis

	var localaxes = new THREE.AxesHelper( 200 );
	wave.add(localaxes); // Set of axis local to plane

	var gui = new GUI();
	var f1 = gui.addFolder('Camera');
	// Sliders to reposition camera
	var controlx = f1.add(controls, 'camerax', -3000,3000).onChange(controls.updateCamx); 
	var controly = f1.add(controls, 'cameray', -3000,3000).onChange(controls.updateCamy);
	var controlz = f1.add(controls, 'cameraz', -3000,3000).onChange(controls.updateCamz);

	var f2 = gui.addFolder('Wave');
	var controly = f2.add(controls, 'angular_velocity', 0, 5).onChange(controls.updateAngularVelocity);
	var controlz = f2.add(controls, 'amplitude', 0, 10).onChange(controls.updateAmplitude);
	var controlz = f2.add(controls, 'lost_factor', 0, 0.1).onChange(controls.updateLostFactor);


	f1.open();


	camera.position.set(controls.camerax,controls.cameray,controls.cameraz);  // Inits camera position
	camera.lookAt(scene.position);  // Camera will look to origin



	function render() {
		mouseControls.update(); // Effects control with mouse
		// Checks if camera position was changed through GUI
		if (controls.camerax_prev != camera.position.x) {
			controls.camerax = camera.position.x;
			controls.camerax_prev = camera.position.x;
			controlx.updateDisplay(); // Updates GUI if camera moved through mouse
		}

		if (controls.cameray_prev != camera.position.y) {
			controls.cameray = camera.position.y;
			controls.cameray_prev = camera.position.y;
			controly.updateDisplay();
		}

		if (controls.cameraz_prev != camera.position.z) {
			controls.cameraz = camera.position.z;
			controls.cameraz_prev = camera.position.z;
			controlz.updateDisplay();
		}

		var delta = clock.getDelta();

		uniforms_wave.time.value += delta * 2;
		uniforms_sphere.time.value += delta * 2;


		requestAnimationFrame( render );
		stats.update();
		renderer.render( scene, camera ); 
	} 

	render();  // Inits the loop
}

draw_scene();
