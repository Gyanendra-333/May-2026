import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import axios from "axios";

const API = "http://192.168.1.10:5000/api/todos";

export default function HomeScreen() {
  const [title, setTitle] = useState("");
  const [todos, setTodos] = useState<any[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(API);
      setTodos(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;

    try {
      if (editId) {
        await axios.put(`${API}/${editId}`, { title });
        setEditId(null);
      } else {
        await axios.post(API, { title });
      }

      setTitle("");
      fetchTodos();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (todo: any) => {
    setTitle(todo.title);
    setEditId(todo._id);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchTodos();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Todo App</Text>

      <TextInput
        placeholder="Enter Todo"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>
          {editId ? "Update Todo" : "Add Todo"}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={todos}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <Text>{item.title}</Text>

            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleEdit(item)}>
                <Text>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleDelete(item._id)}>
                <Text>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 50,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "black",
    padding: 12,
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  todoItem: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});