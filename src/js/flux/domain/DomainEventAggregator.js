// LICENSE : MIT
"use strict";
import DomainEventEmitter from "./DomainEventEmitter";


let _eventEmitter = new DomainEventEmitter();
/**
 * If you stub for testing, do that
 *
 * model.eventEmitter = stubEventEmitter;
 *
 */
export class DomainEventAggregator {
    constructor() {
        if (_eventEmitter) {
            _eventEmitter.removeAllListeners();
        }
    }

    /**
     * @returns {DomainEventEmitter}
     */
    get eventEmitter() {
        return _eventEmitter;
    }

    /**
     * @param {DomainEventEmitter }domainEventEmitter
     */
    set eventEmitter(domainEventEmitter) {
        _eventEmitter.removeAllListeners();
        _eventEmitter = domainEventEmitter;
    }

    /**
     * @param {string} EntityName
     * @param {Function} handler
     */
    subscribe(EntityName, handler) {
        this.eventEmitter.subscribe(({type, value}) => {
            if (type === EntityName) {
                handler(value);
            }
        });
    }

    /**
     * @param EntityName
     * @param value
     */
    publish(EntityName, value) {
        this.eventEmitter.publish({
            type: EntityName,
            value
        });
    }
}
export default new DomainEventAggregator();