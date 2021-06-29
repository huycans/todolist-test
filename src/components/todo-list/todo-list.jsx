import React, { Component } from 'react';
// import { nanoid } from 'nanoid';
import ListItem from '../list-item/list-item.jsx';
import './todo-list.css'

export default class TodoList extends Component {

    handleKeyup = (event) => {
        const {target, keyCode} = event
        if(keyCode !== 13) return
        if(target.value.trim() === "") {
            alert("empty input");
            return
        }
        const todoObj = {"userId" : 1, "id": 201, "title": target.value, "completed": false}
        this.props.addTodos(todoObj)
        target.value = ""
    }
    
    render() {
        const {todos, deleteTodos} = this.props
        return (
            <div className='content'>
                <div className="todolist">
                    <header className="todolist__header">Todo List</header>
                    <input className="todolist__input" type="text" placeholder="input here" onKeyUp={this.handleKeyup}/>
                    <ul id="todolist-content">
                        {todos.map((todo) => (
                            <ListItem key={todo.id} todo={todo} deleteTodos={deleteTodos} />
                        ))}
                    </ul>
                    
                </div>
            </div>
        );
    }
}
