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
    savedFilePath = null;
    console.log('PhoneGap is ready');
    bb.pushScreen('app.html', 'app');
  }
};


// run when the webworks sdk has initialized - this has to fire before you do any native api calls
function initWebWorks() {
  console.log('WebWorks is ready');
}


// invoke the camera
function invokeCamera() {
  var cameraOptions = {
    destinationType: Camera.DestinationType.FILE_URI
  };

  navigator.camera.getPicture(

    // success
    function(path) {
      resizePhoto('file://' + path);
    },

    // failure
    function(message) {
      toast("error " + reason);
    },

  // options
  cameraOptions);
}


// rescale the photo for upload.  nobody likes giant pictures!
function resizePhoto(path) {
  var canvas = $('#theCanvas').get(0);
  var ctx = canvas.getContext('2d');
  var image = new Image();
  image.src = path;
  image.onload = function() {
    canvas.width = 720;
    canvas.height = 1280;
    ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
    savePhoto(canvas);
  };
}


// save the photo
function savePhoto(canvas) {
  toast('Saving photo...', 3000);

  // setting up the filename, using epoch so we have a unique filename
  var epoch = (new Date).getTime();
  var filename = epoch + '.jpg';
  var path = blackberry.io.sharedFolder;
  path = path + '/photos/' + filename;

  // set to false so the file can be saved "outside" of the apps sandbox
  blackberry.io.sandbox = false;

  window.webkitRequestFileSystem(
  window.PERSISTENT, 5.0 * 1024 * 1024, function(fileSystem) {
    fileSystem.root.getFile(
    path, {
      create: true
    }, function(fileEntry) {
      fileEntry.createWriter(

      function(fileWriter) {
        // write error
        fileWriter.onerror = function(fileError) {
          console.log('FileWriter Error: ' + fileError);
        };

        // write end
        fileWriter.onwriteend = function() {
          savedFilePath = path;
          toast('Photo saved, now share it!!', 2500);
        };

        // convert canvas data to blob
        canvas.toBlob(
          function(blob) {
            fileWriter.write(blob);
          }, 'image/png');
        },

      // error
      function(fileError) {
        console.log('FileEntry Error: ' + fileError);
      });

      // directory entry error
    }, function(fileError) {
      console.log('DirectoryEntry (fileSystem.root) Error: ' + fileError);
    });

  // file system error
  }, function(fileError) {
    console.log('FileSystem Error: ' + fileError);
  });
}


// invoke sharing targets
function invokeShare() {
  if(savedFilePath == null) {
    toast('Take a photo first!');
    return false;
  } else {

    var request = {
      action: 'bb.action.SHARE',
      uri: 'file://' + savedFilePath,
      target_type: ["APPLICATION", "VIEWER", "CARD"]
    };

    blackberry.invoke.card.invokeTargetPicker(request, "Sharing is caring",

    // success callback
    function() {
      toast('Success!');
    },

    // error callback
    function(e) {
      alertinf('error: ' + e);
    });

  }
}

// helper to display toast message to the user
function toast(msg, timeout) {
  // if a timeout length is NOT specified
  if(typeof timeout == 'undefined') {
    timeout = 1000;
  }

  // toast options
  options = {
    timeout: timeout
  };

  // display the toast message
  toastId = blackberry.ui.toast.show(msg, options);
}