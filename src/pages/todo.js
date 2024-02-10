import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  addTask,
  deleteTask,
  setTodos,
  updateTask,
  setTodosOrder,
} from "../actions/index";
import "../styles/todo.css";

const TodoPage = () => {
  const [newTodo, setNewTodo] = useState("");
  const todos = useSelector((state) => state.task.tasks);
  // const username = useSelector((state) => state.user.currentUser.username);
  const username = useSelector((state) => state.user.currentUser?.username);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!username) {
      // Redirect to login page if there is no user
      window.location.href = "/login";
    } else {
      fetchTodos(username);
    }
  }, [username]);


//fetch todos of logged in user
  const fetchTodos = async (username) => {
    try {
      const response = await fetch(
        `http://localhost:8000/todo/todos/${username}`
      );
      if (response.ok) {
        const data = await response.json();
        dispatch(setTodos(data));
      } else {
        console.error("Error fetching todos:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  //add new todo
  const addTodo = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/todo/add/${username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: newTodo }), 
        }
      );
      if (response.ok) {
        const data = await response.json();
        dispatch(addTask(data)); // dispatch action
        setNewTodo("");
      } else {
        console.error("Error adding todo:", response.statusText);
      }
    } catch (error) {
      console.error("Error in adding todo:", error);
    }
  };

  // delete todo
  const deleteTodo = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8000/todo/delete/${id}?username=${username}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        dispatch(deleteTask(id)); // dispatch action
      } else {
        console.error("Error deleting todo:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  //mark complete
  const toggleTodoCompletion = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8000/todo/complete/${id}?username=${username}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, username }), 
        }
      );
      if (response.ok) {
        dispatch(updateTask(id)); // dispatch action
      } else {
        console.error("Error toggling todo completion:", response.statusText);
      }
    } catch (error) {
      console.error("Error toggling todo completion:", error);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const updatedTodos = [...todos];
    const [reorderedTodo] = updatedTodos.splice(result.source.index, 1);
    updatedTodos.splice(result.destination.index, 0, reorderedTodo);

    try {
      await fetch(`http://localhost:8000/todo/updateOrder/${username}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ todos: updatedTodos }),
      });
      dispatch(setTodosOrder(updatedTodos));// dispatch action
    } catch (error) {
      console.error("Error updating todo order:", error);
    }
  };

  return (
    <div className="todo-list-container">
      <h2>Todo List</h2>
      <div className="add-todo">
        <input
          type="text"
          className="input-todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter new todo"
        />
        <button className="input-todo-btn" onClick={addTodo}>
          Add Todo
        </button>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              { todos &&
              todos.map((todo, index) => (
                <Draggable key={todo._id} draggableId={todo._id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      className={`todo-item ${
                        todo.completed ? "completed" : ""
                      } ${snapshot.isDragging ? "dragging" : ""}`}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodoCompletion(todo._id)}
                      />
                      &nbsp; <span>{todo.text}</span>
                      <button onClick={() => deleteTodo(todo._id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TodoPage;
