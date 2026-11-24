extends Node3D

@export var sensitivity: float = 0.002
@export var min_pitch: float = -45.0
@export var max_pitch: float = 60.0
@export var min_distance: float = 2.0
@export var max_distance: float = 8.0
@export var zoom_step: float = 0.5

@onready var spring_arm: SpringArm3D = $cameraController

var camera_pitch: float = -15.0


func _ready() -> void:
	spring_arm.spring_length = 5.0
	rotation = Vector3.ZERO
	spring_arm.rotation = Vector3(deg_to_rad(camera_pitch), 0.0, 0.0)
	Input.set_mouse_mode(Input.MOUSE_MODE_CAPTURED)


func _input(event: InputEvent) -> void:
	if event is InputEventMouseMotion:
		if Input.get_mouse_mode() != Input.MOUSE_MODE_CAPTURED:
			return

		# Giro horizontal
		rotate_y(-event.relative.x * sensitivity)

		# Giro vertical
		camera_pitch -= event.relative.y * sensitivity
		camera_pitch = clamp(
			camera_pitch,
			deg_to_rad(min_pitch),
			deg_to_rad(max_pitch)
		)

		spring_arm.rotation.x = camera_pitch

		# Evita inclinaciones laterales.
		spring_arm.rotation.z = 0.0

		# Horizontal: eje Y del pivote.
		rotation.y -= event.screen_relative.x * sensitivity

		# Vertical: eje X del SpringArm3D.
		camera_pitch -= event.screen_relative.y * sensitivity
		camera_pitch = clampf(
			camera_pitch,
			deg_to_rad(min_pitch),
			deg_to_rad(max_pitch)
		)
		spring_arm.rotation.x = camera_pitch

	if event is InputEventMouseButton and event.pressed:
		if event.button_index == MOUSE_BUTTON_WHEEL_UP:
			spring_arm.spring_length = clampf(
				spring_arm.spring_length - zoom_step,
				min_distance,
				max_distance
			)
		elif event.button_index == MOUSE_BUTTON_WHEEL_DOWN:
			spring_arm.spring_length = clampf(
				spring_arm.spring_length + zoom_step,
				min_distance,
				max_distance
			)
