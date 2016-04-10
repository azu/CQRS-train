// LICENSE : MIT
"use strict";
const assert = require("power-assert");
import {MemoryDB} from "../../src/js/infra/adpter/MemoryDB";
import TodoBackendServer from "../../src/js/domain/TodoList/TodoBackendServer";
import TodoList from "../../src/js/domain/TodoList/TodoList";
import {TodoListRepository} from "../../src/js/infra/TodoRepository";
import {TransactionTodoUseCase} from "../../src/js/UseCase/TransactionTodo";
import {DomainEventAggregator} from "../../src/js/flux/domain/DomainEventAggregator";
describe("TransactionTodoUseCase", function () {
    it("success transaction", function () {
        const eventAggregator = new DomainEventAggregator();
        const mockTodoList = new TodoList();
        mockTodoList.eventAggregator = eventAggregator;
        // prepare
        const todoListRepository = new TodoListRepository(new MemoryDB());
        todoListRepository.save(mockTodoList);
        const todoBackendServer = new TodoBackendServer({backendPoint: null});
        todoBackendServer.add = () => Promise.resolve();
        todoBackendServer.update = () => Promise.resolve();
        todoBackendServer.remove = () => Promise.resolve();
        // initialize
        const useCase = new TransactionTodoUseCase({
            todoListRepository,
            todoBackendServer
        });

        // test
        let callCount = 0;
        eventAggregator.subscribe(TodoList.name, () => {
            callCount++;
        });
        return useCase.execute({title: "first"}).then(() => {
            // re-get todoList
            const storedTodoList = todoListRepository.find(mockTodoList);
            assert.equal(storedTodoList.getAllTodoItems().length, 0);

            assert.equal(callCount, 3);
        });
    });
});