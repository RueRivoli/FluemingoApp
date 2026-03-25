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
              <a href="/contact" rel="noopener">Contact</a>
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
          <li>
            <a href="/user-data-deletion" target="_blank" rel="noopener">Data Deletion</a>
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
.footer {
  padding: 0 var(--page-gutter) 2rem;
}

.footer-links {
  width: min(100%, var(--page-max-width));
  margin: 0 auto;
  padding: 1rem 0 2rem;
  display: grid;
  grid-template-columns: minmax(180px, 1.2fr) repeat(3, minmax(140px, 1fr));
  gap: 2rem;
  align-items: start;
}

.footer-links-item {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-links-item ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links-item li {
  margin: 0 0 0.75rem;
  padding: 0;
}

.footer-links-item a {
  text-decoration: none;
  color: var(--color-text);
}

.footer-links-item-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--color-text);
}

.footer-copy-container {
  width: min(100%, var(--page-max-width));
  border-top: 1px solid var(--color-border);
  margin: 0 auto;
  padding-top: 2rem;
  text-align: center;
}

.footer-copy {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

@media (max-width: 1024px) {
  .footer-links {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .footer {
    padding-bottom: 1.5rem;
  }

  .footer-links {
    grid-template-columns: minmax(0, 1fr);
    gap: 1.5rem;
  }
}
</style>
