import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import colors from "./Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TodoList from "./components/ToDoList";
import AddListModal from "./components/AddListModal";
import Fire from "./Fire";
import netWork from "./components/NetworkUtills";

// Lưu dữ liệu vào AsyncStorage
let storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem("list", jsonValue);
  } catch (e) {
    console.log(e);
  }
};

// Lấy dữ liệu từ AsyncStorage
let getData = async () => {
  try {
    jsonValue = await AsyncStorage.getItem("list");
    let jsonParse = JSON.parse(jsonValue);
    return jsonParse;
  } catch (e) {
    console.log(e);
  }
};

export default class asyncApp extends React.Component {
  state = {
    addTodoVisible: false,
    lists1: [],
    lists2: [],
    user: {},
    loading: true,
    connect: false,
  };

  async componentDidMount() {
    await getData().then((val) => {
      this.state.lists1 = val;
    });
    if ((await netWork.isNetworkAvailable()) == true) {
      this.state.connect = true;
    } else {
      ToastAndroid.show(
        `Bạn đang ngoại tuyến vì vậy các bạn chỉ có thể xem và các thao sẽ chỉnh sửa sẽ không khả dụng`,
        ToastAndroid.LONG
      );
      this.state.connect = false;
    }
    //Kết nối firebase
    firebase = new Fire((error, user) => {
      if (error) {
        return alert("Something error");
      }
      firebase.getLists(async (lists2) => {
        this.setState({ lists2, user }, () => {
          this.setState({ loading: false });
        });
        if (this.state.lists2.length > 0) {
          await storeData(this.state.lists2);
        }
      });
      this.setState({ user });
    });
  }
  componentWillUnMount() {
    firebase.detach();
  }
  useList = () => {
    if (this.state.connect == true) {
      return this.state.lists2;
    }
    return this.state.lists1;
  };
  //Hiển thị Modal
  toggleAddTodoModal() {
    this.setState({ addTodoVisible: !this.state.addTodoVisible });
  }

  // Render ra từng list
  renderList = (list) => {
    return <TodoList list={list} updateList={this.updateList} deleteList={this.deleteList} />;
  };

  addList = (list) => {
    firebase.addList({
      name: list.name,
      color: list.color,
      todos: [],
    });
  };

  deleteList = (id) => {
    firebase.deleteList(id);
  };

  updateList = (list) => {
    firebase.updateList(list);
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color={colors.background} />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {/* Chuyển Modal */}
        <Modal
          animationType="slide"
          visible={this.state.addTodoVisible}
          onRequestClose={() => this.toggleAddTodoModal()}
        >
          <AddListModal closeModal={() => this.toggleAddTodoModal()} addList={this.addList} />
        </Modal>
        {/* Tên Ứng dụng*/}
        <View style={{ flexDirection: "row", marginBottom: 50 }}>
          <Text style={styles.title}>
            SMART <Text style={{ fontWeight: "300", color: colors.red }}>TODO</Text>
            <AntDesign name="edit" size={30} color={colors.red} />
          </Text>
        </View>
        {/* Danh mục các danh sách ToDo */}
        <View style={{ height: 400, marginTop: 20 }}>
          <FlatList
            data={this.useList()}
            keyExtractor={(item) => item.id.toString()}
            horizontal={false} //HIển thị các list theo chiều dọc
            showsVerticalScrollIndicator={false} //Hiển thị thanh cuộn
            renderItem={({ item }) => this.renderList(item)}
            keyboardShouldPersistTaps="always"
            numColumns={2}
          />
        </View>
        {/* Thêm danh sách ghi chú */}
        <View style={styles.addView}>
          <TouchableOpacity onPress={() => this.toggleAddTodoModal()}>
            <AntDesign style={styles.addList} name="pluscircle" size={60} color={colors.red} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 38,
    fontWeight: "800",
    color: colors.white,
    paddingHorizontal: 30,
  },
  addView: {
    position: "absolute",
    alignItems: "center",
    bottom: 40,
  },
  addList: {
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  add: {
    color: colors.red,
    fontWeight: "600",
    fontSize: 14,
    marginTop: 8,
  },
});
