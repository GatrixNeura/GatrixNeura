extends CharacterBody3D

signal vida_cambiada(nueva_vida: int)

@export_file("*.tscn") var target_scene: String

@export var daño := 20
@export var dañoUlti := 50
@export var anim_speed := 1.7
@export var speed := 2.0
@export var jump_velocity := 4.5
@export var gravedad: float = 20.0

@onready var model = $gato
@onready var anim = $"gato/AnimationPlayer"
@onready var hurtBox = $hurtBox
@onready var Ataque1: Area3D = $ataque1
@onready var Ataque1_Vision: CollisionShape3D = $ataque1/CollisionShape3D
@onready var AtaqueUlti: Area3D = $ataqueUlti
@onready var AtaqueUlti_Vision: CollisionShape3D = $ataqueUlti/CollisionShape3D
@onready var camera: Camera3D = $cameraPivot/cameraController/camera3D


var caminando = false
var atacando = false
var usandoUlti = false
var vida = PlayerInfoGlobal.vida
var tiempo_transicion := 0.2

func curacion(cura: int) -> void:
	PlayerInfoGlobal.vida += cura
	vida_cambiada.emit(PlayerInfoGlobal.vida)
	vida = PlayerInfoGlobal.vida

func recibir_daño(cantidad: int) -> void:
	PlayerInfoGlobal.vida -= cantidad
	vida_cambiada.emit(PlayerInfoGlobal.vida)
	print("Vida player: ", PlayerInfoGlobal.vida)
	vida = PlayerInfoGlobal.vida

	if vida <= 0:
		get_tree().change_scene_to_file.call_deferred(target_scene)
		Input.set_mouse_mode(Input.MOUSE_MODE_VISIBLE)
		get_tree().paused = false


func _ready() -> void:
	Ataque1_Vision.set_deferred("disabled", true)
	AtaqueUlti_Vision.set_deferred("disabled", true)
	anim.speed_scale = anim_speed
#----------------------------------------------------------------#

	if PosicionGlobal.should_reposition:
		var spawn_node = get_tree().current_scene.find_child(PosicionGlobal.target_spawn_name, true, false)
		if spawn_node:
			global_transform.origin = spawn_node.global_transform.origin
		PosicionGlobal.should_reposition = false

#----------------------------------------------------------------#


func _physics_process(delta: float) -> void:
	# Entrada del jugador.
	var input_dir := Input.get_vector(
		"Izquierda",
		"Derecha",
		"Arriba",
        "Abajo"
	)

	# Velocidad al correr.
	if Input.is_action_just_pressed("Alt. Caminar") and input_dir != Vector2.ZERO and caminando == false:
		print_debug("caminando")
		caminando = true
		speed = 0.8
		await get_tree().create_timer(0.1).timeout
	if Input.is_action_just_pressed("Alt. Caminar") and caminando == true:
		print_debug("corriendo")
		caminando = false
		speed = 2.0

	# Dirección horizontal de la cámara.
	var forward := -camera.global_basis.z
	var right := camera.global_basis.x

	# Ignorar la inclinación vertical.
	forward.y = 0.0
	right.y = 0.0

	forward = forward.normalized()
	right = right.normalized()

	# Convertir las teclas en movimiento relativo a la cámara.
	var direction := right * input_dir.x - forward * input_dir.y

	if direction.length_squared() > 0.0:
		direction = direction.normalized()

	# Aplicar movimiento.
	velocity.x = direction.x * speed
	velocity.z = direction.z * speed

	# Gravedad.
	if not is_on_floor():
		velocity.y -= gravedad * delta

	# Salto.
	if Input.is_action_just_pressed("Salto") and is_on_floor() and not usandoUlti:
		velocity.y = jump_velocity

	# Animaciones y orientación.
	if (direction.length_squared() > 0.001) and not usandoUlti:
		var target_angle := atan2(direction.x, direction.z) - PI / 2.0


		model.rotation.y = lerp_angle(
			model.rotation.y,
			target_angle,
			12.0 * delta
		)

		hurtBox.rotation.y = model.rotation.y
		Ataque1.rotation.y = model.rotation.y
		AtaqueUlti.rotation.y = model.rotation.y

		if caminando and not usandoUlti:
			if not atacando:
				anim.play("Walk", tiempo_transicion)
		else:
			if not usandoUlti:
				if not atacando:
					anim.play("Run", tiempo_transicion)

	else:
		if not usandoUlti:
			if not atacando:
				anim.play("Idle", tiempo_transicion)


	# Ataque1 -- toooma
	if Input.is_action_just_pressed("Ataque1") and not atacando:
		anim.play("Attack_Claw", tiempo_transicion)
		ataque1()
		await $"gato/AnimationPlayer".animation_finished
	#Ataque2 -- Ulti
	if input_dir == Vector2.ZERO and Input.is_action_just_pressed("Ulti"):
		usandoUlti = true
		anim.play("Attack", tiempo_transicion)
		ataqueUlti()
		await $"gato/AnimationPlayer".animation_finished
		usandoUlti = false

	if usandoUlti == false:
		move_and_slide()


func ataqueUlti() -> void:
	atacando = true
	await get_tree().create_timer(1.4).timeout
	AtaqueUlti_Vision.set_deferred("disabled", false)
	print_debug("ATAQUE")

	await get_tree().physics_frame
	await get_tree().physics_frame

	for body in AtaqueUlti.get_overlapping_bodies():
		if body.is_in_group("enemy"):
			if body.has_method("recibir_daño"):
				body.recibir_daño(dañoUlti)

	await $"gato/AnimationPlayer".animation_finished

	AtaqueUlti_Vision.set_deferred("disabled", true)
	atacando = false

func ataque1() -> void:
	atacando = true
	Ataque1_Vision.set_deferred("disabled", false)
	print_debug("ATAQUE")

	await get_tree().physics_frame
	await get_tree().physics_frame

	for body in Ataque1.get_overlapping_bodies():
		if body.is_in_group("enemy"):
			if body.has_method("recibir_daño"):
				body.recibir_daño(daño)

	await $"gato/AnimationPlayer".animation_finished

	Ataque1_Vision.set_deferred("disabled", true)
	atacando = false
