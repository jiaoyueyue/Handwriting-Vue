/**
 * @file 把data中的数据都使用objec.defineProperty重新定义 es5方法
 * @param {Objec} data
 */

 // object.defineProperty不能兼容ie8 及以下 vue2 无法兼容ie8版本
export function observe(data) {
    console.log(data);
}
