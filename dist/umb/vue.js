(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

    /**
     * @file 把data中的数据都使用objec.defineProperty重新定义 es5方法
     * @param {Objec} data
     */
    // object.defineProperty不能兼容ie8 及以下 vue2 无法兼容ie8版本
    function observe(data) {
      console.log(data);
    }

    /**
     *@file vue初始化状态
     * @param {Object} vm  实例化对象
     */
    function initState(vm) {
      var opts = vm.$options; // vue的数据来源 属性 方法 数据 计算属性 watch

      if (opts.props) ;

      if (opts.methods) ;

      if (opts.data) {
        initData(vm);
      }

      if (opts.computed) ;

      if (opts.watch) ;
    }

    function initData(vm) {
      // 数据初始化工作
      var data = vm.$options.data; // 用户传递的data
      // 用户传递可能是Object、function我们最终需要的是Object,并需要保证用户在data中操作时的this指向实例

      data = typeof data === 'function' ? data.call(vm) : data; // 为了用户也能够拿到数据增加一个属性_data

      vm._data = data; // 对象劫持 用户改变了数据，我希望可以得到通知，根据用户的修改进行一些操作，例如刷新页面
      // MVVM模式 数据变化可以驱动视图变化
      // Object.defineProperty () 给属性增加get方法和set方法

      observe(data); // 响应式原理
    }

    /**
    * @file 在Vue原型上添加一个_init方法
    */
    function initMixin(Vue) {
      // 初始化流程
      Vue.prototype._init = function (options) {
        // 数据劫持
        var vm = this; // vue中使用this.$options指代的是用户传递的属性

        vm.$options = options; // 初始化状态

        initState(vm); // 分割代码
      };
    }

    /**
     * @file Vue的核心代码，只是Vue的一个声明
    */
    /**
    * 
    * @param {Object} options // 实例对象
    */

    function Vue(options) {
      // 进行Vue的初始化操作
      this._init(options);
    } // 通过引入文件的方式，给Vue原型上添加方法


    initMixin(Vue);

    return Vue;

})));
//# sourceMappingURL=vue.js.map
