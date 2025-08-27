export default defineConfig({
  server: {
    proxy: {
      '/api': 'https://adbbo-backend.onrender.com'
    },
  },
  plugins: [react()],
});
