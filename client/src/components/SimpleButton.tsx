// client/src/components/SimpleButton.tsx
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function SimpleButton() {
  return (
    <TouchableOpacity 
      style={styles.button}
      onPress={() => console.log("Кнопка нажата, но ничего не делает")}
    >
      <Text style={styles.buttonText}>Нажми меня</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});