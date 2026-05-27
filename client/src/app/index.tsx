import HeroCard from "@/components/HeroCard";
import SimpleButton from "@/components/SimpleButton";
import { View } from "react-native"

export default function HomeScreen() {
  return (
    <View style={{ padding: 20 }}>
      <HeroCard />
      <SimpleButton />
    </View>
  );
}


