/**
 * @file Vue的核心代码，只是Vue的一个声明
*/

import{initMixin} from './init/index';

/**
* 
* @param {Object} options // 实例对象
*/
function Vue(options) {

    // 进行Vue的初始化操作
    this._init(options);
}

// 通过引入文件的方式，给Vue原型上添加方法
initMixin(Vue);

export default Vue;
