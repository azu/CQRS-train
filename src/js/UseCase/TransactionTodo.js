// LICENSE : MIT
"use strict";
import TodoBackendServer from "../domain/TodoList/TodoBackendServer"
import todoListRepository, {TodoListRepository} from "../infra/TodoRepository"
import {AddTodoItemUseCase} from "./AddTodoItem";
import {UpdateTodoItemTitleUseCase} from "./UpdateTodoItemTitle";
import {RemoveTodoItemUseCase} from "./RemoveTodoItem";
export class TransactionTodoFactory {
    static publish({title}) {
        const todoBackendServer = new TodoBackendServer();
        const useCase = new UpdateTodoItemTitleUseCase({
            todoListRepository,
            todoBackendServer
        });
        return useCase.execute({title});
    }
}

export class TransactionTodoUseCase {
    /**
     * @param {TodoListRepository} todoListRepository
     * @param {TodoBackendServer} todoBackendServer
     */
    constructor({todoListRepository, todoBackendServer}) {
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