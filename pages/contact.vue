<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRuntimeConfig } from 'nuxt/app';
import NavBar from '../components/NavBar.vue';
import Footer from '../components/Footer.vue';

const config = useRuntimeConfig();
const formspreeEndpoint = config.public.formspreeEndpoint as string;

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
});

const status = ref<'idle' | 'sending' | 'success' | 'error'>('idle');
const errorMessage = ref('');

async function handleSubmit(e: Event) {
  e.preventDefault();
  if (!formspreeEndpoint) {
    status.value = 'error';
    errorMessage.value = 'Contact form is not configured. Please email us at contact@fluemingo-app.com';
    return;
  }

  status.value = 'sending';
  errorMessage.value = '';

  try {
    const res = await fetch(formspreeEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
      }),
    });

    if (res.ok) {
      status.value = 'success';
      form.name = '';
      form.email = '';
      form.subject = '';
      form.message = '';
    } else {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || `Request failed (${res.status})`);
    }
  } catch (err) {
    status.value = 'error';
    errorMessage.value = err instanceof Error ? err.message : 'Something went wrong. Please try again or email us at contact@fluemingo-app.com';
  }
}
</script>

<template>
  <div class="landing">
    <NavBar theme="light" />
    <div class="contact-container">
      <h1>Contact Us</h1>
      <div class="contact-content">
        <p class="contact-intro">
          We'd love to hear from you. Whether you have a question about Fluemingo, need support, or want to share feedback, we're here to help.
        </p>

        <form v-if="status !== 'success'" class="contact-form" @submit="handleSubmit">
          <div class="form-group">
            <label for="name">Name</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              name="name"
              required
              placeholder="Your name"
              :disabled="status === 'sending'"
            />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              name="email"
              required
              placeholder="your@email.com"
              :disabled="status === 'sending'"
            />
          </div>
          <div class="form-group">
            <label for="subject">Subject</label>
            <input
              id="subject"
              v-model="form.subject"
              type="text"
              name="subject"
              required
              placeholder="What is this about?"
              :disabled="status === 'sending'"
            />
          </div>
          <div class="form-group">
            <label for="message">Message</label>
            <textarea
              id="message"
              v-model="form.message"
              name="message"
              required
              rows="5"
              placeholder="Your message..."
              :disabled="status === 'sending'"
            />
          </div>
          <p v-if="status === 'error'" class="form-error">{{ errorMessage }}</p>
          <button type="submit" class="submit-btn" :disabled="status === 'sending'">
            {{ status === 'sending' ? 'Sending...' : 'Send message' }}
          </button>
        </form>

        <div v-else class="contact-success">
          <p class="success-message">Thank you! Your message has been sent. We'll get back to you within 24–48 hours.</p>
          <button type="button" class="submit-btn" @click="status = 'idle'">
            Send another message
          </button>
        </div>

        <p v-if="!formspreeEndpoint" class="contact-fallback">
          Or email us directly at <a href="mailto:contact@fluemingo-app.com" class="contact-email">contact@fluemingo-app.com</a>
        </p>
        <p v-else class="contact-response-note">
          We typically respond within 24–48 hours.
        </p>

        <div class="contact-method">
          <h3>Publisher</h3>
          <p>
            Fluemingo is published and operated by <strong>FlueHero</strong>, a trading name of Florent GALLOIS, registered as a sole trader (auto-entrepreneur) in France under SIRET n°82308601200023.
          </p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<style scoped>
.landing {
  background-color: var(--color-background);
  line-height: 1.6;
  min-height: 100vh;
}

.contact-container {
  width: min(100%, var(--page-max-width-narrow));
  margin: 0 auto;
  padding: clamp(2rem, 5vw, 3rem) var(--page-gutter);
}

.contact-content {
  padding: 1rem 0 0;
  max-width: 680px;
}

.contact-intro {
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: var(--color-text);
}

.form-group input,
.form-group textarea {
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border-muted);
  border-radius: 0.5rem;
  font-family: inherit;
  font-size: 1rem;
  background: var(--color-bg);
  color: var(--color-text);
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-group input:disabled,
.form-group textarea:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.form-error {
  color: var(--color-error);
  font-size: 0.9rem;
  margin: 0;
}

.submit-btn {
  padding: 0.75rem 1.5rem;
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
  align-self: flex-start;
}

.submit-btn:hover:not(:disabled) {
  opacity: 0.95;
  transform: translateY(-1px);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.contact-success {
  margin-bottom: 2rem;
}

.success-message {
  color: var(--color-success);
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.contact-fallback,
.contact-response-note {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin-bottom: 2rem;
}

.contact-methods {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.contact-method {
  padding: 1rem 0;
}

.contact-method h3 {
  margin-bottom: 0.5rem;
}

.contact-email {
  color: var(--color-primary, #3b82f6);
  text-decoration: none;
  font-weight: 500;
}

.contact-email:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .contact-container {
    padding-top: 1.5rem;
  }

  .submit-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
