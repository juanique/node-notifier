class Notifier
    constructor: ->
        @_listeners = []
        @_eventTriggered = {}

    addListener: (callback, disposable) ->
        callback["_disposable"] = callback["_disposable"] or (disposable or false)
        self = this
        @_listeners.push callback
        ret =
            listener: callback
            notifier: self
            cleared: false
            clear: ->
                unless @cleared
                    cleared = true
                @notifier.removeListener @listener

        return ret

    removeAllListeners: ->
        @_listeners = []

    on: (eventName, callback) ->
        if @did(eventName)
            callback()
        else
            listener = {}
        listener[eventName] = callback
        @addListener listener, true

    did: (eventName) ->
        @_eventTriggered[eventName] == true

    removeListener: (l) ->
        @_listeners = [ listener for listener in @_listeners when listener != l ]

    notifyAll: (eventName, args) ->
        @_eventTriggered[eventName] = true
        for i of @_listeners
            listener = @_listeners[i]
            try
                if typeof listener == "undefined"
                    continue
                if typeof (listener[eventName]) == "function"
                    listener[eventName] args, this
                    @removeListener listener if listener.disposable

`exports = (typeof exports === 'undefined'? window['notifier']={}: exports)`
exports.Notifier = Notifier
