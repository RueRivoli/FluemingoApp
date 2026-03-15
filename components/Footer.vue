<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="footer">
    <nav class="footer-links">
      <BadgeLogo theme="light" />
      <div class="footer-links-item">
        <ul>
          <h3 class="footer-links-item-title">The App</h3>
            <li>
              <a href="#features" rel="noopener">Features</a>
            </li>
            <li>
              <a href="#features" rel="noopener">Preview</a>
            </li>
            <li>
              <a href="#testimonials" rel="noopener">Testimonials</a>
            </li>
            <!-- <li>
              <a href="#updates" rel="noopener">Updates</a>
            </li> -->
        </ul>
      </div>
      <div class="footer-links-item">
        <ul>
          <h3 class="footer-links-item-title">Company</h3>
          <!-- <li>
            <a href="/blog" rel="noopener">Blog</a>
          </li> -->
            <li>
              <a href="https://www.fluemingo.com/terms" target="_blank" rel="noopener">Contact</a>
            </li>
        </ul>
      </div>
      <div class="footer-links-item">
        <ul>
          <h3 class="footer-links-item-title">Legal</h3>
          <li>
            <a href="/privacy-policy" target="_blank" rel="noopener">Privacy Policy</a>
          </li>
          <li>
            <a href="/terms" target="_blank" rel="noopener">Terms of Service</a>
          </li>
        </ul>
      </div>
    </nav>
    <div class="footer-copy-container">
      <p class="footer-copy">&copy; {{ currentYear }} FlueHero - All rights reserved</p>
    </div>
  </footer>
</template>

<style scoped>

.footer-links {
  display: flex;
  justify-content: space-around;
  gap: 5rem;
  margin-top: 2rem;
}

.footer-links-item {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  li {
    margin: 0;
    padding: 0;
  }
  a {
    text-decoration: none;
    color: var(--color-text);
  }
  .footer-links-item-title {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--color-text);
  }
}

.footer-copy-container {
  border-top: 1px solid var(--color-border);
  margin: 2rem 0;
  padding-top: 2rem;
  text-align: center;
}

.footer-copy {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

</style>