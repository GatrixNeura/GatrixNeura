extends MeshInstance3D

@export var ancho_linea: float = 0.3 # Un poco más fina para que parezca una estela delicada
@export var color_estela: Color = Color(0.6, 0.2, 1.0, 1.0) # Púrpura mágico por defecto (puedes cambiarlo a celeste en el inspector)
@export var velocidad_animacion: float = 3.0
@export var densidad_estela: float = 2.0 
@export var altura_suelo: float = 0.2 # Elevación para que no atraviese el piso

@export var ListaDeObjetivos: Array[Node3D] = []

var malla_inmediata: ImmediateMesh
var material_shader: ShaderMaterial

func _ready() -> void:
	top_level = true
	malla_inmediata = ImmediateMesh.new()
	mesh = malla_inmediata
	
	# Shader rediseñado para que parezca una estela de energía mágica
	var shader = Shader.new()
	shader.code = """
	shader_type spatial;
	render_mode unshaded, cull_disabled, blend_mix;
	
	uniform vec4 color_base : source_color = vec4(0.6, 0.2, 1.0, 1.0);
	uniform float velocidad = 3.0;
	uniform float densidad = 2.0;
	
	void fragment() {
		// Coordenada a lo largo de la línea con movimiento fluido
		float u = UV.x * densidad - TIME * velocidad;
		// Distancia desde el centro de la línea (0 en el medio, 1 en los bordes)
		float v = abs(UV.y - 0.5) * 2.0;
		
		// Núcleo brillante y difuminado (más intenso al centro, se desvanece en los bordes)
		float nucleo = 1.0 - smoothstep(0.0, 1.0, v);
		
		// Onda de energía sutil que recorre la estela
		float pulso = sin(u * 6.2831) * 0.5 + 0.5;
		
		// Combinación final para lograr la textura mágica
		float alpha = nucleo * mix(0.3, 1.0, pulso);
		
		ALBEDO = color_base.rgb * 1.5; // Multiplicamos un poco para darle un efecto luminoso (glow)
		ALPHA = alpha * color_base.a;
	}
	"""
	
	material_shader = ShaderMaterial.new()
	material_shader.shader = shader
	material_shader.set_shader_parameter("color_base", color_estela)
	material_shader.set_shader_parameter("velocidad", velocidad_animacion)
	material_shader.set_shader_parameter("densidad", densidad_estela)

func _process(_delta: float) -> void:
	malla_inmediata.clear_surfaces()
	
	var origen = get_tree().get_first_node_in_group("player") as Node3D
	var destino = MisionesGlobal.obtener_objetivo_actual(ListaDeObjetivos) as Node3D
	
	if not origen or not destino:
		return
		
	var punto_a = origen.global_position + Vector3(0, altura_suelo, 0)
	var punto_b = destino.global_position + Vector3(0, altura_suelo, 0)
	
	var distancia = punto_a.distance_to(punto_b)
	if distancia < 0.1:
		return
		
	var direccion = (punto_b - punto_a).normalized()
	var lateral = direccion.cross(Vector3.UP).normalized() * (ancho_linea * 0.5)
	
	malla_inmediata.surface_begin(Mesh.PRIMITIVE_TRIANGLES, material_shader)
	
	# Triángulo 1
	malla_inmediata.surface_set_uv(Vector2(0, 0))
	malla_inmediata.surface_add_vertex(punto_a - lateral)
	malla_inmediata.surface_set_uv(Vector2(1, 0))
	malla_inmediata.surface_add_vertex(punto_b - lateral)
	malla_inmediata.surface_set_uv(Vector2(1, 1))
	malla_inmediata.surface_add_vertex(punto_b + lateral)
	
	# Triángulo 2
	malla_inmediata.surface_set_uv(Vector2(0, 0))
	malla_inmediata.surface_add_vertex(punto_a - lateral)
	malla_inmediata.surface_set_uv(Vector2(1, 1))
	malla_inmediata.surface_add_vertex(punto_b + lateral)
	malla_inmediata.surface_set_uv(Vector2(0, 1))
	malla_inmediata.surface_add_vertex(punto_a + lateral)
	
	malla_inmediata.surface_end()


func _on_area_3d_body_entered(body: Node3D) -> void:
	if body.is_in_group("player"):
		self.set_deferred("visible",false)


func _on_area_3d_body_exited(body: Node3D) -> void:
	if body.is_in_group("player"):
		self.set_deferred("visible",true)
