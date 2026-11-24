extends Node

var lista_misiones = [
	{"id": "ratas", "texto": "Derrota a las ratas del puesto de comida: ", "activa": false, "estado": 0, "objetivo": 4, "completada": false},
	{"id": "jefeRatas", "texto": "Derrota al jefe de las ratas: ", "activa": false, "estado": 0, "objetivo": 1, "completada": false},
	{"id": "jefe_pocion", "texto": "Derrota al jefe Pocion", "activa": false, "estado": 0, "objetivo": 1, "completada": false},
	{"id": "jefe_libro", "texto": "Derrota al jefe Libro", "activa": false, "estado": 0, "objetivo": 1, "completada": false}
]

signal misiones_actualizadas

# Función global para activar una misión buscando por su ID
func activar_mision(id_mision: String) -> void:
	for mision in lista_misiones:
		if mision["id"] == id_mision:
			mision["activa"] = true
			misiones_actualizadas.emit() # Avisamos a la interfaz para que se redibuje
			break

func desactivar_mision(id_mision: String) -> void:
	for mision in lista_misiones:
		if mision["id"] == id_mision:
			mision["activa"] = false
			misiones_actualizadas.emit() # Avisamos a la interfaz para que se redibuje
			break

func completar_Mision(id_mision: String, valor) -> void:
	for mision in lista_misiones:
		if mision["id"] == id_mision:
			mision["estado"] += valor 
			if mision["estado"] == mision["objetivo"]:
				mision["completada"] = true
			misiones_actualizadas.emit() # Avisamos a la interfaz para que se redibuje
			break

func obtener_objetivo_actual(objetivos: Array) -> Node3D:
	for i in range(lista_misiones.size()):
		var mision = lista_misiones[i]
		# Buscamos la primera misión que esté activa pero todavía NO completada
		if mision["activa"] and not mision["completada"]:
			if i < objetivos.size() and objetivos[i] != null:
				return objetivos[i] as Node3D
	return null # Si no hay ninguna misión activa o ya se completaron todas

func Guia_Mision(objetivos: Array) -> void:
	# Lista de correspondencia entre el ID de la misión y el índice del objeto en el array
	for i in range(lista_misiones.size()):
		var mision = lista_misiones[i]
		if i < objetivos.size():
			var obj = objetivos[i] as Node3D
			if obj:
				# Si la misión está activa Y NO está completada, aseguramos que sea el objetivo
				if mision["activa"] and not mision["completada"]:
					if not obj.is_in_group("objetivo"):
						obj.add_to_group("objetivo")
				else:
					# Si ya se completó o no está activa, lo sacamos del grupo
					if obj.is_in_group("objetivo"):
						obj.remove_from_group("objetivo")
