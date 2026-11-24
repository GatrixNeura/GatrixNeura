extends StaticBody3D

@onready var player = null
@export var healing := 30

@onready var botonInteractuar = $UI_E

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	player = null
	#botonInteractuar.set_deferred("visible", false)


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	if Input.is_action_just_pressed("Interaccion") and player:
		if player.has_method("curacion"):
			print_debug("CURACIONNNN")
			player.curacion(healing)
			queue_free()


func _on_area_3d_body_entered(body: Node3D) -> void:
	if body.is_in_group("player"):
		player = body


func _on_area_3d_body_exited(body: Node3D) -> void:
	player = null
