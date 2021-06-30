import React, { Component } from 'react';

import './list-item.css'

export default class ListItem extends Component {
    render() {
        const {todo, deleteTodos} = this.props;
        return (
            <li className="list-item">
                <span className="list-item_title">{todo.title}</span>
                <button className="btn-remove" onClick={()=>deleteTodos(todo.id)}>X</button>
            </li>
        )
    }
}

