(function() {
  var Notifier;
  Notifier = (function() {
    function Notifier() {
      this._listeners = [];
      this._eventTriggered = {};
    }
    Notifier.prototype.addListener = function(callback, disposable) {
      var ret, self;
      callback["_disposable"] = callback["_disposable"] || (disposable || false);
      self = this;
      this._listeners.push(callback);
      ret = {
        listener: callback,
        notifier: self,
        cleared: false,
        clear: function() {
          var cleared;
          if (!this.cleared) {
            cleared = true;
          }
          return this.notifier.removeListener(this.listener);
        }
      };
      return ret;
    };
    Notifier.prototype.removeAllListeners = function() {
      return this._listeners = [];
    };
    Notifier.prototype.on = function(eventName, callback) {
      var listener;
      if (this.did(eventName)) {
        callback();
      } else {
        listener = {};
      }
      listener[eventName] = callback;
      return this.addListener(listener, true);
    };
    Notifier.prototype.did = function(eventName) {
      return this._eventTriggered[eventName] === true;
    };
    Notifier.prototype.removeListener = function(l) {
      var listener;
      return this._listeners = [
        (function() {
          var _i, _len, _ref, _results;
          _ref = this._listeners;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            listener = _ref[_i];
            if (listener !== l) {
              _results.push(listener);
            }
          }
          return _results;
        }).call(this)
      ];
    };
    Notifier.prototype.notifyAll = function(eventName, args) {
      var i, listener, _results;
      this._eventTriggered[eventName] = true;
      _results = [];
      for (i in this._listeners) {
        listener = this._listeners[i];
        try {
          if (typeof listener === "undefined") {
            continue;
          }
          if (typeof listener[eventName] === "function") {
            listener[eventName](args, this);
            if (listener.disposable) {
              this.removeListener(listener);
            }
          }
        } catch (_e) {}
      }
      return _results;
    };
    return Notifier;
  })();
  exports = (typeof exports === 'undefined'? window['notifier']={}: exports);
  exports.Notifier = Notifier;
}).call(this);
