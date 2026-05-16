// src/data/projects.ts
// Datos de los proyectos del portafolio

export interface ProjectFile {
  ext: string;
  name: string;
  size: string;
  code: string;
}

export interface ProjectMeta {
  l: string;
  v: string;
}

export interface Project {
  genre: string;
  title: string;
  desc: string;
  mechanics: string;
  tech: string[];
  meta: ProjectMeta[];
  screenshots: string[];
  files: ProjectFile[];
  cardEmoji: string;
  cardGradient: string;
  cardTag: string;
  cardDesc: string;
}

export const projects: Project[] = [
  {
    genre: '// RPG · SURVIVAL',
    title: 'VERDANT ECLIPSE',
    cardTag: '// RPG · SURVIVAL',
    cardEmoji: '🌿',
    cardGradient: 'linear-gradient(135deg,#0d2a1a,#0a1a10)',
    cardDesc: 'RPG de supervivencia en mundo abierto con generación procedural de biomas y sistema de crafting avanzado.',
    desc: 'RPG de supervivencia en mundo abierto generado proceduralmente. El jugador explora biomas únicos, recolecta recursos y construye refugios mientras enfrenta un ecosistema dinámico con ciclos día/noche y eventos climáticos extremos.',
    mechanics: 'Sistema de crafting por árbol de habilidades. Clima procedural con efectos sobre gameplay. NPCs con rutinas diarias y economía autónoma. Combate en tiempo real con pausa táctica.',
    tech: ['UNITY 2023', 'C#', 'PERLIN NOISE', 'SQLITE', 'ADDRESSABLES', 'CINEMACHINE'],
    meta: [
      { l: 'DURACIÓN', v: '18 meses' },
      { l: 'PLATAFORMA', v: 'PC / STEAM' },
      { l: 'ESTADO', v: 'EN DESARROLLO' },
      { l: 'ROL', v: 'LEAD DEV' },
    ],
    screenshots: ['🌿', '🏔️', '🌙', '⚔️'],
    files: [
      {
        ext: 'CS', name: 'GameManager.cs', size: '12 KB',
        code: `using UnityEngine;\nusing System.Collections;\n\n// GameManager — Controlador principal del juego\npublic class GameManager : MonoBehaviour\n{\n    public static GameManager Instance { get; private set; }\n\n    [Header("Configuración mundial")]\n    public int seed = 42;\n    public float dayDuration = 600f;\n\n    private float currentTime = 0f;\n    private bool isPaused = false;\n\n    void Awake()\n    {\n        if (Instance != null) { Destroy(gameObject); return; }\n        Instance = this;\n        DontDestroyOnLoad(gameObject);\n        InitializeWorld();\n    }\n\n    void InitializeWorld()\n    {\n        Random.InitState(seed);\n        WorldGenerator.Instance.Generate(seed);\n        Debug.Log($"Mundo inicializado con seed: {seed}");\n    }\n\n    void Update()\n    {\n        if (isPaused) return;\n        currentTime += Time.deltaTime;\n        if (currentTime >= dayDuration)\n        {\n            currentTime = 0f;\n            OnNewDay();\n        }\n    }\n\n    void OnNewDay()\n    {\n        EventManager.Dispatch("day_changed");\n        WeatherSystem.Instance.RandomizeWeather();\n    }\n\n    public void TogglePause()\n    {\n        isPaused = !isPaused;\n        Time.timeScale = isPaused ? 0f : 1f;\n    }\n}`,
      },
      {
        ext: 'CS', name: 'WorldGenerator.cs', size: '28 KB',
        code: `using UnityEngine;\n\npublic class WorldGenerator : MonoBehaviour\n{\n    public static WorldGenerator Instance;\n    public int width = 512;\n    public int height = 512;\n    public float scale = 50f;\n\n    private float[,] heightMap;\n\n    void Awake() => Instance = this;\n\n    public void Generate(int seed)\n    {\n        heightMap = GenerateHeightMap(seed);\n        ApplyTerrainMesh();\n        PlaceVegetation();\n        Debug.Log($"Terreno generado: {width}x{height}");\n    }\n\n    float[,] GenerateHeightMap(int seed)\n    {\n        float[,] map = new float[width, height];\n        System.Random rng = new System.Random(seed);\n        float ox = (float)rng.NextDouble() * 9999f;\n        float oy = (float)rng.NextDouble() * 9999f;\n        for (int x = 0; x < width; x++)\n            for (int y = 0; y < height; y++)\n                map[x, y] = Mathf.PerlinNoise((float)x / width * scale + ox, (float)y / height * scale + oy);\n        return map;\n    }\n\n    void ApplyTerrainMesh() { }\n    void PlaceVegetation()  {}\n}`,
      },
      {
        ext: 'JSON', name: 'world_config.json', size: '4 KB',
        code: `{\n  "world": {\n    "name": "Verdant Eclipse",\n    "seed": 42,\n    "size": { "width": 512, "height": 512 },\n    "dayDuration": 600\n  },\n  "biomes": [\n    { "id": "ocean",    "minHeight": 0.0,  "maxHeight": 0.3 },\n    { "id": "plains",   "minHeight": 0.3,  "maxHeight": 0.5 },\n    { "id": "forest",   "minHeight": 0.5,  "maxHeight": 0.75 },\n    { "id": "mountain", "minHeight": 0.75, "maxHeight": 1.0 }\n  ],\n  "player": {\n    "startPosition": [256, 0, 256],\n    "maxHealth": 100,\n    "inventoryMaxWeight": 50\n  }\n}`,
      },
      {
        ext: 'SHADER', name: 'TerrainBlend.shader', size: '6 KB',
        code: `Shader "Custom/TerrainBlend"\n{\n    Properties\n    {\n        _OceanTex    ("Ocean",    2D) = "blue"  {}\n        _PlainsTex   ("Plains",   2D) = "green" {}\n        _ForestTex   ("Forest",   2D) = "green" {}\n        _MountainTex ("Mountain", 2D) = "grey"  {}\n    }\n    SubShader\n    {\n        Tags { "RenderType"="Opaque" }\n        CGPROGRAM\n        #pragma surface surf Lambert\n\n        sampler2D _OceanTex, _PlainsTex, _ForestTex, _MountainTex;\n\n        struct Input { float2 uv_OceanTex; float4 color : COLOR; };\n\n        void surf(Input IN, inout SurfaceOutput o)\n        {\n            float4 col = tex2D(_OceanTex,    IN.uv_OceanTex) * IN.color.r\n                       + tex2D(_PlainsTex,   IN.uv_OceanTex) * IN.color.g\n                       + tex2D(_ForestTex,   IN.uv_OceanTex) * IN.color.b\n                       + tex2D(_MountainTex, IN.uv_OceanTex) * IN.color.a;\n            o.Albedo = col.rgb;\n        }\n        ENDCG\n    }\n}`,
      },
    ],
  },
  /*{
    genre: '// SHOOTER · ROGUELITE',
    title: 'NEON DESCENT',
    cardTag: '// SHOOTER · ROGUELITE',
    cardEmoji: '⚡',
    cardGradient: 'linear-gradient(135deg,#1a0a20,#10082a)',
    cardDesc: 'Shooter roguelite en entornos cyberpunk con sistema de modificadores de armas en tiempo real y IA reactiva.',
    desc: 'Shooter roguelite en perspectiva isométrica ambientado en un futuro cyberpunk distópico. Cada run genera una configuración única de niveles, enemigos y modificadores de armas que transforman por completo el estilo de juego.',
    mechanics: 'Sistema de modificadores apilables para armas con más de 200 combinaciones. IA enemiga con behavior trees reactivos. Meta-progresión entre runs con árbol de mejoras permanentes.',
    tech: ['UNREAL ENGINE 5', 'C++', 'BLUEPRINTS', 'BEHAVIOR TREES', 'METASOUND', 'LUMEN'],
    meta: [
      { l: 'DURACIÓN', v: '10 meses' },
      { l: 'PLATAFORMA', v: 'PC / CONSOLE' },
      { l: 'ESTADO', v: 'ALPHA' },
      { l: 'ROL', v: 'SOLO DEV' },
    ],
    screenshots: ['⚡', '🌆', '🔫', '💠'],
    files: [
      {
        ext: 'CPP', name: 'WeaponSystem.cpp', size: '34 KB',
        code: `#include "WeaponSystem.h"\n\nUWeaponSystem::UWeaponSystem()\n{\n    PrimaryComponentTick.bCanEverTick = true;\n    BaseDamage  = 25.f;\n    FireRate    = 0.15f;\n    MaxAmmo     = 30;\n    CurrentAmmo = MaxAmmo;\n}\n\nvoid UWeaponSystem::ApplyModifier(FWeaponModifier Modifier)\n{\n    ActiveModifiers.Add(Modifier);\n    RecalculateStats();\n}\n\nvoid UWeaponSystem::RecalculateStats()\n{\n    float dmgMult  = 1.f;\n    float fireMult = 1.f;\n    for (const FWeaponModifier& mod : ActiveModifiers)\n    {\n        dmgMult  *= mod.DamageMultiplier;\n        fireMult *= mod.FireRateMultiplier;\n    }\n    FinalDamage   = BaseDamage * dmgMult;\n    FinalFireRate = FireRate   * fireMult;\n}\n\nvoid UWeaponSystem::Fire()\n{\n    if (CurrentAmmo <= 0) { Reload(); return; }\n    CurrentAmmo--;\n    SpawnProjectile();\n    PlayFireFX();\n}\n\nvoid UWeaponSystem::Reload()\n{\n    CurrentAmmo = MaxAmmo;\n    PlayReloadAnim();\n}`,
      },
      {
        ext: 'CPP', name: 'EnemyAI.cpp', size: '22 KB',
        code: `#include "EnemyAI.h"\n\nAEnemyAI::AEnemyAI()\n{\n    SightRadius   = 1200.f;\n    AttackRange   = 200.f;\n    Health        = 100.f;\n    bIsAggressive = false;\n}\n\nvoid AEnemyAI::BeginPlay()\n{\n    Super::BeginPlay();\n    if (BehaviorTreeAsset) RunBehaviorTree(BehaviorTreeAsset);\n}\n\nEEnemyState AEnemyAI::EvaluateState()\n{\n    APawn* Player = GetWorld()->GetFirstPlayerController()->GetPawn();\n    if (!Player) return EEnemyState::Patrol;\n    float dist = FVector::Dist(GetActorLocation(), Player->GetActorLocation());\n    if (dist <= AttackRange)  return EEnemyState::Attack;\n    if (dist <= SightRadius)  return EEnemyState::Chase;\n    return EEnemyState::Patrol;\n}\n\nvoid AEnemyAI::TakeDamage(float Amount, FDamageEvent const& Event, AController* Instigator, AActor* Cause)\n{\n    Health -= Amount;\n    bAlerted = true;\n    if (Health <= 0.f) Die();\n}`,
      },
      {
        ext: 'JSON', name: 'loot_tables.json', size: '18 KB',
        code: `{\n  "loot_tables": {\n    "common_enemy": {\n      "rolls": [1, 2],\n      "entries": [\n        { "item": "ammo_pistol",  "weight": 40, "quantity": [5, 15] },\n        { "item": "health_small", "weight": 30, "quantity": [1, 2]  },\n        { "item": "credits",      "weight": 25, "quantity": [10, 50] },\n        { "item": "mod_damage",   "weight": 5,  "quantity": [1, 1]  }\n      ]\n    },\n    "boss": {\n      "rolls": [4, 5],\n      "guaranteed": ["key_fragment", "weapon_legendary"],\n      "entries": [\n        { "item": "mod_explosive", "weight": 50, "quantity": [1, 1] },\n        { "item": "credits",       "weight": 50, "quantity": [200, 500] }\n      ]\n    }\n  }\n}`,
      },
    ],
  },
  {
    genre: '// PUZZLE · PLATFORMER',
    title: 'TIDECALLER',
    cardTag: '// PUZZLE · PLATFORMER',
    cardEmoji: '🌊',
    cardGradient: 'linear-gradient(135deg,#1a1000,#2a1800)',
    cardDesc: 'Plataformero de puzzles basado en física de fluidos. El jugador controla el agua para navegar niveles imposibles.',
    desc: 'Plataformero de puzzles con simulación de fluidos en tiempo real. El jugador encarna a una entidad capaz de controlar el agua para resolver acertijos físicos, atravesar niveles y activar mecanismos ocultos en ruinas submarinas.',
    mechanics: 'Simulación SPH de partículas de fluidos a 60fps. Física de flotabilidad dinámica. Puzzles basados en vasos comunicantes, presión hidrostática y vórtices. Narrativa contada sin texto.',
    tech: ['GODOT 4', 'GDSCRIPT', 'SPH FLUID SIM', 'COMPUTE SHADERS', 'AUDACITY'],
    meta: [
      { l: 'DURACIÓN', v: '6 meses' },
      { l: 'PLATAFORMA', v: 'PC / WEB' },
      { l: 'ESTADO', v: 'LANZADO' },
      { l: 'ROL', v: 'PROGRAMMER' },
    ],
    screenshots: ['🌊', '💧', '🏛️', '🔵'],
    files: [
      {
        ext: 'GD', name: 'FluidSimulation.gd', size: '19 KB',
        code: `extends Node2D\n# FluidSimulation.gd — SPH Particle Simulation\n\nconst PARTICLE_COUNT = 500\nconst SMOOTHING_RADIUS = 32.0\nconst GRAVITY = Vector2(0, 980)\n\nvar positions  : PackedVector2Array\nvar velocities : PackedVector2Array\nvar densities  : PackedFloat32Array\n\nfunc _ready():\n    positions  = PackedVector2Array()\n    velocities = PackedVector2Array()\n    densities  = PackedFloat32Array()\n    spawn_particles()\n\nfunc spawn_particles():\n    for i in PARTICLE_COUNT:\n        positions.append(Vector2(randf_range(50, 400), randf_range(50, 300)))\n        velocities.append(Vector2.ZERO)\n        densities.append(0.0)\n\nfunc _physics_process(delta):\n    calculate_densities()\n    apply_gravity(delta)\n    integrate_positions(delta)\n    queue_redraw()\n\nfunc calculate_densities():\n    for i in PARTICLE_COUNT:\n        var density = 0.0\n        for j in PARTICLE_COUNT:\n            var dist = positions[i].distance_to(positions[j])\n            if dist < SMOOTHING_RADIUS:\n                density += smoothing_kernel(dist)\n        densities[i] = density\n\nfunc smoothing_kernel(dist: float) -> float:\n    var q = 1.0 - (dist / SMOOTHING_RADIUS)\n    return max(0.0, q * q * q)\n\nfunc apply_gravity(delta):\n    for i in PARTICLE_COUNT:\n        velocities[i] += GRAVITY * delta\n\nfunc integrate_positions(delta):\n    var bounds = get_viewport_rect().size\n    for i in PARTICLE_COUNT:\n        positions[i] += velocities[i] * delta\n        if positions[i].x < 0 or positions[i].x > bounds.x:\n            velocities[i].x *= -0.5\n            positions[i].x = clamp(positions[i].x, 0, bounds.x)\n        if positions[i].y > bounds.y:\n            velocities[i].y *= -0.5\n            positions[i].y = bounds.y`,
      },
      {
        ext: 'GD', name: 'PlayerController.gd', size: '11 KB',
        code: `extends CharacterBody2D\n# PlayerController.gd\n\nconst SPEED = 200.0\nconst JUMP_FORCE = -500.0\nconst WATER_ATTRACT_RADIUS = 150.0\nconst WATER_ATTRACT_FORCE  = 800.0\n\n@onready var fluid_sim = $"../FluidSimulation"\n@onready var anim      = $AnimationPlayer\n\nfunc _physics_process(delta):\n    if not is_on_floor():\n        velocity.y += 980 * delta\n\n    var dir = Input.get_axis("move_left", "move_right")\n    velocity.x = dir * SPEED\n\n    if Input.is_action_just_pressed("jump") and is_on_floor():\n        velocity.y = JUMP_FORCE\n\n    if Input.is_action_pressed("attract_water"):\n        attract_water()\n\n    move_and_slide()\n\nfunc attract_water():\n    for i in fluid_sim.positions.size():\n        var dist = global_position.distance_to(fluid_sim.positions[i])\n        if dist < WATER_ATTRACT_RADIUS:\n            var dir = (global_position - fluid_sim.positions[i]).normalized()\n            fluid_sim.velocities[i] += dir * WATER_ATTRACT_FORCE * get_physics_process_delta_time()`,
      },
    ],
  },
  {
    genre: '// HORROR · NARRATIVE',
    title: 'HOLLOW STATIC',
    cardTag: '// HORROR · NARRATIVE',
    cardEmoji: '💀',
    cardGradient: 'linear-gradient(135deg,#150005,#2a0010)',
    cardDesc: 'Juego de terror narrativo en primera persona con sistema de memoria dinámica y múltiples finales ramificados.',
    desc: 'Juego de terror psicológico en primera persona con narrativa ramificada. El jugador investiga una señal de radio misteriosa y descubre capas de una historia que cambia según las decisiones tomadas y los objetos examinados.',
    mechanics: 'Sistema de memoria dinámica que afecta diálogos y entornos. Diseño sonoro procedural que genera tensión sin jumpscares. Siete finales completamente distintos con más de 40 ramas narrativas.',
    tech: ['UNITY 2022', 'INK SCRIPT', 'WWISE', 'C#', 'UNITY HDRP', 'CINEMACHINE'],
    meta: [
      { l: 'DURACIÓN', v: '8 meses' },
      { l: 'PLATAFORMA', v: 'PC' },
      { l: 'ESTADO', v: 'LANZADO' },
      { l: 'ROL', v: 'LEAD DEV' },
    ],
    screenshots: ['💀', '📻', '🚪', '👁️'],
    files: [
      {
        ext: 'INK', name: 'chapter_01.ink', size: '45 KB',
        code: `// Chapter 01 — Hollow Static\nVAR found_radio = false\nVAR anxiety_level = 0\n\n=== intro ===\nLa habitación huele a estático.\nEn la mesita de noche, una radio vieja parpadea sola.\n\n* [Acercarse a la radio]\n    -> approach_radio\n* [Ignorarla y mirar por la ventana]\n    ~ anxiety_level += 1\n    -> window_scene\n\n=== approach_radio ===\n~ found_radio = true\nLa perilla gira sola. Una frecuencia. Palabras que no deberían existir.\n"...todavía estás ahí... te encontramos..."\n\n* [Apagar la radio]\n    -> radio_off\n* [Escuchar más]\n    ~ anxiety_level += 2\n    -> radio_on\n\n=== radio_on ===\nLa voz se vuelve más clara. Más cercana.\n"Sabemos lo que hiciste en el sótano."\n{ anxiety_level > 3:\n    -> panic_sequence\n- else:\n    -> calm_investigation\n}\n\n=== radio_off ===\nEl silencio es peor. Algo cruje en el pasillo.\n-> hallway`,
      },
      {
        ext: 'CS', name: 'MemorySystem.cs', size: '16 KB',
        code: `using System.Collections.Generic;\nusing UnityEngine;\nusing Ink.Runtime;\n\npublic class MemorySystem : MonoBehaviour\n{\n    public static MemorySystem Instance;\n    private Dictionary<string, object> memories = new Dictionary<string, object>();\n    private Story inkStory;\n\n    void Awake() { Instance = this; LoadFromSave(); }\n\n    public void Remember(string key, object value)\n    {\n        memories[key] = value;\n        SyncToInk(key, value);\n    }\n\n    public T Recall<T>(string key, T defaultVal = default)\n    {\n        if (memories.TryGetValue(key, out object val)) return (T)val;\n        return defaultVal;\n    }\n\n    private void SyncToInk(string key, object value)\n    {\n        if (inkStory == null) return;\n        if (value is bool b)   inkStory.variablesState[key] = b;\n        if (value is int i)    inkStory.variablesState[key] = i;\n        if (value is string s) inkStory.variablesState[key] = s;\n    }\n\n    public void SetStory(Story story)\n    {\n        inkStory = story;\n        foreach (var kv in memories) SyncToInk(kv.Key, kv.Value);\n    }\n\n    private void LoadFromSave()\n    {\n        string json = PlayerPrefs.GetString("memory_save", "");\n        if (!string.IsNullOrEmpty(json))\n        {\n            var data = JsonUtility.FromJson<MemorySaveData>(json);\n            foreach (var e in data.entries) memories[e.key] = e.value;\n        }\n    }\n}`,
      },
    ],
  },
  {
    genre: '// ARCADE · SCI-FI',
    title: 'PULSAR DRIFT',
    cardTag: '// ARCADE · SCI-FI',
    cardEmoji: '🚀',
    cardGradient: 'linear-gradient(135deg,#00101a,#001a2a)',
    cardDesc: 'Arcade espacial con mecánicas de drifting gravitacional. Game Jam winner — desarrollado en 72 horas.',
    desc: 'Juego arcade espacial donde la gravedad de las estrellas de neutrones es el eje del gameplay. El jugador aprovecha campos gravitacionales para hacer drifting cósmico y destruir flotas enemigas con impulso acumulado.',
    mechanics: 'Física gravitacional newtoniana simplificada para gameplay. Multiplicador de combo por precisión de trayectoria. Modo contrareloj con tablas de clasificación en línea. Ganador de la Ludum Dare 54.',
    tech: ['UNITY', 'C#', 'SHADER GRAPH', 'UNITY BURST', 'PLAYFAB'],
    meta: [
      { l: 'DURACIÓN', v: '72 horas' },
      { l: 'PLATAFORMA', v: 'WEB / PC' },
      { l: 'ESTADO', v: 'LANZADO' },
      { l: 'ROL', v: 'SOLO DEV' },
    ],
    screenshots: ['🚀', '⭐', '💥', '🌀'],
    files: [
      {
        ext: 'CS', name: 'GravityField.cs', size: '8 KB',
        code: `using UnityEngine;\n\npublic class GravityField : MonoBehaviour\n{\n    public float mass   = 5000f;\n    public float radius = 15f;\n    public float G      = 6.674f;\n\n    void OnTriggerStay(Collider other)\n    {\n        Rigidbody rb = other.GetComponent<Rigidbody>();\n        if (rb == null) return;\n\n        Vector3 dir  = (transform.position - other.transform.position);\n        float   dist = dir.magnitude;\n        if (dist < 0.5f) return;\n\n        float force = G * mass * rb.mass / (dist * dist);\n        rb.AddForce(dir.normalized * force);\n    }\n\n    void OnDrawGizmos()\n    {\n        Gizmos.color = new Color(0, 1, 0.9f, 0.15f);\n        Gizmos.DrawSphere(transform.position, radius);\n    }\n}`,
      },
      {
        ext: 'CS', name: 'ShipPhysics.cs', size: '14 KB',
        code: `using UnityEngine;\n\n[RequireComponent(typeof(Rigidbody))]\npublic class ShipPhysics : MonoBehaviour\n{\n    public float thrustForce = 20f;\n    public float rotateSpeed = 180f;\n    public float boostMult   = 2.5f;\n\n    private Rigidbody rb;\n    private float comboMultiplier = 1f;\n\n    void Start() => rb = GetComponent<Rigidbody>();\n\n    void FixedUpdate()\n    {\n        if (Input.GetKey(KeyCode.W))\n            rb.AddForce(transform.up * thrustForce);\n\n        float h = Input.GetAxis("Horizontal");\n        transform.Rotate(0, 0, -h * rotateSpeed * Time.fixedDeltaTime);\n\n        CalculateDrift();\n    }\n\n    void CalculateDrift()\n    {\n        if (rb.linearVelocity.magnitude < 1f) return;\n        float angle = Vector3.Angle(transform.up, rb.linearVelocity.normalized);\n        comboMultiplier = angle > 15f ? 1f + (angle / 180f) * 3f : 1f;\n    }\n\n    public float GetCombo() => comboMultiplier;\n}`,
      },
    ],
  },
  {
    genre: '// STRATEGY · TACTICS',
    title: 'MONOCHROME WAR',
    cardTag: '// STRATEGY · TACTICS',
    cardEmoji: '🔲',
    cardGradient: 'linear-gradient(135deg,#0a0a0a,#1a1a1a)',
    cardDesc: 'Juego de estrategia por turnos en blanco y negro con mecánicas de color como recurso narrativo y táctico.',
    desc: 'Juego de estrategia por turnos donde el color es un recurso escaso. El mundo comienza en blanco y negro; conquistar territorios añade color que desbloquea habilidades, unidades y cambia la narrativa de la campaña.',
    mechanics: 'Grilla hexagonal con algoritmos A* de pathfinding. El color como recurso estratégico con 12 variantes de efecto. Modo campaña de 20 misiones + escenarios de partida rápida. IA por minimax con poda alfa-beta.',
    tech: ['GODOT 4', 'GDSCRIPT', 'A* PATHFINDING', 'MINIMAX AI', 'SQLITE'],
    meta: [
      { l: 'DURACIÓN', v: '7 meses' },
      { l: 'PLATAFORMA', v: 'PC / MOBILE' },
      { l: 'ESTADO', v: 'BETA' },
      { l: 'ROL', v: 'SOLO DEV' },
    ],
    screenshots: ['🔲', '♟️', '🗺️', '⚔️'],
    files: [
      {
        ext: 'GD', name: 'HexGrid.gd', size: '21 KB',
        code: `extends Node2D\n# HexGrid.gd — Grilla hexagonal con A*\n\nconst HEX_SIZE = 40\nconst DIRECTIONS = [Vector2i(1,0),Vector2i(-1,0),Vector2i(0,1),Vector2i(0,-1),Vector2i(1,-1),Vector2i(-1,1)]\n\nvar grid := {}\n\nfunc _ready():\n    generate_grid(10, 10)\n\nfunc generate_grid(cols: int, rows: int):\n    for q in range(-cols, cols + 1):\n        for r in range(-rows, rows + 1):\n            var s = -q - r\n            if abs(s) <= rows:\n                grid[Vector2i(q, r)] = { "q":q, "r":r, "color":Color.WHITE, "owner":-1, "unit":null }\n\nfunc hex_to_pixel(q: int, r: int) -> Vector2:\n    return Vector2(HEX_SIZE * 1.5 * q, HEX_SIZE * (sqrt(3.0)/2.0 * q + sqrt(3.0) * r))\n\nfunc get_neighbors(coord: Vector2i) -> Array:\n    var n = []\n    for dir in DIRECTIONS:\n        if grid.has(coord + dir): n.append(coord + dir)\n    return n\n\nfunc find_path(from_hex: Vector2i, to_hex: Vector2i) -> Array:\n    var open_set = [from_hex]\n    var came_from = {}\n    var g_score = { from_hex: 0 }\n    var f_score = { from_hex: heuristic(from_hex, to_hex) }\n    while not open_set.is_empty():\n        var current = open_set.reduce(func(a,b): return a if f_score.get(a,999) < f_score.get(b,999) else b)\n        if current == to_hex: return reconstruct_path(came_from, current)\n        open_set.erase(current)\n        for neighbor in get_neighbors(current):\n            var tg = g_score[current] + 1\n            if not g_score.has(neighbor) or tg < g_score[neighbor]:\n                came_from[neighbor] = current\n                g_score[neighbor] = tg\n                f_score[neighbor] = tg + heuristic(neighbor, to_hex)\n                if neighbor not in open_set: open_set.append(neighbor)\n    return []\n\nfunc heuristic(a: Vector2i, b: Vector2i) -> int:\n    return (abs(a.x-b.x) + abs(a.y-b.y) + abs((-a.x-a.y)-(-b.x-b.y))) / 2\n\nfunc reconstruct_path(came_from: Dictionary, current: Vector2i) -> Array:\n    var path = [current]\n    while came_from.has(current): current = came_from[current]; path.push_front(current)\n    return path`,
      },
      {
        ext: 'GD', name: 'AIEngine.gd', size: '30 KB',
        code: `extends Node\n# AIEngine.gd — Minimax con poda Alfa-Beta\n\nconst MAX_DEPTH = 4\nconst INF = 999999\n\nfunc get_best_move(state: Dictionary, is_maximizing: bool) -> Dictionary:\n    var best_move = {}\n    var best_val = -INF if is_maximizing else INF\n    var alpha = -INF\n    var beta  = INF\n    for move in get_all_moves(state, is_maximizing):\n        var new_state = apply_move(state, move)\n        var val = minimax(new_state, MAX_DEPTH - 1, alpha, beta, not is_maximizing)\n        if is_maximizing and val > best_val:\n            best_val = val; best_move = move\n        elif not is_maximizing and val < best_val:\n            best_val = val; best_move = move\n    return best_move\n\nfunc minimax(state: Dictionary, depth: int, alpha: float, beta: float, is_max: bool) -> float:\n    if depth == 0 or is_terminal(state):\n        return evaluate(state)\n    if is_max:\n        var val = -INF\n        for move in get_all_moves(state, true):\n            val = max(val, minimax(apply_move(state, move), depth-1, alpha, beta, false))\n            alpha = max(alpha, val)\n            if beta <= alpha: break\n        return val\n    else:\n        var val = INF\n        for move in get_all_moves(state, false):\n            val = min(val, minimax(apply_move(state, move), depth-1, alpha, beta, true))\n            beta = min(beta, val)\n            if beta <= alpha: break\n        return val\n\nfunc evaluate(state: Dictionary) -> float:\n    return state.ai_territory * 10.0 - state.player_territory * 10.0 + state.ai_colors * 15.0`,
      },
    ],
  },*/
];
