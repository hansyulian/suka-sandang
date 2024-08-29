// import { useNavigate } from '@tanstack/react-router';
import { Api } from "~/config/api";

import { Text } from "@mantine/core";

export function LandingScreen() {
  const query = Api.getServerInfo.useRequest({}, {});
  console.log(query.data);
  return <Text>This is Index </Text>;
}
