extends Node

var vida := 100

func _process(_delta: float) -> void:
	if vida > 100:
		vida = 100
