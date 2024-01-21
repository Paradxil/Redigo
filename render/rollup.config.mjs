import typescript from '@rollup/plugin-typescript';

export default {
    input: './examples/box/animation.ts',
    output: {
        dir: 'output',
        format: 'es'
    },
    plugins: [typescript()]
};