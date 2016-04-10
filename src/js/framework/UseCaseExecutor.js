// LICENSE : MIT
"use strict";
import UseCase from "./UseCase";
export default class UseCaseExecutor {
    /**
     * @param {UseCase} useCase
     * @param {Function} dispatch
     */
    constructor(useCase, dispatch) {
        // execute and finish =>
        const useCaseName = useCase.constructor.name;
        assert(typeof useCaseName !== "undefined" && typeof useCaseName === "string", "UseCase instance should have constructor.name " + useCase);
        assert(typeof useCase.execute === "function", `UseCase instance should have #execute function: ${useCaseName}`);
        this.useCaseName = useCaseName;
        this.useCase = useCase;
        this.useCase.dispatch = dispatch;
    }

    /**
     * execute UseCase instance.
     * UseCase is a executable object. it means that has `execute` method.
     * @param args
     */
    execute(...args) {
        this.useCase.willExecute();
        return Promise.resolve(this.useCase.execute(...args)).then(() => {
            this.useCase.didExecute();
        }).catch(error => {
            this.useCase.throwError(error);
            return Promise.reject(error);
        });
    }
}