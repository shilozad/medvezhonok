export default function react(options = {}) {
  const jsxRuntime = options.jsxRuntime || 'automatic';

  return {
    name: 'local-vite-react-jsx-runtime',
    config() {
      return {
        esbuild: {
          jsx: jsxRuntime,
          jsxImportSource: options.jsxImportSource || 'react',
        },
      };
    },
  };
}
