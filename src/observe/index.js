/**
 * @file 把data中的数据都使用objec.defineProperty重新定义 es5方法
 * @param {Objec} data
 */

import {isObject} from '../utils/index';

class Observer {
    constructor(value) {
    // 如果数据的层次过多，需要递归的去解析对象中的属性，依次增加set和get方法
        this.walk(value);
    }

    walk(data) {
        let keys = Object.keys(data);
        keys.forEach(key => {
            defineReactive(data, key, data[key]);
        });
    }
}

function defineReactive(data, key, value) {
    observe(value); // 递归实现深度检测
    Object.defineProperty(data, key, {
        get() {
            return value;
        },
        set(newValue) {
            if (newValue === value) {
                return;
            }
            observe(newValue); // 继续劫持用户设置的值，因为有可能用户设置的值是一个对象
            console.log('值发生了变化')
            value = newValue;
        }
    });

}



 // object.defineProperty不能兼容ie8 及以下 vue2 无法兼容ie8版本
export function observe(data) {
    let isObj = isObject(data);
    if (!isObj) {
        return;
    };
    return new Observer(data); // 用来观测数据
}
