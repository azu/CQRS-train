// LICENSE : MIT
"use strict";
import UseCase from "../framework/UseCase";
import TodoBackendServer from "../domain/TodoList/TodoBackendServer"
import todoListRepository, {TodoListRepository} from "../infra/TodoRepository"
import {AddTodoItemUseCase} from "./AddTodoItem";
import {UpdateTodoItemTitleUseCase} from "./UpdateTodoItemTitle";
import {RemoveTodoItemUseCase} from "./RemoveTodoItem";
export class TransactionTodoFactory {
    static create() {
        const todoBackendServer = new TodoBackendServer();
        return new UpdateTodoItemTitleUseCase({
            todoListRepository,
            todoBackendServer
        });
    }
}

export class TransactionTodoUseCase extends UseCase {
    /**
     * @param {TodoListRepository} todoListRepository
     * @param {TodoBackendServer} todoBackendServer
     */
    constructor({todoListRepository, todoBackendServer}) {
        super();
        this.todoListRepository = todoListRepository;
        this.todoBackendServer = todoBackendServer;
    }

    execute({title}) {
        const options = {
            todoListRepository: this.todoListRepository,
            todoBackendServer: this.todoBackendServer
        };
        const addTodo = new AddTodoItemUseCase(options);
        const updateTodoItem = new UpdateTodoItemTitleUseCase(options);
        const removeTodoItem = new RemoveTodoItemUseCase(options);
        const getLastItem = () => {
            const todoList = this.todoListRepository.lastUsed();
            return todoList.getAllTodoItems()[0];
        };
        // Add => Update => Remove
        return Promise.resolve().then(() => {
            return addTodo.execute({title});
        }).then(() => {
            const todoItem = getLastItem();
            return updateTodoItem.execute({itemId: todoItem.id, title: "UPDATING TITLE"});
        }).then(() => {
            const todoItem = getLastItem();
            return removeTodoItem.execute({itemId: todoItem.id});
        });
    }
}