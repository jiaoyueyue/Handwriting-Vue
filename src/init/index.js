/**
* @file 在Vue原型上添加一个_init方法
*/

import {initState} from './initState';

export function initMixin(Vue) {
    // 初始化流程
    Vue.prototype._init = function (options) {
        // 数据劫持
        const vm = this; // vue中使用this.$options指代的是用户传递的属性
        vm.$options = options;
        
        // 初始化状态
        initState(vm); // 分割代码
    };
}