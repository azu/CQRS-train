// LICENSE : MIT
"use strict";
import {EventEmitter} from "events";
const STATE_CHANGE_EVENT = "STATE_CHANGE_EVENT";
export default class StateStore extends EventEmitter {
    /**
     * subscribe change event.
     * if emit change event, then call registered event handler function
     * @param {Function} cb
     * @returns {Function} return unbind function
     */
    onChange(cb) {
        this.on(STATE_CHANGE_EVENT, cb);
        return this.removeListener.bind(this, STATE_CHANGE_EVENT, cb);
    }

    /**
     * emit change event to subscribers
     */
    emitChange() {
        this.emit(STATE_CHANGE_EVENT);
    }
};