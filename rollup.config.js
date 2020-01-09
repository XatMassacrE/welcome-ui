import babel from 'rollup-plugin-babel'
import typescript from '@rollup/plugin-typescript'
import resolve from 'rollup-plugin-node-resolve'
import postcss from 'rollup-plugin-postcss'
import { sizeSnapshot } from 'rollup-plugin-size-snapshot'

const PACKAGE_ROOT_PATH = process.cwd()
const pkg = require(`${PACKAGE_ROOT_PATH}/package.json`)

const input = 'index.tsx'
const external = id => !id.startsWith('.') && !id.startsWith('/')

const getBabelOptions = ({ useESModules }) => ({
  exclude: '**/node_modules/**',
  runtimeHelpers: true,
  configFile: `${process.env.PROJECT_ROOT}/babel.config.js` || '../../babel.config.js',
  plugins: [
    'babel-plugin-annotate-pure-calls',
    ['@babel/plugin-transform-runtime', { useESModules }]
  ]
})

const cjsConfig = {
  input,
  output: { file: pkg.main, format: 'cjs' },
  external,
  plugins: [
    typescript(),
    babel(getBabelOptions({ useESModules: false })),
    resolve(),
    postcss(),
    sizeSnapshot()
  ]
}

const esmConfig = {
  input,
  output: { file: pkg.module, format: 'esm' },
  external,
  plugins: [
    typescript(),
    babel(getBabelOptions({ useESModules: true })),
    resolve(),
    postcss(),
    sizeSnapshot()
  ]
}

export default [cjsConfig, esmConfig]
