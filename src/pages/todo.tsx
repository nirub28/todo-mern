import React, { useState, useEffect } from 'react';
import '../styles/todo.css'; 
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface Todo {
  _id: string;
  text: string;
}

const TodoPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]); 
  const [newTodo, setNewTodo] = useState<string>('');
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    // Fetch username from local storage)
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`/api/todos/${username}`);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async () => {
    //  setTodos([...todos, { _id: Date.now().toString(), text: newTodo }]);
    //  setNewTodo(''); // for manual check.
    try {
      const response = await axios.post('/api/todos/add', { text: newTodo, username });
      setTodos([...todos, response.data]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await axios.delete(`/api/todos/${id}`, { params: { username } });
      setTodos(todos.filter((todo: Todo) => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };
  

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const updatedTodos = [...todos];
    const [reorderedTodo] = updatedTodos.splice(result.source.index, 1);
    updatedTodos.splice(result.destination.index, 0, reorderedTodo);

    setTodos(updatedTodos);

    // api call to backend with the new todo order
    try {
      await axios.put('/api/todos', { todos: updatedTodos, username });
    } catch (error) {
      console.error('Error updating todo order:', error);
    }
  };

  return (
    <div>
      <h2>Todo List</h2>
      <div>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter new todo"
        />
        <button onClick={addTodo}>Add Todo</button>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {todos.map((todo: Todo, index: number) => (
                <Draggable key={todo._id} draggableId={todo._id} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {todo.text}
                      <button onClick={() => deleteTodo(todo._id)}>Delete</button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TodoPage;
