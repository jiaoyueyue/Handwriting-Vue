(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  /**
   * @file 工具函数
   */

  /**
   * 
   * @param {*} data 当前数据是否是对象
   */
  function isObject(data) {
    return _typeof(data) === 'object' && data !== null;
  }
  function def(data, key, value) {
    Object.defineProperty(data, key, {
      enumerable: false,
      configurable: false,
      value: value
    });
  }

  /**
   * @file 重写array的push、shift、unshift、 pop、 reverse等会使原数组发生变化的方法
   */
  var oldArrayMethods = Array.prototype;
  var arrayMethods = Object.create(oldArrayMethods); // 需要重写的方法

  var methods = ['push', 'pop', 'shift', 'unshift', 'sort', 'splice', 'reverse'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // console.log('调用了push');
      var result = oldArrayMethods[method].apply(this, args); // 调用原生的数组方法

      var inserted; // 用户当前插入的元素,插入的元素可能是对象或数组，需要进行监控

      var ob = this.__ob__;

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          inserted = args.slice(2);
      }

      if (inserted) {
        ob.observeArray(inserted);
      }

      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      def(value, '__ob__', this); // 给每一个监控过的对象增加不可枚举属性‘__ob__’，方便为监控的对象增加方法，以及判断对象是否被监控
      // 如果数据的层次过多，需要递归的去解析对象中的属性，依次增加set和get方法

      if (Array.isArray(value)) {
        // 如果是数组，不对索引进行监控，因为会导致性能问题
        // 前端开发中很少会操作数组的索引，而是去操作push、shift、unshift
        value.__proto__ = arrayMethods; // 如果数组中的item是对象再进行监控

        this.observeArray(value);
      } else {
        // 对对象进行监控
        this.walk(value);
      }
    }

    _createClass(Observer, [{
      key: "observeArray",
      value: function observeArray(value) {
        for (var i = 0; i < value.length; i++) {
          observe(value[i]);
        }
      }
    }, {
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data);
        keys.forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }]);

    return Observer;
  }();

  function defineReactive(data, key, value) {
    observe(value); // 递归实现深度检测

    Object.defineProperty(data, key, {
      get: function get() {
        return value;
      },
      set: function set(newValue) {
        if (newValue === value) {
          return;
        }

        observe(newValue); // 继续劫持用户设置的值，因为有可能用户设置的值是一个对象
        // console.log('值发生了变化')

        value = newValue;
      }
    });
  } // object.defineProperty不能兼容ie8 及以下 vue2 无法兼容ie8版本


  function observe(data) {
    var isObj = isObject(data);

    if (!isObj) {
      return;
    }
    return new Observer(data); // 用来观测数据
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
