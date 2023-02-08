//Modal Thêm Todo

import React from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  TextInput,
  Keyboard,
  Animated,
} from "react-native";
import colors from "../Colors";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Swipeable, GestureHandlerRootView } from "react-native-gesture-handler";
export default class TodoModal extends React.Component {
  state = {
    newTodo: "",
  };

  // Đánh dấu task đã hoàn thành
  toggleTodoComplete = (index) => {
    let list = this.props.list;
    list.todos[index].completed = !list.todos[index].completed;
    this.props.updateList(list);
  };
  // Thêm một task mới
  addTodo = () => {
    let list = this.props.list;
    if (!list.todos.some((todo) => todo.title === this.state.newTodo)) {
      list.todos.push({ title: this.state.newTodo, completed: false });
      this.props.updateList(list);
    }
    this.setState({ newTodo: "" });
    Keyboard.dismiss();
  };

  // Xóa một task
  deleteTodo = (index) => {
    let list = this.props.list;
    list.todos.splice(index, 1);
    this.props.updateList(list);
  };

  // Render giao diện các task
  renderTodo(todo, index) {
    return (
      <GestureHandlerRootView>
        <Swipeable renderRightActions={(_, dragX) => this.rightActions(dragX, index)}>
          <View style={styles.todoContainer}>
            <TouchableOpacity onPress={() => this.toggleTodoComplete(index)}>
              <Ionicons
                name={todo.completed ? "checkmark-circle-sharp" : "ellipse-outline"}
                size={24}
                color={colors.white}
                style={{ width: 32 }}
              />
            </TouchableOpacity>

            <Text
              style={[
                styles.todo,
                {
                  textDecorationLine: todo.completed ? "line-through" : "",
                  color: todo.completed ? colors.black : colors.white,
                },
              ]}
            >
              {todo.title}
            </Text>
          </View>
        </Swipeable>
      </GestureHandlerRootView>
    );
  }

  // Swipe
  rightActions = (dragX, index) => {
    return (
      <TouchableOpacity onPress={() => this.deleteTodo(index)}>
        <Animated.View style={styles.btnDelete}>
          <AntDesign name="delete" size={25} color={colors.white} />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  render() {
    const list = this.props.list;
    const taskCount = list.todos.length;
    const completedCount = list.todos.filter((todo) => todo.completed).length;
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <SafeAreaView style={styles.container}>
          <TouchableOpacity
            style={{ position: "absolute", top: 64, right: 32, zIndex: 10 }}
            onPress={this.props.closeModal}
          >
            <AntDesign name="close" size={24} color={colors.white}></AntDesign>
          </TouchableOpacity>

          {/* Display number of task completed */}
          <View style={[styles.card, { backgroundColor: list.color }]}>
            <View
              style={[
                styles.section,
                styles.header,
                { borderBottomColor: colors.background, borderBottomWidth: 5 },
              ]}
            >
              <View style={{ alignItems: "center" }}>
                <AntDesign name="edit" size={28} color={colors.white}>
                  <Text style={styles.title}> {list.name}</Text>
                </AntDesign>

                <Text style={styles.taskCount}>
                  {completedCount} of {taskCount} tasks
                </Text>
              </View>
            </View>
            <View style={[styles.section, { flex: 3, marginVertical: 16 }]}>
              <FlatList
                data={list.todos}
                renderItem={({ item, index }) => this.renderTodo(item, index)}
                keyExtractor={(item) => item.title}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>

          <View style={[styles.section, styles.footer]}>
            <TextInput
              style={[styles.input, { borderColor: list.color }]}
              onChangeText={(text) => this.setState({ newTodo: text })}
              value={this.state.newTodo}
            />
            <TouchableOpacity
              style={[styles.addTodo, { backgroundColor: list.color }]}
              onPress={() => this.addTodo()}
            >
              <AntDesign name="plus" size={18} color={colors.white} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    alignSelf: "stretch",
  },
  card: {
    flex: 1,
    borderRadius: 35,
    marginTop: 70,
    width: 320,
    shadowColor: colors.white,
    shadowOffset: { width: 5, height: 5, peak: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  header: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 3,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    alignItems: "center",
    color: colors.white,
  },
  taskCount: {
    marginTop: 10,
    color: colors.white,
  },
  footer: {
    marginTop: 40,
    paddingHorizontal: 32,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    color: colors.white,
    height: 48,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 6,
    marginRight: 8,
    paddingHorizontal: 8,
  },
  addTodo: {
    borderRadius: 4,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  todoContainer: {
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
  },
  todo: {
    color: colors.black,
    fontWeight: "700",
    fontSize: 16,
  },
  btnDelete: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    borderRadius: 10,
  },
});
