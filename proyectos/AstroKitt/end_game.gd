extends Control

# 1. Corregimos la ruta eliminando el "../" sobrante
@onready var lista_misiones: RichTextLabel = %RichTextLabel
@onready var menuPrincipal = $MenuPrincipal
@export_file("*.tscn") var target_scene: String

func _ready() -> void:
	menuPrincipal.set_deferred("visible", true)

func _on_texture_button_3_pressed() -> void:
	MisionesGlobal.desactivar_mision("jefe_pocion")
	MisionesGlobal.desactivar_mision("jefe_libro")
	MisionesGlobal.desactivar_mision("ratas")
	MisionesGlobal.desactivar_mision("jefeRatas")
	get_tree().paused = false
	get_tree().change_scene_to_file.call_deferred(target_scene)
