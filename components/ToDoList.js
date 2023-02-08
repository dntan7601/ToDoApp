import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Modal, Animated } from "react-native";
import colors from "../Colors";
import ToDoModal from "./TodoModal";
import { Swipeable, GestureHandlerRootView } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
export default class TodoList extends React.Component {
  state = {
    addTodoVisible: false,
  };
  // Đóng mở Modal
  toggleListModal() {
    this.setState({ addTodoVisible: !this.state.addTodoVisible });
  }

  deleteList() {
    let list = this.props.list.id;
    this.props.deleteList(list);
  }

  render() {
    const list = this.props.list;
    const completedCount = list.todos.filter((todo) => todo.completed).length;
    const remainingCount = list.todos.length - completedCount;
    return (
      <View>
        {/* Hiển thị/ tắt modal */}

        <Modal
          animationType="slide"
          visible={this.state.addTodoVisible}
          onRequestClose={() => this.toggleListModal()}
        >
          <ToDoModal
            list={list}
            closeModal={() => this.toggleListModal()}
            updateList={this.props.updateList}
          />
        </Modal>

        {/* {this.renderTask(list,index)} */}
        <GestureHandlerRootView>
          <Swipeable renderRightActions={(_, dragX) => this.rightActions()}>
            <TouchableOpacity
              style={[styles.listContainer, { backgroundColor: list.color }]}
              onPress={() => this.toggleListModal()}
            >
              <Text style={styles.listTitle} numberOfLines={1}>
                {" "}
                {list.name}{" "}
              </Text>

              {/* Một task của todoList */}
              <View>
                <View style={{ alignItems: "center" }}>
                  <Text style={styles.count}>{completedCount}</Text>
                  <Text style={styles.subtitle}>
                    Done <AntDesign name="checkcircleo" size={10} color={colors.white} />
                  </Text>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Text style={styles.count}>{remainingCount}</Text>
                  <Text style={styles.subtitle}>Tasks Coming</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Swipeable>
        </GestureHandlerRootView>
      </View>
    );
  }

  rightActions = (dragX) => {
    return (
      <TouchableOpacity onPress={() => this.deleteList()}>
        <Animated.View style={styles.btnDelete}>
          <AntDesign name="delete" size={20} color={colors.black} />
        </Animated.View>
      </TouchableOpacity>
    );
  };
}

// Decorate
const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 15,
    marginTop: 20,
    alignItems: "center",
    marginHorizontal: 10,
    width: 150,
  },
  listTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.white,
    marginBottom: 18,
  },
  count: {
    fontSize: 48,
    fontWeight: "200",
    color: colors.white,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.white,
  },
  btnDelete: {
    backgroundColor: colors.red,
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    borderRadius: 10,
    marginTop: 120,
    marginLeft: 5,
  },
});
