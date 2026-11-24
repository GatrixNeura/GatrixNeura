extends Node3D

@onready var petalosAnim = $AnimationPlayer

func _ready() -> void:
	petalosAnim.play("Cerezo_Petalos_Unificados")
