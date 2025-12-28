import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'context/index': 'src/context/index.ts',
    'di/index': 'src/di/index.ts',
    'pipeline/index': 'src/pipeline/index.ts',
    'cqrs/index': 'src/cqrs/index.ts',
    'uow/index': 'src/uow/index.ts',
    'events/index': 'src/events/index.ts',
    'specification/index': 'src/specification/index.ts',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  target: 'node20',
  outDir: 'dist',
  external: ['@krepis/shared'],
});
