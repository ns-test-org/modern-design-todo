'use client';

import { useState, useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('modern-todos');
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt)
      }));
      setTodos(parsedTodos);
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('modern-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
        createdAt: new Date()
      };
      setTodos([newTodo, ...todos]);
      setInputValue('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const completedCount = todos.filter(todo => todo.completed).length;
  const activeCount = todos.length - completedCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-lime-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent neon-green-text-glow">
            Modern Todo
          </h1>
          <p className="text-slate-300 text-lg">Stay organized with style</p>
        </div>

        {/* Add Todo Form */}
        <div className="mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                placeholder="What needs to be done?"
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300"
              />
            </div>
            <button
              onClick={addTodo}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-500/25 neon-green-glow"
            >
              Add
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-1 border border-white/20">
            {(['all', 'active', 'completed'] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 capitalize ${
                  filter === filterType
                    ? 'bg-gradient-to-r from-green-400 to-emerald-400 text-white shadow-lg neon-green-glow'
                    : 'text-slate-300 hover:text-green-300'
                }`}
              >
                {filterType}
              </button>
            ))}
          </div>
        </div>

        {/* Todo List */}
        <div className="space-y-3 mb-8">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✨</div>
              <p className="text-slate-400 text-lg">
                {filter === 'completed' ? 'No completed tasks yet' :
                 filter === 'active' ? 'No active tasks' :
                 'No tasks yet. Add one above!'}
              </p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`group flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl transition-all duration-300 hover:bg-white/15 hover:border-green-400/50 hover:shadow-green-400/20 hover:shadow-lg ${
                  todo.completed ? 'opacity-75' : ''
                }`}
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                    todo.completed
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500 border-green-400 shadow-lg shadow-green-400/50'
                      : 'border-slate-400 hover:border-green-400 hover:shadow-green-400/30 hover:shadow-md'
                  }`}
                >
                  {todo.completed && (
                    <svg className="w-4 h-4 text-white m-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                
                <span
                  className={`flex-1 text-lg transition-all duration-300 ${
                    todo.completed
                      ? 'text-slate-400 line-through'
                      : 'text-white'
                  }`}
                >
                  {todo.text}
                </span>
                
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="flex-shrink-0 w-8 h-8 text-slate-400 hover:text-red-400 transition-colors duration-300 opacity-0 group-hover:opacity-100"
                >
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Stats and Actions */}
        {todos.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl">
            <div className="text-slate-300">
              <span className="font-semibold text-white">{activeCount}</span> active, {' '}
              <span className="font-semibold text-white">{completedCount}</span> completed
            </div>
            
            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="px-4 py-2 text-slate-300 hover:text-red-400 transition-colors duration-300 font-medium"
              >
                Clear completed
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}











