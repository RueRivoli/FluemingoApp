<script setup lang="ts">
import NavBar from '../components/NavBar.vue';
import Footer from '../components/Footer.vue';
</script>

<template>
  <div class="landing">
    <NavBar theme="light" />
    <div class="page-container">
      <h1>User Data Deletion</h1>
      <div class="page-content">
        <div class="content-item">
          <h3>1. Overview</h3>
          <p>
            FlueHero, the publisher of Fluemingo, is committed to respecting your right to delete your personal data.
            This page explains how you can request the deletion of your data and what happens when you do.
          </p>
        </div>
        <div class="content-item">
          <h3>2. How to Delete Your Data</h3>
          <p>You have two options to delete your personal data:</p>
          <div class="content-item-subsection">
            <h4>2.1 Delete Your Account from the App</h4>
            <p>
              You can delete your account at any time directly from within the Fluemingo app:
            </p>
            <ul>
              <li>Open Fluemingo and go to <strong>Settings</strong></li>
              <li>Select <strong>Account</strong> or <strong>Profile</strong></li>
              <li>Tap <strong>Delete Account</strong> and confirm your choice</li>
            </ul>
            <p>
              Once you confirm, your account and associated data will be scheduled for deletion.
            </p>
          </div>
          <div class="content-item-subsection">
            <h4>2.2 Request Deletion by Email</h4>
            <p>
              If you are unable to delete your account from the app (for example, if you no longer have access to it),
              you may request deletion by contacting us at:
              <a href="mailto:contact@fluemingo-app.com">contact@fluemingo-app.com</a>
            </p>
            <p>
              Please include the email address associated with your Fluemingo account so we can identify your data.
              We will respond to your request within 30 days.
            </p>
          </div>
        </div>
        <div class="content-item">
          <h3>3. What Data Is Deleted</h3>
          <p>When you delete your account, we permanently remove the following data:</p>
          <ul>
            <li>First name and last name</li>
            <li>Email address</li>
            <li>Listening progress (articles and audiobooks)</li>
            <li>Saved vocabulary and flashcards</li>
            <li>Learning history and preferences</li>
            <li>Any other data associated with your account</li>
          </ul>
        </div>
        <div class="content-item">
          <h3>4. Deletion Timeline</h3>
          <p>
            Your personal data will be erased within <strong>30 days</strong> of your deletion request.
            During this period, your account will be deactivated and you will not be able to access it.
            After 30 days, your data will be permanently removed from our systems.
          </p>
          <p>
            Please note: some data may be retained in backup systems for a limited time as part of our disaster recovery procedures. Such backups are overwritten according to our retention schedule and are not used for any other purpose.
          </p>
        </div>
        <div class="content-item">
          <h3>5. Third-Party Data</h3>
          <p>
            Fluemingo uses third-party services (e.g., app stores, hosting providers) that may process your data.
            Account deletion within Fluemingo removes data from our systems. For purchases or subscriptions made through the App Store or Google Play, you may need to manage those separately through the respective platform.
          </p>
        </div>
        <div class="content-item">
          <h3>6. Contact</h3>
          <p>
            For any questions regarding data deletion or to exercise your right to erasure under the GDPR, please contact us at:
            <a href="mailto:contact@fluemingo-app.com">contact@fluemingo-app.com</a>
          </p>
          <p>
            Publisher: FlueHero<br>
            Application: Fluemingo
          </p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<style scoped>
.page-container {
  padding: 2rem;
}

.page-content {
  padding: 1rem;
}

.content-item {
  padding: 1rem;
  margin-bottom: 1rem;
}

.content-item-subsection {
  padding: 1rem;
  margin-bottom: 1rem;
}

.content-item ul {
  padding-left: 1rem;
  list-style-type: disc;
}

.content-item a {
  color: var(--color-primary);
  text-decoration: underline;
}

.content-item a:hover {
  color: var(--color-primary-dark);
}
</style>
