import { APP_NAME } from "@/constants/app";
import { SafeAreaView, Text } from "react-native";

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <Text>{APP_NAME}</Text>
    </SafeAreaView>
  );
}
