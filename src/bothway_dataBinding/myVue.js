//工具类根据指令执行对应方法

const compileUtils = {
    /**
     * node 当前元素节点
     * expr 当前指令的value
     * vm 当前Mycu实利
     * eventName 当前指令事件名称
     */

     // 由于指令绑定的属性有可能是原始类型，也有可能是引用类型，因此要取到最终渲染的值
    getValue(expr, vm) {
         // 将其结果汇总为单个返回值
        return expr.split('.').reduce((data, currentVal) => {
            return data[currentVal];
        }, vm.$data);
     },

     // input双向数据绑定
    setValue(expr, vm, inputVal) {
        return expr.split('.').reduce((data, currentVal) => {
            // 将当前改变的值赋值
            data[currentVal] = inputVal;
            console.log('data:' + data);
        }, vm.$data);
    },

    // 处理{{person.name}} -- {{person.age}}这种格式的数据，不更新值的时候会全部替换
    getContentVal(expr, vm) {
        return expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
            // 获取{{}}中的属性
            return this.getValue(args[1], vm);
        });
    },

    // 封装指令
    text(node, expr, vm) {
        let value;
        // 处理{{}}格式
        if (expr.indexOf('{{') !== -1) {
            value = expr.reduce(/\{\{(.+?)\}\}/g, (...args) => {
                // 绑定观察者
                new Watcher(vm, args[1], newValue => {
                    // 处理{{person.name}} --{{person.age}}格式的数据
                    this.upDater.textUpDater(node, this.getContentVal(expr, vm));
                });
                return this.getValue(args[1], vm);
            })
        } else {
            new Watcher(vm, expr, newValue => {
                this.upDater.textUpDater(node, newValue);
            })
            // 获取当前节点要展示的值
            value = this.getValue(expr, vm);
        }
        // 更新的工具类
        this.upDater.textUpDater(node, value);
    }
};