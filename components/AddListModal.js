import React from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import colors from "../Colors";

export default class AddListModal extends React.Component {
  backgroundColors = [
    colors.redLight,
    colors.green,
    colors.pink,
    colors.blueDark,
    colors.blueLight,
    colors.violet,
    colors.orange,
  ];

  state = {
    name: "",
    color: this.backgroundColors[0],
  };

  // Tạo todoList
  createTodo = () => {
    const { name, color } = this.state;
    const list = { name, color };
    this.props.addList(list);
    this.setState({ name: "" });
    this.props.closeModal();
  };

  // Render ra màu
  renderColors() {
    return this.backgroundColors.map((color) => {
      return (
        <TouchableOpacity
          key={color}
          style={[styles.colorSelect, { backgroundColor: color }]}
          onPress={() => this.setState({ color })}
        />
      );
    });
  }
  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <TouchableOpacity
          style={{ position: "absolute", top: 65, right: 30, color: colors.white }}
          onPress={this.props.closeModal}
        >
          <AntDesign name="close" size={25} color={colors.white} />
        </TouchableOpacity>

        <View style={{ alignSelf: "stretch", marginHorizontal: 30 }}>
          <Text style={styles.title}>Make Your New List</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            onChangeText={(text) => this.setState({ name: text })}
          />

          <View>
            <Text style={styles.text}>Choose your style</Text>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
            {this.renderColors()}
          </View>

          <TouchableOpacity
            style={[styles.create, { backgroundColor: this.state.color }]}
            onPress={this.createTodo}
          >
            <Text style={{ color: colors.black, fontWeight: "600" }}>Create</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.white,
    alignSelf: "center",
    marginBottom: 20,
  },
  text: {
    marginTop: 50,
    fontSize: 15,
    color: colors.white,
    fontWeight: "800",
    alignSelf: "center",
  },
  input: {
    fontSize: 20,
    color: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.white,
    textAlign: "center",
    borderRadius: 5,
    height: 50,
    marginTop: 10,
    paddingHorizontal: 15,
  },
  create: {
    marginTop: 25,
    borderRadius: 5,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  colorSelect: {
    width: 30,
    borderRadius: 5,
    height: 30,
  },
});
