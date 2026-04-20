<script setup>
import { ref, computed } from 'vue';

// aquí metemos todos los lugares chivas que queremos recomendar, lo guardamos en un ref para que vue esté atento a los cambios
const destinos = ref([
  {
    id: 1,
    nombre: 'Manuel Antonio',
    provincia: 'Puntarenas',
    categoria: 'Playa',
    vibe: 'Familiar',
    descripcion: 'El parque nacional más famoso, donde el bosque tropical se une con el mar.',
    imagen: '/imagenes/planificador/manuel_antonio.png',
    tags: ['#Popular', '#Animales', '#Relax'],
    locales: [
      { nombre: 'Soda El Angel', tipo: 'Comida', link: 'https://www.google.com/maps/search/Manuel+Antonio+Soda' },
      { nombre: 'Hotel San Bada', tipo: 'Hospedaje', link: 'https://www.google.com/maps/search/Hotel+San+Bada' }
    ]
  },
  {
    id: 2,
    nombre: 'Volcán Arenal',
    provincia: 'Alajuela',
    categoria: 'Montaña',
    vibe: 'Aventura',
    descripcion: 'Aguas termales, caminatas sobre lava y la vista más icónica del país.',
    imagen: '/imagenes/planificador/volcan_arenal.png',
    tags: ['#Volcán', '#Termales', '#Caminata'],
    locales: [
      { nombre: 'Restaurante La Fortuna', tipo: 'Comida', link: 'https://www.google.com/maps/search/La+Fortuna+Restaurantes' },
      { nombre: 'Tabacón Thermal Resort', tipo: 'Hospedaje', link: 'https://www.google.com/maps/search/Tabacon' }
    ]
  },
  {
    id: 3,
    nombre: 'Puerto Viejo',
    provincia: 'Limón',
    categoria: 'Playa',
    vibe: 'Chill',
    descripcion: 'Cultura caribeña, playas de arena blanca y negra, y mucha bicicleta.',
    imagen: '/imagenes/planificador/puerto_viejo.png',
    tags: ['#Reggae', '#Bici', '#Caribe'],
    locales: [
      { nombre: 'Soda Lidia', tipo: 'Comida', link: 'https://www.google.com/maps/search/Puerto+Viejo+Soda+Lidia' },
      { nombre: 'Selina Puerto Viejo', tipo: 'Hospedaje', link: 'https://www.google.com/maps/search/Selina+Puerto+Viejo' }
    ]
  },
  {
    id: 4,
    nombre: 'Monteverde',
    provincia: 'Puntarenas',
    categoria: 'Montaña',
    vibe: 'Naturaleza',
    descripcion: 'Pasea por las nubes en los puentes colgantes del bosque nuboso.',
    imagen: '/imagenes/planificador/monteverde.png',
    tags: ['#BosqueNuboso', '#Canopy', '#Naturaleza'],
    locales: [
      { nombre: 'Tree House Restaurant', tipo: 'Comida', link: 'https://www.google.com/maps/search/TreeHouse+Monteverde' },
      { nombre: 'Hotel Belmar', tipo: 'Hospedaje', link: 'https://www.google.com/maps/search/Hotel+Belmar' }
    ]
  },
  {
    id: 5,
    nombre: 'Tamarindo',
    provincia: 'Guanacaste',
    categoria: 'Playa',
    vibe: 'Surf',
    descripcion: 'La meca del surf en el Pacífico norte, conocida como "Tama-gringo".',
    imagen: '/imagenes/planificador/tamarindo.png',
    tags: ['#Surf', '#Fiesta', '#Atardeceres'],
    locales: [
      { nombre: 'Pangas Beach Club', tipo: 'Comida', link: 'https://www.google.com/maps/search/Pangas+Tamarindo' },
      { nombre: 'Hotel Tamarindo Diria', tipo: 'Hospedaje', link: 'https://www.google.com/maps/search/Hotel+Tamarindo+Diria' }
    ]
  },
  {
    id: 6,
    nombre: 'Tortuguero',
    provincia: 'Limón',
    categoria: 'Montaña',
    vibe: 'Naturaleza',
    descripcion: 'El "Amazonas" de Costa Rica. Solo se llega en bote o avioneta.',
    imagen: '/imagenes/planificador/tortuguero.png',
    tags: ['#Tortugas', '#Canales', '#Aventura'],
    locales: [
      { nombre: 'Restaurante Mi Niño', tipo: 'Comida', link: 'https://www.google.com/maps/search/Tortuguero+Restaurante' },
      { nombre: 'Pachira Lodge', tipo: 'Hospedaje', link: 'https://www.google.com/maps/search/Pachira+Lodge' }
    ]
  },
  {
    id: 7,
    nombre: 'Parque Marino Ballena',
    provincia: 'Puntarenas',
    categoria: 'Playa',
    vibe: 'Chill',
    descripcion: 'Famoso por su formación en "Cola de Ballena" y el avistamiento de cetáceos.',
    imagen: '/imagenes/planificador/marino_ballena.png',
    tags: ['#Ballenas', '#Snorkel', '#Uvita'],
    locales: [
      { nombre: 'Soda La Amistad', tipo: 'Comida', link: 'https://www.google.com/maps/search/Soda+La+Amistad+Uvita' },
      { nombre: 'Hotel Cristal Ballena', tipo: 'Hospedaje', link: 'https://www.google.com/maps/search/Hotel+Cristal+Ballena' }
    ]
  },
  {
    id: 8,
    nombre: 'Nosara',
    provincia: 'Guanacaste',
    categoria: 'Playa',
    vibe: 'Yoga',
    descripcion: 'Un paraíso de bienestar, yoga y olas constantes todo el año.',
    imagen: '/imagenes/planificador/nosara.png',
    tags: ['#Yoga', '#Saludable', '#Surf'],
    locales: [
      { nombre: 'La Luna', tipo: 'Comida', link: 'https://www.google.com/maps/search/La+Luna+Nosara' },
      { nombre: 'The Gilded Iguana', tipo: 'Hospedaje', link: 'https://www.google.com/maps/search/Gilded+Iguana' }
    ]
  },
  {
    id: 10,
    nombre: 'Volcán Poás',
    provincia: 'Alajuela',
    categoria: 'Montaña',
    vibe: 'Mirador',
    descripcion: 'Uno de los cráteres más grandes del mundo con una laguna ácida turquesa.',
    imagen: '/imagenes/planificador/volcan_poas.png',
    tags: ['#Frío', '#Laguna', '#CercaDeChepe'],
    locales: [
      { nombre: 'Restaurante Chubascos', tipo: 'Comida', link: 'https://www.google.com/maps/search/Chubascos+Poas' },
      { nombre: 'Poas Volcano Lodge', tipo: 'Hospedaje', link: 'https://www.google.com/maps/search/Poas+Volcano+Lodge' }
    ]
  },
  {
    id: 11,
    nombre: 'Río Celeste',
    provincia: 'Alajuela',
    categoria: 'Naturaleza',
    vibe: 'Aventura',
    descripcion: 'Aguas color turquesa intenso creadas por una reacción química natural.',
    imagen: '/imagenes/planificador/rio_celeste.png',
    tags: ['#Turquesa', '#Catarata', '#Senderismo'],
    locales: [
      { nombre: 'Soda Rio Celeste', tipo: 'Comida', link: 'https://www.google.com/maps/search/Soda+Rio+Celeste' },
      { nombre: 'Rio Celeste Hideaway', tipo: 'Hospedaje', link: 'https://www.google.com/maps/search/Rio+Celeste+Hideaway' }
    ]
  },
  {
    id: 12,
    nombre: 'Corcovado',
    provincia: 'Puntarenas',
    categoria: 'Parques',
    vibe: 'Naturaleza',
    descripcion: 'El lugar biológicamente más intenso de la Tierra según National Geographic.',
    imagen: '/imagenes/planificador/corcovado.png',
    tags: ['#Jungla', '#Biodiversidad', '#Remoto'],
    locales: [
      { nombre: 'Puesto Sirena', tipo: 'Refugio', link: 'https://www.google.com/maps/search/Corcovado+Sirena' },
      { nombre: 'Danta Corcovado Lodge', tipo: 'Hospedaje', link: 'https://www.google.com/maps/search/Danta+Corcovado' }
    ]
  },
  {
    id: 13,
    nombre: 'Cerro Chirripó',
    provincia: 'San José',
    categoria: 'Montaña',
    vibe: 'Reto',
    descripcion: 'El punto más alto de Costa Rica. En días despejados puedes ver ambos océanos.',
    imagen: '/imagenes/planificador/chirripo.png',
    tags: ['#Caminata', '#Reto', '#FrioExtremo'],
    locales: [
      { nombre: 'Albergue Base Crestones', tipo: 'Hospedaje', link: 'https://www.google.com/maps/search/Base+Crestones' },
      { nombre: 'Soda San Gerardo', tipo: 'Comida', link: 'https://www.google.com/maps/search/San+Gerardo+Rivas+Soda' }
    ]
  },
  {
    id: 14,
    nombre: 'Cahuita',
    provincia: 'Limón',
    categoria: 'Playa',
    vibe: 'Relajación',
    descripcion: 'Arrecifes de coral, arena blanca y un sendero lleno de perezosos y monos.',
    imagen: '/imagenes/planificador/cahuita.png',
    tags: ['#Arrecife', '#Perezosos', '#Caribe'],
    locales: [
      { nombre: 'Sobre las Olas', tipo: 'Comida', link: 'https://www.google.com/maps/search/Sobre+las+Olas+Cahuita' },
      { nombre: 'Playa Negra Guesthouse', tipo: 'Hospedaje', link: 'https://www.google.com/maps/search/Playa+Negra+Guesthouse' }
    ]
  },
  {
    id: 15,
    nombre: 'Sámara',
    provincia: 'Guanacaste',
    categoria: 'Playa',
    vibe: 'Familiar',
    descripcion: 'Una de las playas más seguras y tranquilas, protegida por un arrecife de coral.',
    imagen: '/imagenes/planificador/samara.png',
    tags: ['#Seguro', '#Familia', '#Tranquilidad'],
    locales: [
      { nombre: 'Microbar Sámara', tipo: 'Comida', link: 'https://www.google.com/maps/search/Microbar+Samara' },
      { nombre: 'Hotel Belvedere', tipo: 'Hospedaje', link: 'https://www.google.com/maps/search/Hotel+Belvedere+Samara' }
    ]
  }
]);

// ocupamos variables reactivas para los filtros y lo que el usuario escribe en el buscador
const searchTerm = ref('');
const activeCategory = ref('Todos');
const showItineraryGen = ref(false);
const days = ref(3);
const prefType = ref('Mix');

// esta parte de computed es super útil porque filtra la lista de destinos solita cada vez que el usuario escribe algo
const destinosFiltrados = computed(() => {
  return destinos.value.filter(dest => {
    // pasamos todo a minúsculas para que la búsqueda no falle si ponen una mayúscula
    const matchedSearch = dest.nombre.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                          dest.provincia.toLowerCase().includes(searchTerm.value.toLowerCase());
    // aquí revisamos si el destino coincide con la categoría que marcaron (playa o montaña)
    const matchedCategory = activeCategory.value === 'Todos' || dest.categoria === activeCategory.value;
    return matchedSearch && matchedCategory;
  });
});

// este generador es como un mini cerebro que arma la ruta dependiendo de los días y lo que prefiera el usuario
const suggestedItinerary = computed(() => {
  const isFiveDays = days.value === 5;
  
  if (prefType.value === 'Playa') {
    return isFiveDays 
      ? 'Día 1: Llegada a Tamarindo. Día 2: Surf en Playa Avellanas. Día 3: Snorkel en Conchal. Día 4: Tour a Nosara. Día 5: Atardecer en Sámara.'
      : 'Día 1: Llegada a Tamarindo y tarde de surf. Día 2: Tour a Playa Conchal. Día 3: Atardecer en catamarán.';
  } 
  
  if (prefType.value === 'Montaña') {
    return isFiveDays
      ? 'Día 1: Volcán Arenal. Día 2: Aguas Termales. Día 3: Monteverde Bosque Nuboso. Día 4: Río Celeste. Día 5: Volcán Poás y regreso.'
      : 'Día 1: Caminata en Volcán Arenal. Día 2: Tour de puentes colgantes en Monteverde. Día 3: Aguas termales y relajo.';
  }
  
  // MIX / Otros
  return isFiveDays
    ? 'Día 1: San José Museos. Día 2: Manuel Antonio. Día 3: Marino Ballena. Día 4: Volcán Arenal. Día 5: Poás y Catarata del Toro.'
    : 'Día 1: Ciudad de San José y Museos. Día 2: Manuel Antonio Playa y animales. Día 3: Tour de café y volcanes rápidos.';
});
</script>

<template>
  <div class="planner-page">
    <!-- sección principal con el título, bien llamativo -->
    <header class="planner-hero">
      <span class="badge">Nuevo</span>
      <h1>Planifica tu viaje <span class="highlight">Pura Vida</span></h1>
      <p>Busca playas, reserva locales y organiza tu ruta ideal por Costa Rica.</p>
    </header>

    <!-- aquí va el buscador y los botones de filtro, usamos v-model para capturar lo que escriben -->
    <div class="search-section">
      <div class="search-bar">
        <span class="search-icon">🔍</span>
        <input 
          v-model="searchTerm" 
          type="text" 
          placeholder="Busca una playa o provincia..."
        />
      </div>
      
      <div class="filter-chips">
        <!-- hacemos un v-for para no repetir código creando cada botón de categoría -->
        <button 
          v-for="cat in ['Todos', 'Playa', 'Montaña']" 
          :key="cat"
          :class="['chip', { active: activeCategory === cat }]"
          @click="activeCategory = cat"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- el grid donde se muestran las tarjetas, usamos destinosFiltrados en vez de la lista original -->
    <section class="destinations-grid">
      <div v-for="dest in destinosFiltrados" :key="dest.id" class="dest-card">
        <div class="card-image">
          <img :src="dest.imagen" :alt="dest.nombre" />
          <div class="category-tag">{{ dest.categoria }}</div>
        </div>
        
        <div class="card-body">
          <div class="card-header">
            <h3>{{ dest.nombre }}</h3>
            <span class="provincia">{{ dest.provincia }}</span>
          </div>
          
          <p class="description">{{ dest.descripcion }}</p>
          
          <div class="tags">
            <span v-for="tag in dest.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>

          <hr class="divider" />

          <!-- esta lista de locales es directa a maps, súper útil para el usuario -->
          <div class="locales-section">
            <h4>📍 Lugares Sugeridos</h4>
            <div class="locales-grid">
              <a v-for="local in dest.locales" 
                 :key="local.nombre" 
                 :href="local.link" 
                 target="_blank" 
                 class="local-item"
              >
                <span class="local-icon">{{ local.tipo === 'Comida' ? '🍴' : '🏨' }}</span>
                <span class="local-name">{{ local.nombre }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- EMPTY STATE -->
      <div v-if="destinosFiltrados.length === 0" class="empty-state">
        <p>No encontramos nada parecido... ¡Prueba con otra búsqueda!</p>
      </div>
    </section>

    <!-- ITINERARY GENERATOR -->
    <section class="itinerary-tool glass-card">
      <div class="tool-info">
        <h3>✨ Generador de Itinerarios</h3>
        <p>¿No sabes por dónde empezar? Nosotros te armamos una ruta rápida.</p>
        
        <div class="inputs">
          <div class="input-group">
            <label>Días</label>
            <select v-model="days">
              <option :value="3">3 Días</option>
              <option :value="5">5 Días</option>
            </select>
          </div>
          
          <div class="input-group">
            <label>Preferencia</label>
            <select v-model="prefType">
              <option value="Playa">Solo Playas</option>
              <option value="Montaña">Montaña y Volcanes</option>
              <option value="Mix">Un poco de todo</option>
            </select>
          </div>
        </div>

        <div class="itinerary-result">
          <p><strong>Ruta Sugerida:</strong></p>
          <p>{{ suggestedItinerary }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* esto hace que todo el planner esté centrado y no se pegue a los bordes */
.planner-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.planner-hero {
  text-align: center;
  margin-bottom: 3rem;
}

/* la etiqueta de "nuevo", mola mucho el efecto de bordes redondeados */
.badge {
  background: var(--accent-green-light);
  color: var(--accent-green-dark);
  padding: 0.3rem 0.8rem;
  border-radius: 99px;
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  margin-bottom: 1rem;
  display: inline-block;
}

h1 {
  /* un título grande y fuerte para que se note la marca */
  font-size: 3rem;
  color: var(--text-main);
  margin-bottom: 1rem;
}

.highlight {
  color: var(--accent-green-dark);
}

/* acomodamos el buscador para que esté arriba y bien centrado */
.search-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.search-bar {
  position: relative;
  width: 100%;
  max-width: 600px;
}

.search-icon {
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.5;
}

input {
  width: 100%;
  padding: 1.25rem 1.25rem 1.25rem 3.5rem;
  border-radius: 99px;
  border: 2px solid var(--border-color);
  background: white;
  font-size: 1.1rem;
  font-family: inherit;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

input:focus {
  outline: none;
  border-color: var(--accent-green);
  box-shadow: 0 4px 20px rgba(34, 197, 94, 0.15);
}

.filter-chips {
  display: flex;
  gap: 0.75rem;
}

/* estilazo para los botones de filtrado (playa/montaña) */
.chip {
  padding: 0.5rem 1.5rem;
  border-radius: 99px;
  border: 1px solid var(--border-color);
  background: white;
  cursor: pointer;
  font-weight: 700;
  color: var(--text-muted);
  transition: all 0.2s ease;
}

.chip.active {
  background: var(--accent-green);
  color: white;
  border-color: var(--accent-green);
}

/* aquí configuramos el grid para que en pantallas grandes se vea de varias columnas */
.destinations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

/* diseño de las tarjetas, les pusimos bordes redondeados para que se vean modernas */
.dest-card {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
}

.dest-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.card-image {
  height: 200px;
  position: relative;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-tag {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 800;
  color: var(--accent-green-dark);
  backdrop-filter: blur(4px);
}

.card-body {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.card-header h3 {
  font-size: 1.4rem;
  color: var(--text-main);
  margin: 0;
}

.provincia {
  font-size: 0.85rem;
  color: var(--text-muted);
  background: var(--bg-color);
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
}

.description {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: 1.25rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tag {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--accent-green-dark);
  background: rgba(34, 197, 94, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.divider {
  border: 0;
  border-top: 1px solid var(--border-color);
  margin: 1.5rem 0;
}

.locales-section h4 {
  font-size: 0.9rem;
  margin-bottom: 1rem;
  color: var(--text-main);
}

.locales-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.local-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--text-main);
  background: var(--bg-color);
  padding: 0.6rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 700;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.local-item:hover {
  background: white;
  border-color: var(--accent-green);
  transform: scale(1.02);
}

.local-icon {
  font-size: 1rem;
}

/* la herramienta para armar rutas, con este borde verde luce genial */
.itinerary-tool {
  background: white;
  padding: 2.5rem;
  border-radius: 32px;
  border: 2px solid var(--accent-green-light);
  box-shadow: 0 15px 30px rgba(34, 197, 94, 0.05);
}

.tool-info h3 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.inputs {
  display: flex;
  gap: 2rem;
  margin: 2rem 0;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-weight: 800;
  font-size: 0.9rem;
  color: var(--text-muted);
}

select {
  padding: 0.8rem 1.2rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  font-family: inherit;
  font-weight: 700;
  color: var(--text-main);
  background: var(--bg-color);
}

.itinerary-result {
  background: var(--bg-color);
  padding: 1.5rem;
  border-radius: 16px;
  border-left: 5px solid var(--accent-green);
}

@media (max-width: 768px) {
  h1 { font-size: 2.2rem; }
  .inputs { flex-direction: column; gap: 1rem; }
  .locales-grid { grid-template-columns: 1fr; }
}
</style>
