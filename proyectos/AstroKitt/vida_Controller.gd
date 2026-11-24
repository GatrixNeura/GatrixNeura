extends SubViewport

@export var vidaMaxima := 100
@export var es_jugador := false
@export var vida_inicial := 100

@onready var vida: ProgressBar = $ProgressBar

func _ready() -> void:
	if es_jugador:
		vida.max_value = vidaMaxima
		vida.value = PlayerInfoGlobal.vida

func _on_player_vida_cambiada(nueva_vida: int) -> void:
	vida.value = nueva_vida


func _on_enemy_vida_cambiada(nueva_vida: int) -> void:
	vida.value = nueva_vida


func _on_enemy_vida_maxima(vida_maxima: int) -> void:
	vida.max_value = vida_maxima
	vida.value = vida_maxima
