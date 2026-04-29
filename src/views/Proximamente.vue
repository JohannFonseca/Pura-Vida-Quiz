<script setup>
/**
 * Proximamente.vue
 * 
 * Esta es una página de "borrador" o "placeholder".
 * Se usa para secciones que todavía no están listas pero que queremos que aparezcan en el menú.
 */
</script>

<template>
  <div class="coming-soon">
    <!-- Usamos un div con una clase descriptiva -->
    <div class="glass-card">
      <h1 class="emoji">🚧</h1>
      <h2>Próximamente</h2>
      <p>Estamos preparando un nuevo modo de juego para que sigás aprendiendo sobre Costa Rica.</p>
      
      <!-- router-link para volver atrás de forma segura -->
      <router-link to="/quizzes" class="btn-back">
        Volver a los juegos
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.coming-soon {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  padding: 2rem;
}

/* Efecto de 'tarjeta de cristal' (Glassmorphism) */
.glass-card {
  background: white;
  padding: 3rem;
  border-radius: 24px;
  text-align: center;
  max-width: 450px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--border-color);
}

.emoji {
  font-size: 4rem;
  margin-bottom: 1rem;
}

h2 {
  font-size: 2rem;
  color: var(--text-main);
  margin-bottom: 1rem;
  font-weight: 800;
}

p {
  font-size: 1.1rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.btn-back {
  display: inline-block;
  background: var(--bg-color);
  color: var(--text-main);
  text-decoration: none;
  padding: 0.8rem 1.5rem;
  border-radius: 99px;
  font-weight: 700;
  transition: all 0.2s ease;
  border: 1px solid var(--border-color);
}

.btn-back:hover {
  background: white;
  border-color: var(--accent-green);
  color: var(--accent-green-dark);
}
</style>
