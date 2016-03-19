'use strict';

var assert = require('assert');
var DI = require('../src/DI');

describe('test dependency injection', function() {
    it('injecting literal object', function() {

        var app = new DI();

        app.register('duck', {
            fly: function() {
                return 'flying';
            }
        });

        var msg;

        app.run(['duck', function(d) {
            msg = d.fly();
        }]);

        assert.equal(msg, 'flying', 'failed injecting literal');
    });


    it('injecting class', function() {

        var app = new DI();

        var woman = function() {
            this.cry = function() {
                return 'crying';
            };
        };

        app.register('woman', woman);
        var msg;
        app.run(['woman', function(w) {
            msg = w.cry();
        }]);

        assert.equal(msg, 'crying', 'failed injecting class');
    });

    it('injecting with $inject attr', function() {

        var app = new DI();

        var man = function() {
            this.fight = function() {
                return 'fighting';
            };
        };

        app.register('man', man);
        app.register('cat', {
            action: function() {
                return 'scratch';
            }
        });
        var msg1,
            msg2;

        var exec = function(w, c) {
            msg1 = w.fight();
            msg2 = c.action();
        };
        exec.$inject = ['man', 'cat'];

        app.run(exec);

        assert.equal(msg1, 'fighting', 'failed injecting with $inject attr');
        assert.equal(msg2, 'scratch', 'failed injecting with $inject attr');
    });

    it('injecting with reflection', function() {

        var app = new DI();

        var woman = function() {
            this.cry = function() {
                return 'crying';
            };
        };

        app.register('woman', woman);
        app.register('duck', {
            fly: function() {
                return 'flying';
            }
        });
        var msg1,
            msg2;

        app.run(function(woman, duck) {
            msg1 = woman.cry();
            msg2 = duck.fly();
        });

        assert.equal(msg1, 'crying', 'failed injecting woman');
        assert.equal(msg2, 'flying', 'failed injecting duck');
    });


});
