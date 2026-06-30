<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<template>
  <footer class="mm-footer">
    <div class="container mm-footer-inner">
      <div class="mm-footer-col mm-footer-brand">
        <a href="/" class="mm-logo">
          <span class="mm-logo-icon" aria-hidden="true">
            <img src="../../assets/icons/Icon web.png" width="30" height="30" alt="PHONE SHOP" />
          </span>
          <span class="mm-logo-text">PHONE SHOP</span>
        </a>
        <p>Your one-stop shop for phones, accessories, and everyday essentials.</p>
        <div class="mm-socials">
          <a href="#" aria-label="Facebook">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-3h2.5V9.4c0-2.5 1.5-3.9 3.7-3.9 1 0 2.1.2 2.1.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.5V12h2.7l-.4 3h-2.3v7A10 10 0 0 0 22 12z"/></svg>
          </a>
          <a href="#" aria-label="Twitter">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 5.9c-.7.3-1.5.5-2.4.6.9-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.7 1A4.2 4.2 0 0 0 11.5 9c0 .3 0 .6.1.9-3.5-.2-6.6-1.9-8.7-4.4-.4.6-.6 1.4-.6 2.2 0 1.5.7 2.8 1.9 3.5-.7 0-1.3-.2-1.9-.5 0 2.1 1.5 3.8 3.5 4.2-.4.1-.8.2-1.2.2-.3 0-.6 0-.9-.1.6 1.7 2.2 3 4.1 3-1.5 1.2-3.4 1.9-5.5 1.9H2c2 1.2 4.2 2 6.6 2 8 0 12.3-6.6 12.3-12.3v-.6c.9-.6 1.6-1.4 2.1-2.2z"/></svg>
          </a>
          <a href="#" aria-label="Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
          </a>
        </div>
      </div>
      <div class="mm-footer-col">
        <h4>Shop</h4>
        <ul>
          <li><a href="#">Groceries</a></li>
          <li><a href="#">Electronics</a></li>
          <li><a href="#">Fashion</a></li>
          <li><a href="#">Home & Kitchen</a></li>
        </ul>
      </div>
      <div class="mm-footer-col">
        <h4>Support</h4>
        <ul>
          <li><a href="#">Help Center</a></li>
          <li><a href="#">Returns</a></li>
          <li><a href="#">Shipping</a></li>
          <li><a href="#">Contact Us</a></li>
        </ul>
      </div>
      <div class="mm-footer-col">
        <h4>Newsletter</h4>
        <p>Get the latest deals straight to your inbox.</p>
        <form class="mm-newsletter" @submit.prevent>
          <input type="email" placeholder="Your email" />
          <button type="submit">Subscribe</button>
        </form>
      </div>
    </div>
    <div class="mm-footer-bottom container">
      <span>© {{ year }} PHONE SHOP. All rights reserved.</span>
      <span class="mm-footer-links">
        <a href="#">Privacy</a> · <a href="#">Terms</a> · <a href="#">Cookies</a>
      </span>
    </div>
  </footer>
</template>

<style scoped>
.mm-footer {
  background: linear-gradient(135deg, #0084c6 0%, #2ba8d9 100%);
  color: #fff;
  padding: 48px 0 18px;
  margin-top: 40px;
}

.mm-footer-inner {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 2fr;
  gap: 36px;
}

.mm-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.mm-logo-icon {
  display: inline-flex;
}

.mm-logo-text {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
}

.mm-footer h4 {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 14px;
  color: #fff;
}

.mm-footer p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
  margin: 0 0 12px;
  max-width: 280px;
}

.mm-footer ul li {
  margin-bottom: 8px;
}

.mm-footer ul a {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
}

.mm-footer ul a:hover {
  color: #fff;
}

.mm-socials {
  display: flex;
  gap: 10px;
}

.mm-socials a {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.75);
  transition: background 0.2s, color 0.2s;
}

.mm-socials a:hover {
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
}

.mm-newsletter {
  display: flex;
  gap: 6px;
  max-width: 320px;
}

.mm-newsletter input {
  flex: 1;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 9px 12px;
  font-size: 13px;
  color: #fff;
}

.mm-newsletter input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.mm-newsletter input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.15);
}

.mm-newsletter button {
  background: #fff;
  color: #0084c6;
  border-radius: 8px;
  padding: 9px 16px;
  font-size: 13px;
  font-weight: 600;
}

.mm-newsletter button:hover {
  background: rgba(255, 255, 255, 0.9);
}

.mm-footer-bottom {
  margin-top: 36px;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.mm-footer-bottom a {
  color: rgba(255, 255, 255, 0.7);
}

.mm-footer-bottom a:hover {
  color: #fff;
}

@media (max-width: 768px) {
  .mm-footer-inner {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
