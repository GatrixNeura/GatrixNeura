extends Control

@export_file("*.tscn") var target_scene: String
@onready var menuPrincipal = $MenuPrincipal
@onready var menuOpciones = $MenuOpciones

func _ready() -> void:
	menuOpciones.set_deferred("visible", false)
	load("res://Escene/menuPrincipal.tscn")

func _on_button_pressed() -> void:
	get_tree().change_scene_to_file.call_deferred(target_scene)


func _on_button_2_pressed() -> void:
	menuPrincipal.visible = false
	menuOpciones.visible = true


func _on_button_3_pressed() -> void:
	get_tree().quit()


func _on_texture_button_pressed() -> void:
	menuPrincipal.visible = true
	menuOpciones.visible = false
