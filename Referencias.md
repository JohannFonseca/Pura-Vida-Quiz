# Referencias y Métodos Avanzados del Proyecto

Este documento reúne todas las fuentes oficiales de documentación, librerías, algoritmos clave, recursos culturales de Costa Rica, herramientas de diseño y el uso de inteligencia artificial empleados en el desarrollo de **Pura Vida Quiz**. Su estructura y profundidad reflejan el rigor técnico del proyecto.

---

## 1. Arquitectura Frontend y Documentación Core

El núcleo de la aplicación está construido con un stack moderno de SPA (Single Page Application) que asegura un rendimiento óptimo en la renderización y una experiencia fluida sin recargas de página.

*   [Vue 3 (Documentación Oficial)](https://vuejs.org/): Framework progresivo utilizado en su modalidad de **Composition API** (con la sintaxis `<script setup>`).
    *   **Métodos Clave:** Reactividad avanzada con `ref()`, `reactive()`, `computed()` para optimizar cálculos del DOM, `watch()` para observar cambios de estado, y los hooks del ciclo de vida (`onMounted`, `onUnmounted`) para configurar/destruir los bucles de juego de forma limpia.
    *   **Guías Especializadas:** [Vue Custom Composables](https://vuejs.org/guide/reusability/composables.html) (patrón utilizado para aislar los motores de juego en `useFightGame.js` y `useRunner.js`).
*   [Vite (Documentación Oficial)](https://vite.dev/): Entorno de desarrollo ultrarrápido y empaquetador de módulos. Se utiliza su sistema de Hot Module Replacement (HMR) y configuraciones de optimización para la compilación de producción.
*   [Vue Router v5](https://router.vuejs.org/): Manejador de enrutamiento dinámico para navegar entre las vistas (`JugarView.vue`, `MinijuegosView.vue`, `RankingView.vue`, etc.) mediante navegación programática con `useRouter()` e inyecciones limpias de rutas.

---

## 2. Motores de Videojuegos (HTML5 Canvas y Física)

Para los minijuegos en tiempo real (Pelea en el Redondel, Runner y Pesca FPV), se optó por renderizado nativo en un elemento `<canvas>` en lugar de manipular elementos del DOM. Esto reduce drásticamente las operaciones de reflujo (*reflow*) en el navegador, permitiendo alcanzar **60 FPS** estables.

*   [Bucle de Juego (Game Loop) y Delta Time](https://developer.mozilla.org/es/docs/Web/API/window/requestAnimationFrame): Explicación técnica sobre cómo usar `requestAnimationFrame(loop)` para sincronizar los frames con la tasa de refresco del monitor.
    *   **Método Fuerte:** Se utiliza el cálculo de *Delta Time* (diferencia de tiempo entre frames en milisegundos) multiplicando las físicas y velocidades por `dt`. Esto previene que el juego corra más rápido o lento en pantallas de 144Hz en comparación con las de 60Hz.
*   [Detección de Colisiones AABB (Axis-Aligned Bounding Box)](https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection): Algoritmo matemático para evaluar si dos rectángulos que no están rotados se superponen. Es el método más veloz y eficiente para juegos 2D.
    *   **Código implementado:**
        ```javascript
        const aabb = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
        ```
*   [Sistemas de Partículas en HTML5 Canvas](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D): Para simular efectos de impacto (chispas/tierra) al golpear o aterrizar en la pelea y al recolectar ítems en el runner. Cada partícula es un objeto con un vector de velocidad (`vx`, `vy`), gravedad interna, vida útil decrementable (`life`) y degradado de opacidad (`globalAlpha`).
*   **Técnica de Parallax Infinito con Aritmética Modular (Fit-Height Tiling):**
    *   Para el fondo del juego Runner, en lugar de renderizar infinitas imágenes, se calcula el ancho escalado de la imagen respecto al alto de la pantalla y se utiliza el operador de módulo (`gs.bgScroll % scaledW`) para pintar copias adyacentes de la imagen en un ciclo infinito, simulando un recorrido continuo imperceptible al ojo del usuario.
*   **Renderizado Dinámico de Texturas de Píxeles (Ruido Programático):**
    *   En `useFightGame.js`, se utiliza una función matemática (`drawTexture`) que dibuja puntos blancos y negros aleatorios con opacidades bajas (`ctx.globalAlpha = 0.12`) sobre los personajes para darles un aspecto retro tipo "ruido de consola clásica" sin sobrecargar memoria con texturas pesadas.
*   **Algoritmo de Shading Programático para Colores Hexadecimales:**
    *   Implementación de `shadeColor(hex, amount)` que toma un string hexadecimal, lo desglosa en sus componentes RGB en base 16, incrementa o decrementa su luminosidad programáticamente en base a un umbral y retorna un nuevo color hexadecimal. Esto se usa en `useFightGame.js` para dar volumen tridimensional en tiempo real a los personajes pintados en Canvas.

---

## 3. Animaciones Avanzadas e Interactividad

*   [GSAP (GreenSock Animation Platform)](https://gsap.com/): La biblioteca líder de la industria para animaciones de alto rendimiento.
    *   **Uso en el Proyecto:** Animaciones elásticas de entrada en menús (`gsap.from('.game-bg', { scale: 1.5 })`), vaivén de pangas simulando olas (`gsap.to('.bobbing', { y: 15, repeat: -1, yoyo: true })`), y transiciones de escalado dramático en cartas de resultados de minijuegos.
    *   [Visualizador de Curvas de Easing de GSAP](https://gsap.com/docs/v3/Eases/): Herramienta usada para seleccionar funciones de interpolación física realistas (como `power2.out`, `sine.inOut` o amortiguaciones elásticas).

---

## 4. Audio Procedural y de Alto Rendimiento (Web Audio API)

Para evitar descargar múltiples megabytes de archivos de sonido `.mp3` o `.wav` que ralentizarían la carga inicial del sitio y consumirían ancho de banda innecesario, se programó un sintetizador nativo digital utilizando el hardware de audio del navegador.

*   [Web Audio API (MDN Web Docs)](https://developer.mozilla.org/es/docs/Web/API/Web_Audio_API): API de JavaScript para procesar y sintetizar audio directamente en la web.
*   **Métodos y Nodos Clave Utilizados:**
    *   `AudioContext`: Entorno virtual de control de audio de la sesión del navegador.
    *   [OscillatorNode (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode): Generador de audio que produce ondas puras. Se utilizaron tipos de ondas cuadradas (`square`) para golpes tipo arcade retro, diente de sierra (`sawtooth`) para impactos graves y vibraciones intensas, triangulares (`triangle`) para triunfos armónicos, y senoidales (`sine`) para saltos ligeros y melodías dulces.
    *   [GainNode (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/GainNode): Controlador del volumen analógico virtual.
    *   **Curvas Envolventes Exponenciales:** Para evitar el molesto sonido de "clic" o "pop" cuando un oscilador inicia o termina de golpe, se implementó el método `exponentialRampToValueAtTime(0.001, currentTime + dur)` de la interfaz `AudioParam`. Esto reduce el volumen a cero en una pendiente logarítmica perfecta, logrando decaimientos musicales orgánicos (SFX tipo campana, silbato, explosión, etc.).
    *   **Modulación LFO (Low-Frequency Oscillator) en Tiempo Real:** En `useFightGame.js`, el sonido ambiente del redondel (`sfx.crowd`) se genera conectando un oscilador secundario lento de 0.5Hz a la frecuencia de un oscilador primario de 100Hz mediante un multiplicador de ganancia (`lfoGain`), modulando el tono en ondas para simular el clamor orgánico y fluctuante del público en el estadio.

---

## 5. Backend en la Nube y Almacenamiento Local

*   [Supabase (Documentación de JavaScript Client)](https://supabase.com/docs/reference/javascript/introduction): Plataforma Backend-as-a-Service (BaaS) de código abierto basada en PostgreSQL.
    *   **Consultas y Métodos:** Conexión segura usando `createClient(url, key)`. Consumo de base de datos SQL en tiempo real a través del cliente ORM de Supabase:
        *   `obtenerRanking()`: Consulta asíncrona estructurada con `.from('ranking').select('*').order('puntuacion', { ascending: false }).limit(10)` para armar el top 10 mundial de jugadores de forma instantánea.
        *   `guardarPuntuacion()`: Operación asíncrona de tipo `.insert()` que registra de forma atómica el puntaje del jugador, la marca temporal (*timestamp* generada por el servidor) y la sala opcional.
*   [Web Storage API (MDN Web Docs)](https://developer.mozilla.org/es/docs/Web/API/Window/localStorage): Mecanismo de persistencia local del lado del cliente.
    *   **Método fuerte:** Serialización y deserialización de datos estructurados complejos (como el historial detallado de capturas en el minijuego de pesca) convirtiéndolos a strings mediante `JSON.stringify()` al guardar y a objetos nativos con `JSON.parse()` al recuperar. Esto evita tener que consultar la nube repetidamente para guardar progresos simples (monedas, experiencia, nombre de usuario).

---

## 6. UI/UX Avanzado y Patrones de Interfaz

*   [Vue Teleport (Documentación)](https://vuejs.org/guide/built-ins/teleport.html): Componente integrado que permite "transportar" partes del HTML de un componente a un nodo DOM fuera de la jerarquía de Vue (por ejemplo, inyectar el simulador de pesca directamente en el `<body>`).
    *   **Importancia:** Vital para lograr un efecto real de pantalla completa y superposición absoluta (Z-Index absoluto) que no sea bloqueado por márgenes, contenedores limitados del Navbar, o layouts padres de la SPA.
*   **Efecto de Glassmorphism (Vidrio Esmerilado) en CSS Moderno:**
    *   Logrado mediante propiedades avanzadas de CSS como `backdrop-filter: blur(20px)` y `background: rgba(10, 22, 40, 0.7)`, ofreciendo una interfaz de usuario premium, semi-translúcida y futurista inspirada en los sistemas operativos modernos de Apple y Windows.
*   **Anillos de Progreso SVG Dinámicos (SVG Ring Arc Scaling):**
    *   En `PescaProFPVView.vue`, el indicador de fatiga del pez se calcula mediante una circunferencia matemática SVG dibujada con `strokeDasharray: 848` y modificando su `strokeDashoffset` en base al porcentaje de salud remanente, permitiendo que la barra curva se adapte al contorno circular con suavidad por hardware gráfico.

---

## 7. Fuentes de Información Cultural, Geográfica e Ictiológica (Costa Rica)

Dado que **Pura Vida Quiz** es un videojuego educativo y cultural riguroso, todos los datos internos fueron recopilados de fuentes costarricenses oficiales:

*   **Geografía, Parques Nacionales y Biodiversidad:**
    *   [SINAC (Sistema Nacional de Áreas de Conservación)](https://www.sinac.go.cr/): Datos sobre Bahía Ballena, el Golfo de Papagayo, y la biodiversidad icónica costarricense (como el Volcán Arenal, la Guaria Morada -*Guarianthe skinneri*-, la Rana Calzonuda -*Agalychnis callidryas*-, y la Tortuga Baula).
*   **Información Marítima y Especies de Pesca Deportiva:**
    *   [INCOPESCA (Instituto Costarricense de Pesca y Acuicultura)](https://www.incopesca.go.cr/): Regulaciones de pesca, datos biológicos y nombres científicos de las especies recreativas del Pacífico costarricense como el Pargo Rojo (*Lutjanus campechanus*), el Pez Vela (*Istiophorus platypterus*), el Mahi-Mahi/Dorado (*Coryphaena hippurus*) y el Atún Aleta Amarilla (*Thunnus albacares*).
*   **Jerga Nacional ("Habla como tico"):**
    *   [Academia Costarricense de la Lengua (ACL)](https://www.asociaciondeacademias.es/academias/academia-costarricense-de-la-lengua/): Consultas lingüísticas sobre el Diccionario de Costarriqueñismos para validar etimologías de expresiones locales tales como *"mae"*, *"bretear"*, *"yodo"* (como sinónimo de café chorreado), *"¿al chile?"*, *"¡qué jeta!"*, *"está mamando"*, entre otras.

---

## 8. Recursos Multimedia Externos

*   [Freesound.org (Comunidad Oficial)](https://freesound.org/): Repositorio público de efectos de sonido con licencias Creative Commons (usados de referencia para pulir la síntesis de sonido).
*   [Pexels](https://www.pexels.com/es-es/): Galería de imágenes libres de derechos de autor de alta resolución (utilizadas para el arte conceptual del juego y mapas).
*   **Canva Pro:** Plataforma de edición de vectores utilizada para la limpieza, eliminación de fondos mediante inteligencia artificial de recorte fotográfico, y estandarización cromática de los assets visuales de personajes y peces.

---

## 9. Uso de Inteligencia Artificial como Copiloto

Se integraron asistentes inteligentes en distintas fases del flujo de trabajo:

*   **ChatGPT (OpenAI):** Como apoyo en la conceptualización inicial del proyecto, comprensión detallada de los ciclos reactivos de Vue 3, depuración de lógica básica de condicionales y lluvia de ideas sobre minijuegos educativos.
*   **Antigravity (Claude / Gemini en Entorno Agentico):** Como copiloto avanzado de ingeniería de software. Utilizado para implementar las matemáticas avanzadas de colisiones en Canvas, programar los osciladores sintetizadores en el Web Audio API para asegurar que los envelopes exponenciales no tuvieran clics auditivos, estructurar la modularidad limpia del código en composables independientes (aislando la lógica del render), optimizar el Scroll Seamless del fondo en CSS/JS y solucionar problemas de compilación en el bundler de Vite.

---

## 10. Notas Adicionales del Proyecto

Pensé en mezclar la opción de divulgación de Costa Rica junto con un juego educativo sumamente inmersivo. Algo que realmente funcione para aprender sobre Costa Rica, que sea visualmente estimulante, divertido, y que no se sienta simplemente como un proyecto escolar plano sin sentido, sino como una experiencia interactiva que realmente aporte valor cultural, pedagógico y técnico.

