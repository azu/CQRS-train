// LICENSE : MIT
"use strict";
import TodoBackendServer from "../domain/TodoList/TodoBackendServer"
import todoListRepository, {TodoListRepository} from "../infra/TodoRepository"
export class AddTodoItemFactory {
    static publish({title}) {
        const todoBackendServer = new TodoBackendServer();
        const useCase = new AddTodoItemUseCase({
            todoListRepository,
            todoBackendServer
        });
        return useCase.execute({title});
    }
}

export class AddTodoItemUseCase {
    /**
     * @param {TodoListRepository} todoListRepository
     * @param {TodoBackendServer} todoBackendServer
     */
    constructor({todoListRepository, todoBackendServer}) {
        this.todoListRepository = todoListRepository;
        this.todoBackendServer = todoBackendServer;
    }

    execute({title}) {
        const todoList = this.todoListRepository.lastUsed();
        const todoItem = todoList.addItem({title});
        // if saving is success, store to repository
        // other case, drop temporary change
        return this.todoBackendServer.add(todoItem).then(() => {
            this.todoListRepository.save(todoList);
        });
    }
}