import { Grid, Card, CardActions, CardContent, CardMedia, Button } from '@mui/material'
import { makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios'

const drawerWidth = 240;
const categories = ["business", "entertainment", "general", "health", "science", "sports", "technology"]

const useStyles = makeStyles((theme) => ({
    container: {
    },
    heading: {
        display: 'flex',
        flexDirection: 'row',
        padding: "10px",
        backgroundColor: "lightgrey"
    }
}));

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    }),
);

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function PersistentDrawerLeft() {
    const classes = useStyles()
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [stories, setStories] = React.useState([])
    const [currentCategory, setCurrentCategory] = React.useState("sports")

    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleClickOpen = () => {
        console.log(stories[0])
        setOpenDialog(true);
    };
    const handleClose = () => {
        setOpenDialog(false);
    };


    React.useEffect(() => {
        const display = async () => {
            const response = await axios.post("http://localhost:5000/", { category: currentCategory })
            if (response) {
                console.log(response.data.data.articles)
                const newres = response.data.data.articles.filter((data) => {
                    return data.author && data.description
                })
                setStories(newres)
            }
        }
        display()
    }, [currentCategory])
    const handleClick = async (category) => {
        setCurrentCategory(category)
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2, ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h4" noWrap component="div" align='center'>
                        InShorts
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {categories.map((text, index) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton onClick={() => { handleClick(text) }}>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Main open={open}>
                <DrawerHeader />

                <Grid container spacing={4} className={classes.content} direction="row"
                    justify="flex-start"
                    alignItems="flex-start">
                    {stories.map((data, index) => (

                        <Grid item key={index} xs={12} sm={6} md={4} lg={3} className={classes.item}>
                            <Card sx={{ height: 350, width: 280 }}>
                                <CardMedia sx={{ height: 150 }}
                                    image={data.urlToImage}
                                    title="green iguana" />
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {data.author.substring(0, 20)}
                                    </Typography>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        {data.content ? data.content.substring(0, 100) : data.description.substring(0, 100)}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button variant="outlined" onClick={handleClickOpen}>
                                        Read More
                                    </Button>
                                    <BootstrapDialog
                                        onClose={handleClose}
                                        aria-labelledby="customized-dialog-title"
                                        open={openDialog}
                                    >
                                        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                                            {stories[index].author}
                                        </DialogTitle>
                                        <IconButton
                                            aria-label="close"
                                            onClick={handleClose}
                                            sx={{
                                                position: 'absolute',
                                                right: 8,
                                                top: 8,
                                                color: (theme) => theme.palette.grey[500],
                                            }}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                        <DialogContent dividers>
                                            {stories[index].description}
                                        </DialogContent>
                                        <DialogActions>
                                            <Button autoFocus onClick={handleClose}>
                                                Close
                                            </Button>
                                        </DialogActions>
                                    </BootstrapDialog>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}

                </Grid>
            </Main>
        </Box>
    );
}