extends Control

# 1. Corregimos la ruta eliminando el "../" sobrante
@onready var lista_misiones: RichTextLabel = %RichTextLabel
@onready var menuPrincipal = $MenuPrincipal
@onready var menuOpciones = $MenuOpciones
@export_file("*.tscn") var target_scene: String

func _ready() -> void:
	menuPrincipal.set_deferred("visible", false)
	menuOpciones.set_deferred("visible", false)
	MisionesGlobal.misiones_actualizadas.connect(actualizar_interfaz)
	actualizar_interfaz()

func actualizar_interfaz() -> void:
	lista_misiones.text = ""
	
	for mision in MisionesGlobal.lista_misiones:
		# SI LA MISIÓN NO ESTÁ ACTIVA, PASAMOS A LA SIGUIENTE (No se muestra nada)
		if not mision["activa"]:
			continue
			
		# Si está activa, la dibujamos según su estado de completada
		if mision["completada"]:
			lista_misiones.append_text("[s][color=gray]• " + mision["texto"] + str(mision["estado"]) + " / " + str(mision["objetivo"]) + "[/color][/s] [color=green](OK)[/color]\n")
		else:
			lista_misiones.append_text("[color=white]• " + mision["texto"] + str(mision["estado"]) + " / " + str(mision["objetivo"]) + "[/color]\n")

func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed("ui_cancel"):
		if Input.get_mouse_mode() == Input.MOUSE_MODE_CAPTURED:
			Input.set_mouse_mode(Input.MOUSE_MODE_VISIBLE)
			get_tree().paused = true
			menuPrincipal.set_deferred("visible", true)
		else:
			Input.set_mouse_mode(Input.MOUSE_MODE_CAPTURED)
			menuPrincipal.set_deferred("visible", false)
			menuOpciones.set_deferred("visible", false)
			get_tree().paused = false

	if event is InputEventMouseMotion:
		if Input.get_mouse_mode() != Input.MOUSE_MODE_CAPTURED:
			return

func _on_texture_button_pressed() -> void:
	Input.set_mouse_mode(Input.MOUSE_MODE_CAPTURED)
	menuPrincipal.set_deferred("visible", false)
	get_tree().paused = false

func _on_texture_button_2_pressed() -> void:
	menuPrincipal.set_deferred("visible", false)
	menuOpciones.set_deferred("visible", true)

func _on_texture_button_3_pressed() -> void:
	MisionesGlobal.desactivar_mision("jefe_pocion")
	MisionesGlobal.desactivar_mision("jefe_libro")
	MisionesGlobal.desactivar_mision("ratas")
	MisionesGlobal.desactivar_mision("jefeRatas")
	get_tree().paused = false
	get_tree().change_scene_to_file.call_deferred(target_scene)
