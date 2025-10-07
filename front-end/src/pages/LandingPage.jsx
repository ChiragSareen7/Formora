import React, { useState, useRef, useEffect } from 'react';
import {
    AppBar,
    Button,
    Card,
    Container,
    TextField,
    Toolbar,
    Typography,
    Box,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Slide,
    IconButton,
    Snackbar,
    Alert,
    Hidden,
    Fade,
    useMediaQuery,
    useTheme,
    Avatar,
    Stack,
    InputLabel,
    MenuItem,
    Select,
} from '@mui/material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';
import { motion } from 'framer-motion';
import { Close, CheckCircle } from '@mui/icons-material';
import styled, { keyframes } from 'styled-components';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment';

const chartData = [
    { name: 'Oct 2021', achieved: 4, target: 6 },
    { name: 'Nov 2021', achieved: 6, target: 4 },
    { name: 'Dec 2021', achieved: 7, target: 5 },
];

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const StyledDialog = styled(Dialog)`
  .MuiPaper-root {
    border-radius: 12px;
  }

  .MuiDialogTitle-root {
    padding: 24px;
    font-weight: bold;
    font-size: 1.5rem;
  }

  .MuiDialogContent-root {
    padding: 16px 24px;
  }

  .MuiDialogActions-root {
    padding: 8px 24px 24px;
  }
`;

const StyledTextField = styled(TextField)`
  .MuiOutlinedInput-root {
    border-radius: 8px;
  }
`;

const StyledButton = styled(Button)`
  border-radius: 8px;
  font-weight: bold;
`;

const StyledAppBar = styled(AppBar)`
  background-color: transparent;
  box-shadow: none;
`;

const StyledToolbar = styled(Toolbar)`
  justify-content: space-between;
`;

const AnimatedNumberBox = styled(Box)`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #00BCD4;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 2px;
  font-size: 0.8rem;
  animation: ${keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  `} 2s infinite;
`;

const RatingStars = ({ rating }) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
        stars.push(
            <span key={i} style={{ color: i < rating ? '#FFC107' : '#ddd', fontSize: '1.2rem' }}>
                ★
            </span>
        );
    }
    return <div>{stars}</div>;
};

const LandingPage = () => {
    const navigate = useNavigate();
    const [loginOpen, setLoginOpen] = useState(false);
    const [signupOpen, setSignupOpen] = useState(false);
    const [subscribeEmail, setSubscribeEmail] = useState('');
    const [subscribeSuccess, setSubscribeSuccess] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);


    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');


    const [signupName, setSignupName] = useState('');
    const [signupUsername, setSignupUsername] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
    const [signupDob, setSignupDob] = useState(null);
    const [signupGender, setSignupGender] = useState('');
    const [signupError, setSignupError] = useState('');
    const [signupSuccessMessage, setSignupSuccessMessage] = useState('');

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleLoginOpen = () => {
        setLoginOpen(true);
    };

    const handleLoginClose = () => {
        setLoginOpen(false);
        setLoginError('');
        setLoginEmail('');
        setLoginPassword('');
    };

    const handleSignupOpen = () => {
        setSignupOpen(true);
    };

    const handleSignupClose = () => {
        setSignupOpen(false);
        setSignupError('');
        setSignupName('');
        setSignupUsername('');
        setSignupEmail('');
        setSignupPassword('');
        setSignupConfirmPassword('');
        setSignupDob(null);
        setSignupGender('');
        setSignupSuccessMessage('');
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    const heroVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.7, delay: 0.2 } },
    };

    const imageVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.7, delay: 0.2 } },
    };

    const handleSubscribe = () => {
        if (subscribeEmail && subscribeEmail.includes('@')) {
            setSubscribeSuccess(true);
            setSnackbarOpen(true);
            setTimeout(() => {
                setSubscribeSuccess(false);
                setSubscribeEmail('');
            }, 3000);
        } else {
            alert('Please enter a valid email address.');
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const testimonialData = [
        {
            name: 'Alice Johnson',
            testimonial: 'This platform has revolutionized our data collection process. The AI insights are invaluable!',
            image: 'https://randomuser.me/api/portraits/women/1.jpg',
            rating: 5,
        },
        {
            name: 'Bob Williams',
            testimonial: 'The smart form creation and sentiment analysis features have saved us countless hours.',
            image: 'https://randomuser.me/api/portraits/men/1.jpg',
            rating: 4,
        },
    ];

    const handleSignup = async () => {
        if (!signupName || !signupUsername || !signupEmail || !signupPassword || signupPassword !== signupConfirmPassword || !signupDob || !signupGender) {
            setSignupError('Please fill in all fields correctly, and make sure passwords match.');
            return;
        }

        try {
          const dobFormatted = moment(signupDob).format('YYYY-MM-DD');
            const response = await axios.post('http://localhost:8080/api/signup', {
                name: signupName,
                username: signupUsername,
                email: signupEmail,
                password: signupPassword,
                dob: dobFormatted,
                gender: signupGender
            });

            if (response.status === 201) {
                setSignupSuccessMessage('Signup successful! You can now login.');
                setSignupError('');
            } else {
                setSignupError('Signup failed.  Please try again.');
            }
        } catch (error) {
            console.error('Signup error:', error);
            setSignupError(error.response?.data?.message || 'An error occurred during signup.');
        }
        Navi();
    };
    const Navi = () =>{
        navigate('/MainDashboard')
    }
    const handleLogin = async () => {
        if (!loginEmail || !loginPassword) {
            setLoginError('Please enter both email and password.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/login', {
                email: loginEmail,
                password: loginPassword
            });

            if (response.status === 200) {
                console.log('Login successful:', response.data);
                setLoginError('');
                handleLoginClose();
                alert('Login Successful!');
            } else {
                setLoginError('Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setLoginError(error.response?.data?.message || 'Invalid credentials!');
        }
        Navi();
    };

    return (
        <Box sx={{ background: 'linear-gradient(180deg, #FAF5FF 0%, #FDF2F8 100%)', minHeight: '100vh' , minWidth: '100vw'}}>

            <StyledAppBar position="static" sx={{ backgroundColor: '#F2E9F2', color: '#000' }}>
               <Container maxWidth="lg" >
                    <StyledToolbar>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#00000' }}>
                            FORMORA
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button color="inherit">Forms</Button>
                            <Button color="inherit">Templates</Button>
                            <Button color="inherit">Integrations</Button>
                            <Button color="inherit">Prices</Button>
                            <Button color="inherit" onClick={handleLoginOpen}>Sign In</Button>
                            <Hidden smDown>
                                <StyledButton variant="contained" sx={{ backgroundColor: '#000', color: '#fff', '&:hover': { backgroundColor: '#222' } }} onClick={handleSignupOpen}>Create free Account</StyledButton>
                            </Hidden>
                        </Box>
                    </StyledToolbar>
                </Container>
            </StyledAppBar>

            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <motion.img
                            src="/src/assets/landing_page_1.png"
                            alt="Formora Illustration"
                            style={{ width: '100%' }}
                            variants={imageVariants}
                            initial="hidden"
                            animate="visible"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <motion.div variants={heroVariants} initial="hidden" animate="visible">
                            <Typography variant="h4" sx={{ color: '#1E3A8A', mb: 2, fontWeight: 'bold' }}>
                                Beyond Data Collection
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#4B5563', mb: 4 }}>
                                Use Formora AI to create smart forms, analyze responses, predict trends and provide
                                actionable insights for businesses through automated analytics and sentiment analysis.
                            </Typography>
                            <StyledButton
                                variant="contained"
                                size="large"
                                sx={{
                                    backgroundColor: '#9333EA',
                                    '&:hover': { backgroundColor: '#7E22CE' },
                                    borderRadius: '5px',
                                    padding: '8px 20px',
                                    fontSize: '1rem',
                                }}
                            >
                                Explore!
                            </StyledButton>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>

            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Typography variant="h5" sx={{ textAlign: 'center', mb: 6, fontWeight: 'bold', color: '#4C1D95' }}>
                    Why Formora?
                </Typography>

                <Grid container spacing={4}>
                    {[
                        {
                            number: '1',
                            title: 'Real-Time Response Intelligence',
                            description: 'Get live sentiment analysis, automatic priority scoring, and risk predictions. AI-driven suggestions help users provide better responses.',
                            color: '#E0F7FA'
                        },
                        {
                            number: '2',
                            title: 'AI-Powered Form Creation',
                            description: 'Create or import forms instantly with smart templates and dynamic field suggestions. A built-in tone checker ensures clear and effective questions.',
                            color: '#F3E5F5'
                        },
                        {
                            number: '3',
                            title: 'Advanced Analytics Dashboard',
                            description: 'Track trends, uncover insights, and get predictive metrics. AI-powered recommendations turn data into actionable decisions.',
                            color: '#E0F2F1'
                        },
                    ].map((feature, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <motion.div variants={cardVariants} initial="hidden" animate="visible">
                                <Card sx={{ p: 3, backgroundColor: feature.color, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', height: '100%' }}>
                                    <AnimatedNumberBox>
                                        {feature.number}
                                    </AnimatedNumberBox>
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#4338CA' }}>
                                        {feature.title}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        {feature.description}
                                    </Typography>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Fade in={true} timeout={1000}>
                            <Card sx={{ p: 3, borderRadius: '16px', boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)' }}>
                                <Typography variant="h6" sx={{ mb: 2, color: '#4338CA' }}>Your Rating</Typography>
                                <Typography variant="body2" color="text.secondary">Lorem ipsum dolor sit amet, consectetur</Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                                    <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                                        <Box
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: '50%',
                                                backgroundColor: '#BBDEFB',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#1976D2'
                                            }}
                                        >
                                            <Typography variant="subtitle1" fontWeight="bold">85%</Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: '50%',
                                                backgroundColor: '#FFCC80',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#E65100'
                                            }}
                                        >
                                            <Typography variant="subtitle1" fontWeight="bold">85%</Typography>
                                        </Box>
                                    </Box>
                                    <Box
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: '50%',
                                            backgroundColor: '#80DEEA',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#006064'
                                        }}
                                    >
                                        <Typography variant="subtitle1" fontWeight="bold">85%</Typography>
                                    </Box>
                                </Box>
                            </Card>
                        </Fade>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Fade in={true} timeout={1500}>
                            <Card sx={{ p: 3, borderRadius: '16px', boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)' }}>
                                <Typography variant="h6" sx={{ mb: 2, color: '#4338CA' }}>Project Deliveries</Typography>
                                <LineChart width={500} height={300} data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="achieved" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                                    <Line type="monotone" dataKey="target" stroke="#82ca9d" strokeWidth={2} activeDot={{ r: 8 }} />
                                </LineChart>
                            </Card>
                        </Fade>
                    </Grid>
                </Grid>
            </Container>

            {/* Testimonials Section */}
            <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ color: '#9333EA', mb: 4, fontWeight: 'bold' }}>
                    What Our Users Say
                </Typography>
                <Grid container spacing={4} justifyContent="center">
                    {testimonialData.map((testimonial, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Card sx={{ p: 3, textAlign: 'left', borderRadius: '16px', boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)' }}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Avatar alt={testimonial.name} src={testimonial.image} />
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {testimonial.name}
                                    </Typography>
                                </Stack>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                    {testimonial.testimonial}
                                </Typography>
                                <RatingStars rating={testimonial.rating} />
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Subscribe Section */}
            <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ color: '#9333EA', mb: 2, fontWeight: 'bold' }}>
                    Subscribe
                </Typography>
                <Typography sx={{ mb: 4 }}>
                    Subscribe to stay tuned for new web design and latest updates. Let's do it!
                </Typography>
                <Box sx={{ maxWidth: 500, mx: 'auto', display: 'flex', gap: 2, flexDirection: isMobile ? 'column' : 'row' }}>
                    <StyledTextField
                        fullWidth
                        placeholder="Enter your email Address"
                        variant="outlined"
                        value={subscribeEmail}
                        onChange={(e) => setSubscribeEmail(e.target.value)}
                        sx={{ borderRadius: '5px', '& fieldset': { border: 'none' }, backgroundColor: '#fff' }}
                    />
                    <StyledButton
                        variant="contained"
                        sx={{
                            backgroundColor: '#9333EA',
                            '&:hover': { backgroundColor: '#7E22CE' },
                            borderRadius: '5px',
                            padding: '8px 20px',
                        }}
                        onClick={handleSubscribe}
                    >
                        Subscribe
                    </StyledButton>
                </Box>
            </Container>

            {/* Footer */}
            <Box sx={{ borderTop: 1, borderColor: 'divider', mt: 8 }}>
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 4, flexDirection: isMobile ? 'column' : 'row', alignItems: 'center' }}>
                        <Button color="inherit">About</Button>
                        <Button color="inherit">Features</Button>
                        <Button color="inherit">Pricing</Button>
                        <Button color="inherit">Gallery</Button>
                        <Button color="inherit">Team</Button>
                    </Box>
                    <Typography variant="body2" color="text.secondary" align="center">
                        Privacy Policy | Terms of Use | Sales and Refunds | Legal | Site Map
                    </Typography>
                </Container>
            </Box>

            {/* Login Dialog */}
            <StyledDialog
                open={loginOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleLoginClose}
                aria-describedby="login-dialog-description"
            >
                <DialogTitle>
                    {"Login"}
                    <IconButton aria-label="close" onClick={handleLoginClose} sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                  {loginError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {loginError}
                        </Alert>
                    )}
                    <StyledTextField
                        autoFocus
                        margin="dense"
                        id="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                    />
                    <StyledTextField
                        margin="dense"
                        id="password"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <StyledButton onClick={handleLoginClose}>Cancel</StyledButton>
                    <StyledButton onClick={handleLogin} variant="contained" color="primary">Login</StyledButton>
                </DialogActions>
            </StyledDialog>

            <StyledDialog
                open={signupOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleSignupClose}
                aria-describedby="signup-dialog-description"
            >
                <DialogTitle>
                    {"Sign Up"}
                    <IconButton aria-label="close" onClick={handleSignupClose} sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {signupError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {signupError}
                        </Alert>
                    )}
                    {signupSuccessMessage && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {signupSuccessMessage}
                        </Alert>
                    )}
                    <StyledTextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                    />
                    <StyledTextField
                        margin="dense"
                        id="username"
                        label="Username"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={signupUsername}
                        onChange={(e) => setSignupUsername(e.target.value)}
                    />
                    <StyledTextField
                        margin="dense"
                        id="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                    />
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                            label="Date of Birth"
                            value={signupDob}
                            onChange={(newValue) => {
                                setSignupDob(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} margin="dense" fullWidth />}
                        />
                    </LocalizationProvider>

                    <InputLabel id="gender-label" sx={{ mt: 2 }}>Gender</InputLabel>
                    <Select
                        labelId="gender-label"
                        id="gender"
                        value={signupGender}
                        label="Gender"
                        fullWidth
                        margin="dense"
                        onChange={(e) => setSignupGender(e.target.value)}
                    >
                        <MenuItem value={'male'}>Male</MenuItem>
                        <MenuItem value={'female'}>Female</MenuItem>
                        <MenuItem value={'other'}>Other</MenuItem>
                    </Select>

                    <StyledTextField
                        margin="dense"
                        id="password"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                    />
                    <StyledTextField
                        margin="dense"
                        id="confirm-password"
                        label="Confirm Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <StyledButton onClick={handleSignupClose}>Cancel</StyledButton>
                    <StyledButton onClick={handleSignup} variant="contained" color="primary">Sign Up</StyledButton>
                </DialogActions>
            </StyledDialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity="success"
                    sx={{ width: '100%', display: 'flex', alignItems: 'center' }}
                >
                    <CheckCircle sx={{ mr: 1 }} />
                    Subscribed successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default LandingPage;