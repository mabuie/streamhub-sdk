define(['streamhub-sdk/jquery', 'streamhub-sdk/event-emitter'], function($, EventEmitter) {
    
    /**
     * Defines a base stream object that can be "started", which reads from its source and
     * will emit events when there is more content available, then one final "end" event when the
     * read completes.
     * @param opts {Object} A set of options to config the stream with
     * @exports streamhub-sdk/stream
     * @constructor
     */
    var Stream = function(opts) {
        EventEmitter.call(this);
        this.opts = opts || {};
        this.buffer = [];
    };
    $.extend(Stream.prototype, EventEmitter.prototype);
    
    /**
     * Triggers the stream to start reading from its abstract source.
     */
    Stream.prototype.start = function() {
        if (!this._isReading) {
            this._isReading = true;
            this._read();
        }
    };

    /**
     * Triggers the stream to stop reading from its abstract source.
     */
    Stream.prototype.stop = function() {
        if (this._isReading) {
            this._stop();
            this._isReading = false;
            this.emit('stopped');
        }
    };

    /**
     * Overridable read method for stream implementations. In this base class, the default
     * implementation will emit a "not implemented" error.
     * @private
     */
    Stream.prototype._read = function() {
        this.emit('error', new Error('not implemented'));
        this._endRead();
    };

    /**
     * Removes and returns the oldest object in the stream buffer. 
     */
    Stream.prototype.read = function() {
        return this.buffer.shift();
    };
    
    /**
     * Overridable write method for stream implementations. In this base class, the default
     * implementation will emit a "not implemented" error.
     * @param content {string} The content body
     * @param opts {Object} Options for the implemented subclass's _write
     * @param callback {Function} The callback to invoke once write completes
     * @private
     */
    Stream.prototype._write = function(content, opts, callback) {
        this.emit('error', new Error('not implemented'));
    };
    
    /**
     * Writes the supplied options to the stream by passing them to the implementing stream's
     * _write method;
     * @param content {string} The content body
     * @param opts {Object} Options to pass to the implemented subclass's _write
     * @param callback {Function} The callback to invoke once write completes
     */
    Stream.prototype.write = function(content, opts, callback) {
        this._write.apply(this, arguments);
    };

    /**
     * Pushes a new object onto this stream's buffer, then emits "readable".
     * This method should only be called by the implementing stream subclass.
     * @param obj {Object} The object to push onto the stream buffer.
     * @private 
     */
    Stream.prototype._push = function(obj) {
        this.buffer.push(obj);
        this.emit('readable');
        return true;
    };
    
    /**
     * Overridable stop method for stream implementations. In this base class, the default
     * implementation does nothing.
     * @private
     */
    Stream.prototype._stop = function() {
        return;
    };
    
    /**
     * Triggers an "end" event, signalling that the current read cycle has been completed.
     * This method should only be called by the implementing stream subclass.
     * @private 
     */
    Stream.prototype._endRead = function() {
        this._isReading = false;
        this.emit('end');
    };
    
    return Stream;
});
