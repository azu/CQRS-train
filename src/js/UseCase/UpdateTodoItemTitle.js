// LICENSE : MIT
"use strict";
import TodoBackendServer from "../domain/TodoList/TodoBackendServer"
import todoListRepository, {TodoListRepository} from "../infra/TodoRepository"
export class UpdateTodoItemTitleFactory {
    static publish({itemId, title}) {
        const todoBackendServer = new TodoBackendServer();
        const useCase = new UpdateTodoItemTitleUseCase({
            todoListRepository,
            todoBackendServer
        });
        return useCase.execute({itemId, title});
    }
}

export class UpdateTodoItemTitleUseCase {
    /**
     * @param {TodoListRepository} todoListRepository
     * @param {TodoBackendServer} todoBackendServer
     */
    constructor({todoListRepository, todoBackendServer}) {
        this.todoListRepository = todoListRepository;
        this.todoBackendServer = todoBackendServer;
    }

    execute({itemId, title}) {
        const todoList = this.todoListRepository.lastUsed();
        if (!todoList.hasItem(itemId)) {
            return Promise.reject(new Error("Not found item:" + itemId));
        }
        const todoItem = todoList.updateItem({id: itemId, title});
        // if saving is success, store to repository
        // other case, drop temporary change
        return this.todoBackendServer.update(todoItem).then(() => {
            this.todoListRepository.save(todoList);
        });
    }
}