// 6-4-2023
import { Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";

const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <WidgetWrapper>
      <Typography color={dark} variant="h5" fontWeight="500">
          Evernova-AI
          {/* Five Thunder */}
      </Typography>
        {/* <Typography color={medium}>New Chat</Typography> */}
      <img
        width="100%"
        height="auto"
        alt="AI"
        src="http://localhost:3001/assets/wlogo1.png"
        style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
      />
      <FlexBetween>
        <Typography color={main}>Evernova-AI</Typography>
        <Typography color={medium}>evernova.com</Typography>
      </FlexBetween>
      <Typography color={medium} m="0.5rem 0">
      Evernova-AI: Experience a mindful approach to communication, promoting attentiveness, and fostering deeper connections. Learn how this feature encourages users to engage in thoughtful conversations, enhancing the overall social experience.
      </Typography>
    </WidgetWrapper>
  );
};

export default AdvertWidget;
