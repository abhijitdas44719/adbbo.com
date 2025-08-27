export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    },
  },
  plugins: [react()],
});