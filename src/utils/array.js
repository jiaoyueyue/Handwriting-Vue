/**
 * @file 重写array的push、shift、unshift、 pop、 reverse等会使原数组发生变化的方法
 */

let oldArrayMethods = Array.prototype;
export let arrayMethods =  Object.create(oldArrayMethods);

// 需要重写的方法
let methods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'sort',
    'splice',
    'reverse'
];

methods.forEach(method => {
    arrayMethods[method] = function (...args) {
        // console.log('调用了push');
        const result =  oldArrayMethods[method].apply(this, args); // 调用原生的数组方法
        let inserted; // 用户当前插入的元素,插入的元素可能是对象或数组，需要进行监控
        let ob = this.__ob__;
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2);
            default:
                break;
        }
        if (inserted) {
            ob.observeArray(inserted);
        }

        return result;
    };
});
