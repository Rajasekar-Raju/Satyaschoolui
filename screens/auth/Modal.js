import React from "react";
import { Modal, TextInput, List } from "react-native-paper";
import { ScrollView } from "react-native";

export default function ViewModal({
  visible,
  hideModal,
  data,
  selected,
  onChange,
}) {
  const [text, setText] = React.useState("");
  const containerStyle = {
    backgroundColor: "white",
    margin: 20,
    // padding: 20,
    height: 300,
    borderRadius: 4,
  };

  return (
    <Modal
      visible={visible}
      onDismiss={hideModal}
      contentContainerStyle={containerStyle}
    >
      <TextInput
        value={text}
        mode={"outlined"}
        onChangeText={(text) => setText(text)}
      />
      <ScrollView>
        {data
          .filter((t) => t.name.includes(text))
          .map((item, i) => (
            <List.Item
              key={i}
              title={item.name}
              onPress={(e) => {
                setText("");
                onChange(item);
                hideModal();
              }}
              right={(props) =>
                selected.id === item.id && <List.Icon {...props} icon="check" />
              }
            />
          ))}
      </ScrollView>
    </Modal>
  );
}
