/**
 *@file vue初始化状态
 * @param {Object} vm  实例化对象
 */

import {observe} from '../observe/index';

export function initState(vm) {
    const opts = vm.$options;
    // vue的数据来源 属性 方法 数据 计算属性 watch
    if (opts.props) {
        initProps(vm);
    }

    if (opts.methods) {
        initMethods(vm);
    }

    if (opts.data) {
        initData(vm);
    }

    if (opts.computed) {
        initComputed(vm);
    }

    if (opts.watch) {
        initWatch(vm);
    }
}

function initProps() {}

function initMethods() {}

function initData(vm) {
    // 数据初始化工作
    let data = vm.$options.data; // 用户传递的data
    // 用户传递可能是Object、function我们最终需要的是Object,并需要保证用户在data中操作时的this指向实例
    data = typeof data === 'function' ? data.call(vm) : data;

    // 为了用户也能够拿到数据增加一个属性_data
    vm._data = data;

    // 对象劫持 用户改变了数据，我希望可以得到通知，根据用户的修改进行一些操作，例如刷新页面
    // MVVM模式 数据变化可以驱动视图变化

    // Object.defineProperty () 给属性增加get方法和set方法
    observe(data);  // 响应式原理

}

function initComputed() {}

function initWatch() {}