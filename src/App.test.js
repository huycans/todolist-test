import { shallow, mount, render } from 'enzyme';
import React from 'react';
import App from './App';
import { getAllTodos, addTodo, deleteTodo } from './todoAPIs.jsx';
import renderer from 'react-test-renderer';

jest.mock('./todoAPIs.jsx', () => {
  const fakeTodos = [
    { "userId": 1, "id": 1, "title": "first todo", "completed": false },
    { "userId": 2, "id": 2, "title": "second todo", "completed": false },
  ];
  return {
    getAllTodos: () => {
      return new Promise((res) => res(fakeTodos));
    },
    addTodo: () => {
      return new Promise(res => res({ "userId": 1, "id": 201, "title": "new todo", "completed": false }));
    },
    deleteTodo: () => {
      return new Promise(res => res());
    }
  };
});

window.alert = jest.fn();

describe("App component", () => {
  // beforeEach(() => {
  // // setup before each test
  // });

  afterEach(() => {
    jest.clearAllMocks();
  });

  //snapshot testing
  it('renders correctly', () => {
    const tree = renderer
      .create(<App />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render the header text', () => {
    const app = mount(<App />);
    expect(app.find(".header").text()).toEqual("Todo List App");
  });

  it("should render two ToDo items", async () => {
    //another way. this test the UI instead of checking state directly
    const app = mount(<App />);
    //nothing is rendered yet
    expect(app.find(".list-item").length).toBe(0);


    // https://www.benmvp.com/blog/asynchronous-testing-with-enzyme-react-jest/
    //https://stackoverflow.com/questions/54465734/testing-asynchronous-componentdidmount-that-changes-state-with-jest-and-enzyme
    // setImmediate, which runs its callback at the end of the event loop, allowing promises to resolve non-invasively AKA when setImmediate finished, all of the promises from fetching data (and fake getAllTodos)
    //will be resolved
    await new Promise(setImmediate);
    //this equals:
    // new Promise((resolve) => {
    //     setImmediate(() => {
    //       resolve();
    //     });
    //   });
    // }

    app.update();

    expect(app.find(".list-item").length).toBe(2);
  });

  it("should render an input field for typing up new ToDo items", () => {
    const app = mount(<App />);
    expect(app.find(".todolist__input").length).toEqual(1);
  });

  it("should prevent a new ToDo item from being created if the Enter key is pressed but the input field is empty, ", async () => {
    const app = mount(<App />);
    await new Promise(setImmediate);
    app.update();

    //input field is currently empty, and there're 2 todo items
    expect(app.find(".list-item").length).toBe(2);
    app.find(".todolist__input").simulate('click').simulate('keyup', { keyCode: 13 });
    //the number of list items remains the same
    expect(app.find(".list-item").length).toBe(2);
    expect(app.find(".list-item").length).not.toBe(3);

  });

  it("should show an alert to the user if the Enter key is pressed but the input field is empty", () => {
    const app = mount(<App />);
    jest.spyOn(window, 'alert').mockImplementation(() => { });

    app.find(".todolist__input").simulate('click').simulate('keyup', { keyCode: 13 });
    expect(window.alert).toHaveBeenCalled();
    expect(window.alert).toBeCalledWith("empty input");
  });

  it("should add a new ToDo item if the Enter key is pressed and the input field has content", async () => {
    const app = mount(<App />);
    await new Promise(setImmediate);
    app.update();

    expect(app.find(".list-item").length).toBe(2);
    app.find(".todolist__input")
      .simulate('keyup', { keyCode: 13, target: { value: "new todo" } });

    await new Promise(setImmediate);
    app.update();

    expect(app.find(".list-item").length).toBe(3);
    expect(app.find(".list-item").at(0).text()).toContain("new todo");
  });

  it("should remove a ToDo item from the list when the ‘Delete’ button is pressed for on that ToDo item, ", async () => {
    const app = mount(<App />);
    await new Promise(setImmediate);
    app.update();

    expect(app.find(".list-item").length).toBe(2);

    app.find(".btn-remove").first().simulate('click');//first todo is removed
    await new Promise(setImmediate);
    app.update();

    expect(app.find(".list-item").length).toBe(1);
    expect(app.find(".list-item").at(0).text()).toContain("second todo");

  });
});