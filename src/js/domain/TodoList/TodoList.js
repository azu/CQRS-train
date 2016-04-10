// LICENSE : MIT
"use strict";
const uuid = require('uuid');
import DomainModel from "../../framework/domain/DomainModel";
import TodoItem from "./TodoItem";
export default class TodoList extends DomainModel {
    constructor() {
        super();
        this.id = uuid.v1();
        this._items = [];
    }

    /**
     * @returns {TodoItem[]}
     */
    getAllTodoItems() {
        return this._items;
    }

    /**
     * @param id
     * @returns {boolean}
     */
    hasItem(id) {
        return this._items.some(item => {
            return item.id === id;
        });
    }

    /**
     * @param id
     * @returns {TodoItem|undefined}
     */
    getItem(id) {
        const items = this._items.filter(item => {
            return item.id === id;
        });
        if (items.length > 0) {
            return items[0];
        }
    }

    updateItem({id, title}) {
        const item = this.getItem(id);
        const newItem = item.updateTitle(title);
        this._items[this._items.indexOf(item)] = newItem;
        this.emitChange();
        return newItem;
    }

    /**
     * @param {{title:string}} title
     * @return {TodoItem}
     */
    addItem({title}) {
        const todoItem = new TodoItem({title});
        this._items.push(todoItem);
        this.emitChange();
        return todoItem;
    }

    removeItem(id) {
        const item = this.getItem(id);
        const index = this._items.indexOf(item);
        this._items.splice(index, 1);
        this.emitChange();
    }
}