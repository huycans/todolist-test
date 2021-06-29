import React, { Component } from 'react';
import {getAllTodos, addTodo, deleteTodo} from './todoAPIs.jsx';
import Header from './components/header/header.jsx';
import TodoList from './components/todo-list/todo-list.jsx';

export default class App extends Component {

  state = {
    todos: []
  }

  componentDidMount () {
    getAllTodos()
      .then(data => this.setState({todos:data}))
  }

  addTodos = (todoObj) => {
    const {todos} = this.state
    addTodo(todoObj).then(data => this.setState({todos: [data, ...todos]}))
  }

  deleteTodos = (id) => {
    const {todos} = this.state
    const newTodos = todos.filter(todo => todo.id !== id)
    this.setState({todos:newTodos})
    deleteTodo(id)
  }

  render() {
    const {todos} = this.state
    return (
      <>
        <Header />
        <TodoList todos={todos} addTodos={this.addTodos} deleteTodos={this.deleteTodos}/>
      </>
    );
  }
}
