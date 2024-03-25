// Generated by CoffeeScript 2.2.3
(function() {
  var valueHook;

  valueHook = require('./value-hook');

  valueHook.add(function(str) {
    return str.replace(/([a-z\-]+) \(/gi, function(m, fn_name) {
      return `${fn_name}(`;
    });
  });
}.call(this));
