<script setup>
import { ref } from 'vue';

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

/**
 * App.vue
 * Pura Vida Quiz - aca se ve la pagina principal
 */
</script>

<template>
  <div class="app-container">
    <nav class="navbar">
      <div class="nav-content">
        <div class="brand">Pura Vida Quiz 🇨🇷</div>
        <div class="nav-links" :class="{ 'open': isMenuOpen }">
          <router-link to="/" class="nav-btn" active-class="active" @click="closeMenu">Inicio</router-link>
          <router-link to="/jugar" class="nav-btn" active-class="active" @click="closeMenu">Jugar</router-link>
          <router-link to="/ranking" class="nav-btn" active-class="active" @click="closeMenu">Ranking</router-link>
          <router-link to="/acerca-de" class="nav-btn" active-class="active" @click="closeMenu">Acerca de</router-link>
        </div>
        <!-- Boton del menu -->
        <button class="mobile-menu-btn" aria-label="Abrir menú" @click="toggleMenu">
          <svg v-if="!isMenuOpen" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          <svg v-else viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </nav>

    <main class="main-content">
      <router-view />
    </main>

    <footer class="footer">
      <div class="footer-content">
        <p>Creado por Johann Fonseca</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* ============================================
   Layout Principal
   ============================================ */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* ============================================
   Navbar
   ============================================ */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: var(--bg-nav);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
  z-index: 1000;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: -0.5px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.brand:hover {
  transform: scale(1.02);
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-btn {
  text-decoration: none;
  color: var(--text-muted);
  font-weight: 700;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.nav-btn:hover {
  color: var(--accent-green-dark);
  background-color: rgba(34, 197, 94, 0.1); /* Fondo verde */
}

.nav-btn.active {
  color: var(--accent-green-dark);
}

.nav-btn.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 10%;
  width: 80%;
  height: 3px;
  background-color: var(--accent-green);
  border-radius: 3px 3px 0 0;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: var(--text-main);
  cursor: pointer;
}

/* ============================================
   Contenido Principal
   ============================================ */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 80px; /* Compensa el navbar fijo */
  padding: 2rem;
}



/* ============================================
   Footer
   ============================================ */
.footer {
  background-color: #ffffff;
  border-top: 1px solid var(--border-color);
  padding: 1.5rem;
  text-align: center;
  margin-top: auto;
}

.footer-content p {
  color: var(--text-muted);
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* ============================================
   Responsive (Mobile)
   ============================================ */
@media (max-width: 768px) {
  .nav-links {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: var(--bg-nav);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border-color);
    padding: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }
  
  .nav-links.open {
    display: flex;
  }
  
  .mobile-menu-btn {
    display: block;
  }
}
</style>
