extends Sprite3D

@onready var notaIntro = $NotaSuelo
@onready var BotonE = $Area3D/UI_E
signal NotaLeida


func _ready():
	BotonE.set_deferred("visible", false)
	notaIntro.set_deferred("visible", false)
	get_tree().paused = false

func _process(_delta) -> void:
	if Input.is_action_just_pressed("Interaccion") and (BotonE.visible == true):
		print_debug("Nota abierta")
		emit_signal("NotaLeida")
		notaIntro.visible = true
		Input.set_mouse_mode(Input.MOUSE_MODE_VISIBLE)
		get_tree().paused = true
	if Input.is_action_just_pressed("ui_cancel") and (notaIntro.visible == true):
		print_debug("Nota cerrada")
		notaIntro.visible = false
		Input.set_mouse_mode(Input.MOUSE_MODE_CAPTURED)
		get_tree().paused = false
		# Accedemos directamente al script global y activamos la misión
		MisionesGlobal.activar_mision("jefe_pocion")
		MisionesGlobal.activar_mision("jefe_libro")
		MisionesGlobal.activar_mision("ratas")
		MisionesGlobal.activar_mision("jefeRatas")


func _on_body_entered(body: Node3D) -> void:
	if body.is_in_group("player"):
		print_debug("Dentro del radio")
		BotonE.set_deferred("visible", true)


func _on_body_exited(body: Node3D) -> void:
	if body.is_in_group("player"):
		print_debug("Fuera del radio")
		BotonE.set_deferred("visible", false)
