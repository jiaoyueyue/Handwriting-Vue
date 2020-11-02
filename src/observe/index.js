/**
 * @file 把data中的数据都使用objec.defineProperty重新定义 es5方法
 * @param {Objec} data
 */

import {isObject, def} from '../utils/index';
import {arrayMethods} from '../utils/array.js';

class Observer {
    constructor(value) {
        def(value, '__ob__', this); // 给每一个监控过的对象增加不可枚举属性‘__ob__’，方便为监控的对象增加方法，以及判断对象是否被监控

        // 如果数据的层次过多，需要递归的去解析对象中的属性，依次增加set和get方法
        if (Array.isArray(value)) {
            // 如果是数组，不对索引进行监控，因为会导致性能问题
            // 前端开发中很少会操作数组的索引，而是去操作push、shift、unshift
            value.__proto__ = arrayMethods;

            // 如果数组中的item是对象再进行监控
            this.observeArray(value);

        } else {
            // 对对象进行监控
            this.walk(value);
        }
    }

    observeArray(value) {
        for (let i = 0; i < value.length; i++) {
            observe(value[i]);
        }

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
            // console.log('值发生了变化')
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
