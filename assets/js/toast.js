/**
 * Tá Na Mão! - Toast Notification System (Mailfy Style)
 */
class ToastManager {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    if (!document.querySelector('.toast-container')) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    } else {
      this.container = document.querySelector('.toast-container');
    }
  }

  show(message, type = 'info', duration = 4000) {
    if (!this.container) this.init();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'danger') icon = '⚠️';
    if (type === 'info') icon = '💡';

    toast.innerHTML = `
      <span style="font-size: 1.1rem; line-height: 1;">${icon}</span>
      <span style="flex: 1;">${message}</span>
    `;

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  success(msg, duration) {
    this.show(msg, 'success', duration);
  }

  error(msg, duration) {
    this.show(msg, 'danger', duration);
  }

  info(msg, duration) {
    this.show(msg, 'info', duration);
  }
}

window.Toast = new ToastManager();
