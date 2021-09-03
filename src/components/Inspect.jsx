import React, { useState, useRef, useEffect } from 'react';
import Webcam from "react-webcam";

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default () => {

    const webcamRef = useRef(null);
    const [currImage, setCurrImage] = useState();
    const [passed, setPassed] = useState(0);
    const [failed, setFailed] = useState(0);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [deviceId, setDeviceId] = React.useState({});
    const [devices, setDevices] = React.useState([]);

    const handleDevices = React.useCallback(
        mediaDevices =>
            setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
        [setDevices]
    );

    React.useEffect(
        () => {
            navigator.mediaDevices.enumerateDevices().then(handleDevices);
            setDeviceId(devices[0]);
        },
        [handleDevices]
    );



    const capture = React.useCallback(() => {
        setLoading(true);
        const imageSrc = webcamRef.current.getScreenshot();
        console.log(imageSrc);

        // Pinging the API
        setOpen(true);
        setMessage("Passed");
        setLoading(false);
        setPassed(passed + 1);
    }, [webcamRef]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    {message}
                </Alert>
            </Snackbar>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <Grid xs={6} item>
                    <List component="nav" aria-label="secondary mailbox folders">
                        <ListItem button>
                            Passed : {passed}
                        </ListItem>
                        <ListItem button>
                            Failed: {failed}
                        </ListItem>
                        <ListItem button>
                            Total: {passed + failed}
                        </ListItem>
                    </List>
                </Grid>
                <Grid xs={6} item>
                    <Grid
                        container
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Grid item>
                            <InputLabel id="demo-simple-select-label">Select Camera Source</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={deviceId}
                                onChange={(e) => setDeviceId(e.target.value)}
                            >
                                {devices.map(device => {
                                    return (
                                        <MenuItem value={device.id}>{device.label}</MenuItem>
                                    )
                                })}
                            </Select>
                        </Grid>
                        <Grid item>
                            {loading ? (
                                <CircularProgress />
                            ) : (
                                <Webcam
                                    audio={false}
                                    height={400}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    width={400}
                                    videoConstraints={{
                                        width: 400,
                                        height: 400,
                                        facingMode: "user",
                                        deviceId: deviceId
                                    }}
                                />
                            )}
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                onClick={(e) => { e.preventDefault(); capture(); }}
                            >
                                Capture
                            </Button>
                        </Grid>
                    </Grid>

                </Grid>
            </Grid>
        </>
    )
}