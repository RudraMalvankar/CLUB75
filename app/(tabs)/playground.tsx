import { ScrollView, View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Screen } from "@/components/layout/Screen";
import { Heading } from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { Caption } from "@/components/ui/typography/Caption";
import { Label } from "@/components/ui/typography/Label";
import { Button } from "@/components/ui/button/Button";
import { IconButton } from "@/components/ui/button/IconButton";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input/Input";
import { Textarea } from "@/components/ui/textarea/Textarea";
import { Alert } from "@/components/ui/feedback/Alert";
import { Badge } from "@/components/ui/badge/Badge";
import { ProgressBar } from "@/components/ui/progress/ProgressBar";
import { Stack } from "@/components/ui/layout/Stack";
import { Divider } from "@/components/ui/layout/Divider";
import { Spacer } from "@/components/ui/layout/Spacer";
import { ListItem } from "@/components/ui/list/ListItem";
import { ListSection } from "@/components/ui/list/ListSection";
import { Modal } from "@/components/ui/modal/Modal";
import { useState } from "react";

export default function PlaygroundScreen() {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Stack gap="xl">
          <Heading variant="headingXL">UI Playground</Heading>
          <Caption variant="caption" color={theme.colors.textSecondary}>
            Testing all UI components
          </Caption>

          <Divider />

          <Heading variant="headingM">Typography</Heading>
          <Stack gap="sm">
            <Heading variant="displayXL">Display XL</Heading>
            <Heading variant="displayL">Display L</Heading>
            <Heading variant="displayM">Display M</Heading>
            <Heading variant="headingXL">Heading XL</Heading>
            <Heading variant="headingL">Heading L</Heading>
            <Heading variant="headingM">Heading M</Heading>
            <Text variant="bodyLarge">Body Large</Text>
            <Text variant="body">Body</Text>
            <Caption variant="caption">Caption</Caption>
            <Caption variant="micro">Micro</Caption>
          </Stack>

          <Divider />

          <Heading variant="headingM">Buttons</Heading>
          <Stack gap="md">
            <Stack direction="horizontal" gap="sm">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
            </Stack>
            <Stack direction="horizontal" gap="sm">
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </Stack>
            <Button variant="danger" loading>
              Loading
            </Button>
            <Button disabled>Disabled</Button>
          </Stack>

          <Divider />

          <Heading variant="headingM">Cards</Heading>
          <Card>
            <CardHeader>
              <Heading variant="headingM">Card Title</Heading>
            </CardHeader>
            <CardContent>
              <Text>This is the card content area with some text.</Text>
            </CardContent>
            <CardFooter>
              <Button size="sm">Action</Button>
            </CardFooter>
          </Card>

          <Divider />

          <Heading variant="headingM">Inputs</Heading>
          <Stack gap="md">
            <Input label="Name" placeholder="Enter your name" />
            <Input label="Email" placeholder="Enter your email" error="Invalid email" />
            <Input label="Password" placeholder="Enter password" hint="Must be 8+ characters" />
            <Textarea label="Notes" placeholder="Enter notes..." />
          </Stack>

          <Divider />

          <Heading variant="headingM">Feedback</Heading>
          <Stack gap="md">
            <Alert variant="info" title="Info" message="This is an info alert" />
            <Alert variant="success" title="Success" message="This is a success alert" />
            <Alert variant="warning" title="Warning" message="This is a warning alert" />
            <Alert variant="danger" title="Error" message="This is a danger alert" />
          </Stack>

          <Divider />

          <Heading variant="headingM">Badges</Heading>
          <Stack direction="horizontal" gap="sm" wrap>
            <Badge variant="default">Default</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
          </Stack>

          <Divider />

          <Heading variant="headingM">Progress</Heading>
          <Stack gap="md">
            <ProgressBar value={75} showLabel />
            <ProgressBar value={50} height={12} />
            <ProgressBar value={25} height={4} />
          </Stack>

          <Divider />

          <Heading variant="headingM">List</Heading>
          <ListSection title="Section Title">
            <ListItem title="Item 1" subtitle="Subtitle 1" />
            <ListItem title="Item 2" subtitle="Subtitle 2" />
            <ListItem title="Item 3" subtitle="Subtitle 3" />
          </ListSection>

          <Divider />

          <Heading variant="headingM">Modal</Heading>
          <Button onPress={() => setModalVisible(true)}>Open Modal</Button>
          <Modal
            visible={modalVisible}
            title="Example Modal"
            onClose={() => setModalVisible(false)}
          >
            <Text>This is a modal dialog with some content.</Text>
            <Button onPress={() => setModalVisible(false)}>Close</Button>
          </Modal>

          <Spacer size="4xl" />
        </Stack>
      </ScrollView>
    </Screen>
  );
}
