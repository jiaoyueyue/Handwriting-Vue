import { SourceMap } from 'module';
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';

export default {
    input: './src/index.js', // 以那个文件作为打包的入口
    output: {
        file: 'dist/umb/vue.js', // 出口路径
        name: 'Vue', // 指定打包后全局变量的名字
        format: 'umd', // 统一模块规范
        sourcemap: true // es6->es5 开启源码调试，可以找到源码的报错位置

    },
    plugins: [
        babel({
            exclude: 'node_modules/**' // 忽略的文件
        }),
        process.env.ENV === 'development' ? serve({
            open: true,
            openPage: '/public/index.html', // 默认打开html的路径
            port: 3000,
            contentBase: '' // 静态文件的位置，当前启动的服务默认文件路径为空
        }) : null
    ]
};
