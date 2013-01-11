/*
 *  Copyright 2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* Portions of this code are from the PhoneGap 2.2 Sample app/docs.  Modified 
 * the sample to show a BlackBerry WebWorks usecase.
 * ----------------------------------------------------------------------
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var app = {
    initialize: function() {
        this.bindEvents();
    },

    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('PhoneGap is ready');
    }
};


// run when the webworks sdk has initialized
function initWebWorks() {
    console.log('WebWorks is ready');
    toast('WebWorks initialized!');
}


// helper to display toast message to the user
function toast(msg) {
    blackberry.ui.toast.show(msg);
}


// accelerometer
function testAccelerometer() {
    toast('Shake your phone!');
    setTimeout(function() {
        navigator.accelerometer.getCurrentAcceleration(

        function(acceleration) {
            alert('Acceleration X: ' + acceleration.x + '\n' + 'Acceleration Y: ' + acceleration.y + '\n' + 'Acceleration Z: ' + acceleration.z + '\n' + 'Timestamp: ' + acceleration.timestamp + '\n');

        }, function(message) {
            alert('Accelerometer error: ' + message);
        });
    }, 1500);
}


// camera
function testCamera() {
    var cameraOptions = {
        destinationType: Camera.DestinationType.FILE_URI
    };

    navigator.camera.getPicture(

    // success
    function(imageURI) {
        alert('ImageURI\n' + imageURI);
    },

    // failure
    function(message) {
        alert('Camera error: ' + message);
    },

    // options
    cameraOptions);
}


// connections
function testConnections() {
    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.NONE] = 'No network connection';
    alert('Connection type: ' + states[networkState]);
}


// geolocation - get position
function testGeolocation() {
    toast('Finding your location.  Wait...');
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
}


// onSuccess Geolocation
function geoSuccess(position) {
    var myLocation = 'Latitude: ' + position.coords.latitude + '\nLongitude: ' + position.coords.longitude + '\nAltitude: ' + position.coords.altitude + '\nHeading: ' + position.coords.heading + '\nSpeed: ' + position.coords.speed + '\nTimestamp: ' + position.timestamp + '\nAccuracy: ' + position.coords.accuracy + '\nAltitude Accuracy: ' + position.coords.altitudeAccuracy;
    alert(myLocation);
}


// onError Callback receives a PositionError object
function geoError(error) {
    alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
}


// geolocation - watch position
function testGeolocationWatch() {
    toast('Monitoring location...');
    watchID = null;
    var options = {
        timeout: 5000
    };

    watchID = navigator.geolocation.watchPosition(geoWatchSuccess, geoWatchError, options);
}


// onSuccess Geolocation watch
function geoWatchSuccess(position) {
    var myLocation = 'Lat: ' + position.coords.latitude + '\nLon: ' + position.coords.longitude;

    var message = myLocation,
        buttonText = "Stop",
        toastId, onButtonSelected = function() {
            navigator.geolocation.clearWatch(watchID);
            setTimeout(function() {
                toast('Stopped monitoring location');
            }, 1000);

        },
        onToastDismissed = function() {},
        options = {
            buttonText: buttonText,
            dismissCallback: onToastDismissed,
            buttonCallback: onButtonSelected
        };

    toastId = blackberry.ui.toast.show(message, options);
}


// onError Callback receives a PositionError object
function geoWatchError(error) {
    alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
}


// notification - alert
function testNotificationAlert() {
    navigator.notification.alert('You are the winner!', // message
    function() {
        alert('Alert dismissed.');
    }, // callback
    'Game Over', // title
    'Done' // buttonName
    );
}


// notification - confirm
function testNotificationConfirm() {
    navigator.notification.confirm('You are the winner!', // message


    function(buttonIndex) {
        alert('You selected: ' + buttonIndex);
    }, // callback to invoke with index of button pressed
    'Game Over', // title
    'Restart,Exit' // buttonLabels
    );
}


// storage
function testStorageOpenDatabase() {
    var db = window.openDatabase("test", "1.0", "Test DB", 1000000);
    testStorageTransaction();
}

function testStorageTransaction() {
    var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(populateDB, storageError, storageSuccess);
}

function populateDB(tx) {
    tx.executeSql('DROP TABLE IF EXISTS DEMO');
    tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
    tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "First row")');
    tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Second row")');
}

function storageError(err) {
    alert("Error processing SQL: " + err.code);
}

function storageSuccess() {
    toast('Database created! Now querying...');
    var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(queryDB, storageError);
}

function queryDB(tx) {
    tx.executeSql('SELECT * FROM DEMO', [], querySuccess, storageError);
}


// Query the success callback
function querySuccess(tx, results) {
    alert("Success! \n\n Returned rows: " + results.rows.length + ' \n\n Pro Tip: Use Web Inspector to view the DB!');
}


// toggles (dropdown menu items)
function toggleCapture() {
    if($('.capture').is(':visible')) {
        $('.capture').slideUp(150);
    } else {
        $('.capture').slideDown(150);
    }
}

function toggleGeolocation() {
    if($('.geolocation').is(':visible')) {
        $('.geolocation').slideUp(150);
    } else {
        $('.geolocation').slideDown(150);
    }
}

function toggleNotifications() {
    if($('.notification').is(':visible')) {
        $('.notification').slideUp(150);
    } else {
        $('.notification').slideDown(150);
    }
}