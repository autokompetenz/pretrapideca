import { create } from 'zustand';

const savedTheme = localStorage.getItem('pr_theme') || 'light';
if (savedTheme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
else document.documentElement.removeAttribute('data-theme');

export const useThemeStore = create((set) => ({
  theme: savedTheme,
  toggle: () => {
    set((s) => {
      const newTheme = s.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('pr_theme', newTheme);
      if (newTheme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
      else document.documentElement.removeAttribute('data-theme');
      return { theme: newTheme };
    });
  },
}));

let toastId = 0;
export const useToastStore = create((set, get) => ({
  toasts: [],
  addToast: (message, type = 'success', duration = 3800) => {
    const id = ++toastId;
    set({ toasts: [...get().toasts, { id, message, type }] });
    setTimeout(() => set({ toasts: get().toasts.filter(t => t.id !== id) }), duration);
    return id;
  },
  removeToast: (id) => set({ toasts: get().toasts.filter(t => t.id !== id) }),
}));
