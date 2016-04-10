// LICENSE : MIT
"use strict";
import TodoBackendServer from "../domain/TodoList/TodoBackendServer"
import todoListRepository, {TodoListRepository} from "../infra/TodoRepository"
export class RemoveTodoItemFactory {
    static publish({itemId}) {
        const todoBackendServer = new TodoBackendServer();
        const useCase = new RemoveTodoItemUseCase({
            todoListRepository,
            todoBackendServer
        });
        return useCase.execute({itemId});
    }
}

export class RemoveTodoItemUseCase {
    /**
     * @param {TodoListRepository} todoListRepository
     * @param {TodoBackendServer} todoBackendServer
     */
    constructor({todoListRepository, todoBackendServer}) {
        this.todoListRepository = todoListRepository;
        this.todoBackendServer = todoBackendServer;
    }

    execute({itemId}) {
        const todoList = this.todoListRepository.lastUsed();
        if (!todoList.hasItem(itemId)) {
            return Promise.reject(new Error("Not found item:" + itemId));
        }
        const todoItem = todoList.getItem(it);
        todoList.removeItem(itemId);
        // if saving is success, store to repository
        // other case, drop temporary change
        return this.todoBackendServer.remove(todoItem).then(() => {
            this.todoListRepository.save(todoList);
        });
    }
}