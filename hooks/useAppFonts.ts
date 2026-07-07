import { useFonts } from "expo-font";

import { fontFamilies } from "@/constants/theme";

const runtimeFonts = {};

export function useAppFonts() {
  const [fontsLoaded, fontError] = useFonts(runtimeFonts);

  return {
    fontsLoaded,
    fontError,
    fontFamilies,
  };
}
