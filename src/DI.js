'use strict';

var DI = function() {
    this.store = {};
};

DI.prototype.register = function(name, inst) {
    this.store[name] = typeof inst === 'function' ? new inst : inst;
};

DI.prototype.run = function(arr) {
    var cb,
        argsName,
        args,
        lastIndex = arr.length - 1;
    if (Array.isArray(arr)) {
        cb = arr[lastIndex];
        argsName = arr.slice(0, lastIndex);
    } else if (arr.$inject) {
        cb = arr;
        argsName = arr.$inject;
    } else {
        cb = arr;
        argsName = arr
            .toString()
            .match(/\(\s*([a-zA-Z,\s]*)\)/)[1]
            .split(',')
            .map(name => name.trim());
    }
    args = argsName.map(name => this.store[name]);
    cb.apply(null, args);
};

module.exports = DI;
