extends CharacterBody3D

signal vida_cambiada(nueva_vida: int)
signal vida_maxima(vida_maxima: int)

@export var mision := ""
@export var speed := 0.5
@export var daño := 10
@export var gravedad := 20
@export var vida: int
@export var nombre = name
@export var id: String = ""
@onready var anim = $AnimationPlayer
@onready var enemy = $"."
@onready var hitbox: Area3D = $hitbox
@onready var hitbox_shape: CollisionShape3D = $hitbox/Collision

var player: CharacterBody3D = null
var atacando = false
var vida_maxima_enemigo: int

func recibir_daño(cantidad: int) -> void:
	vida -= cantidad
	vida_cambiada.emit(vida)
	print("Vida enemigo: ", vida)
	if vida <= 0:
		EnemigoGlobal.muertos.append(nombre)
		queue_free()
		MisionesGlobal.completar_Mision(mision, 1)

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	vida_maxima_enemigo = EnemigoGlobal.obtener_vida_maxima(id)
	vida = vida_maxima_enemigo
	vida_maxima.emit(vida_maxima_enemigo)
	player = null #Player empieza siendo nulo
	if EnemigoGlobal.muertos.has(nombre):
		queue_free()

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:

	anim.play("walkcycle")

	if not is_on_floor():
		velocity.y -= gravedad * delta

	if player:
		var direction = global_position.direction_to(player.global_position) #Declara la variable direccion con el valor de la posicion del jugador

		velocity.x = direction.x * speed
		velocity.z = direction.z * speed

		if direction != Vector3.ZERO:
			var target_position = Vector3(player.global_position.x, global_position.y, player.global_position.z) 
			look_at(target_position, Vector3.UP) #Fija la posicion a donde tiene que ir

	move_and_slide() #Mover al enemigo respetando colisiones

	if player and not atacando:
		realizar_ataque()

func realizar_ataque() -> void:
	atacando = true
	hitbox_shape.set_deferred("disabled", false)
	print_debug("ATAQUE AL JUGADORRRR")

	# Esperar un frame de física para que el área detecte los cuerpos
	await get_tree().physics_frame
	await get_tree().physics_frame

	for body in hitbox.get_overlapping_bodies():
		if body.is_in_group("player"):
			if body.has_method("recibir_daño"):
				body.recibir_daño(daño)

	await get_tree().create_timer(2.0).timeout
	hitbox_shape.set_deferred("disabled", true)
	atacando = false

func _on_area_3d_body_entered(body: Node3D) -> void: #Sistema para que detecte si el jugador entro en el area de deteccion
	if body.is_in_group("player"):
			player = body

func _on_area_3d_body_exited(body: Node3D) -> void: #Sistema para que detecte si el jugador salio del area de deteccion
	if body == player:
		player = null
		velocity = Vector3.ZERO
