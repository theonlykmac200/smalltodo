import React, {useState, useEffect} from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import axios from "axios"

const API_URL = "https://todoapptheonlykmac.herokuapp.com/todos";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [editing, setEditing] = useState(null);
  const [editedInput, setEditedInput] = useState("");


  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const {data} = await axios.get(API_URL);
    setTodos(data);
  }

  const addTodo = async () => {
    if (!input) return;
    await axios.post(API_URL, {title: input});
    setInput("");
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      const updatedTodos = todos.filter((todo) => todo._id !== id);
      setTodos(updatedTodos);
    } catch (error) {
      console.error('there was Error deleting todo:', error);
    }
  };

  const updateTodo = async (id) => {
    await axios.put(`${API_URL}/${id}`, {title: editedInput});
    setEditing(null);
    setEditedInput("");
    fetchTodos();
  };
  
  
  const toggleComplete = async (id, completed) => {
    await axios.put(`${API_URL}/${id}`, {completed: !completed});
    fetchTodos();
  }
  

  const moveTodo = (index, direction) => {
    if (
      (index === 0 && direction === -1) ||
      (index === todos.length - 1 && direction === 1)
    )
      return;
  
    const updatedTodos = [...todos];
    const temp = updatedTodos[index + direction];
    updatedTodos[index + direction] = updatedTodos[index];
    updatedTodos[index] = temp;
  
    setTodos(updatedTodos);
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setInput}
          value={input}
          placeholder="Add a todo"
        />
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={todos}
        keyExtractor={(item) => item._id}
        renderItem={({item, index}) => (
          <View style={styles.todo}>
            {editing === item._id ? (
              <>
                <TextInput
                  style={styles.input}
                  onChangeText={setEditedInput}
                  value={editedInput}
                  placeholder="Edit todo"
                />
                <TouchableOpacity
                  style={styles.updateButton}
                  onPress={() => updateTodo(item._id)}
                >
                  <Text style={styles.updateButtonText}>Update</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text
                  style={[styles.todoText, item.completed && styles.completed]}
                  onPress={() => toggleComplete(item._id, item.completed)}
                >
                  {item.title}
                </Text>
                <View style={styles.buttons}>
                  <TouchableOpacity
                    onPress={() => moveTodo(index, -1)}
                    style={styles.moveButton}
                  >
                    <Text style={styles.moveButtonText}>⬆️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => moveTodo(index, 1)}
                    style={styles.moveButton}
                  >
                    <Text style={styles.moveButtonText}>⬇️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setEditing(item._id);
                      setEditedInput(item.title);
                    }}
                    style={styles.editButton}
                  >
                    <Text style={styles.editButtonText}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => deleteTodo(item._id)}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteButtonText}>❌</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
};
  


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#2196F3',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  todo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#BDBDBD',
  },
  todoText: {
    fontSize: 16,
    flex:1,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#BDBDBD',
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moveButton: {
    paddingHorizontal: 8,
  },
  moveButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginLeft: 8,
  },
  deleteButtonText: {
    color: '#FFFFFF',
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: 8,
  },
  updateButtonText: {
    color: 'ffffff',
    fontWeight: 'bold',
  },
  editButton: {
    paddingHorizontal: 8,
  },
  editButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
export default App;
// this is so I can add a git commit
