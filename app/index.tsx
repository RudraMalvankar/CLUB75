import { Redirect } from "expo-router";

import { ROUTES } from "@/constants/routes";

export default function RootIndex() {
  return <Redirect href={ROUTES.TABS} />;
}
