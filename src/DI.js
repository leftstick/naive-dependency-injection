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
        args;
    if (Array.isArray(arr)) {
        cb = arr[arr.length - 1];
        argsName = arr.slice(0, arr.length - 1);
    } else if (arr.$inject) {
        cb = arr;
        argsName = arr.$inject;
    } else {
        cb = arr;
        var cbStr = arr.toString();
        argsName = cbStr.match(/\(\s*([^\)]*)\)/)[1].split(',').map(name => name.trim());
    }
    args = argsName.map(name => this.store[name]);
    cb.apply(null, args);
};

module.exports = DI;
