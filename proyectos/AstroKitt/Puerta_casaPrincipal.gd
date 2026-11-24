extends Area3D

@export_file("*.tscn") var target_scene: String
@export var target_spawn_name: String = ""


var Viajando: bool = false
@onready var player
@onready var UI_E = $UI_E

func _ready() -> void:
	UI_E.set_deferred("visible", false)
	set_deferred("monitoring", false)
	await get_tree().create_timer(0.5).timeout
	set_deferred("monitoring", true)
	player = null

func _process(_delta) -> void:
	if Input.is_action_just_pressed("Interaccion") and player:
			if target_scene != "" and target_scene != "res://":
				Viajando = true
				set_deferred("monitoring", false)

				PosicionGlobal.should_reposition = true
				PosicionGlobal.target_spawn_name = target_spawn_name

				get_tree().change_scene_to_file.call_deferred(target_scene)

func _on_body_entered(body: Node3D) -> void:
	if body.is_in_group("player"):
		player = body
		UI_E.set_deferred("visible", true)


func _on_body_exited(body: Node3D) -> void:
	player = null
	UI_E.set_deferred("visible", false)
