import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";
import image from "./ev-imgs/Picasso1.jpg"; 
//import image from "./ev-imgs/hb1.png";

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  
  return (
    <Box>
      {/* Hero Section */}
      <Box 
        style={{
          width: '100%',
          height: '35vh',
          backgroundImage: `url(${image})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}

        width="100%" 
        height="35vh" 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        backgroundColor={theme.palette.background.paper}
      >
        {/* <Typography fontWeight="bold" fontSize="64px" color="text.primary" textAlign="center">
          EverNova
        </Typography> */}
      </Box>
      
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <Typography fontWeight="bold" fontSize="32px" color="primary">
          EverNova
        </Typography>
      </Box> 

      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
          Welcome to Evernova: Write. Share. Transform.
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
