extends Node

var muertos : Array = []

var vida : Array = [
	{"id": "ratas", "vida_maxima": 100},
	{"id": "jefe_rata", "vida_maxima": 200}
]

func obtener_vida_maxima(id_enemigo) -> int:
	for e in vida:
		if str(e["id"]) == str(id_enemigo):
			return e["vida_maxima"]
	push_warning("No hay vida máxima definida para: " + str(id_enemigo))
	return 100
