// LICENSE : MIT
"use strict";
import TodoList from "./TodoList";
import TodoItem from "./TodoItem";
export default class TodoListFactory {
    static create(object) {
        const todoList = new TodoList();
        todoList.id = object.id;
        todoList._items = object._items.map(item => new TodoItem(item));
        return todoList;
    }
}