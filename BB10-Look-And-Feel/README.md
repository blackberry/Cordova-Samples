# BlackBerry 10 Look-and-Feel

This sample demonstrates how to achieve a BlackBerry 10 "Looks and Feel" from an HTML5 app using PhoneGap (Powered by Cordova).

The sample code for this application is Open Source under the [Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0.html).


**Applies To**

* [Adobe PhoneGap](http://www.phonegap.com)
* [BlackBerry 10 WebWorks SDK](https://developer.blackberry.com/html5/download/sdk)

**Author(s)**

* [Chad Tetreault](http://www.twitter.com/chadtatro)

**Dependencies**

1. [Adobe PhoneGap v2.3](http://www.phonegap.com) is [licensed](http://www.apache.org/licenses/LICENSE-2.0) under the Apache License, Version 2.0.
2. [bbUI.js] (https://github.com/blackberry/bbUI.js) is [licensed](https://github.com/blackberry/bbUI.js/blob/master/LICENSE) under the Apache 2.0 license.
3. [zepto.js](https://github.com/madrobby/zepto) is [dual licensed](https://github.com/madrobby/zepto/blob/master/MIT-LICENSE) under the MIT license.
4. [Canvas-toBlob.js](https://github.com/eligrey/canvas-toBlob.js) is [licensed](https://github.com/eligrey/canvas-toBlob.js/blob/master/LICENSE.md) under the MIT license.

**Icons**<br/>
Camera icon used is from [http://subway.pixle.pl/rim](http://subway.pixle.pl/rim) and [licensed](http://creativecommons.org/licenses/by/3.0/) under the CC-BY-3.0 license.  This is a subset of the Subway icons available at http://subway.pixle.pl/

Share icon used is from the official [BlackBerry 10 UI icon pack](https://developer.blackberry.com/design/bb10/).

**To contribute code to this repository you must be [signed up as an official contributor](http://blackberry.github.com/howToContribute.html).**

## Getting Started with PhoneGap & Cordova

To use this sample, refer to the [Getting Started With BlackBerry guide](http://docs.phonegap.com/en/2.3.0/guide_getting-started_blackberry_index.md.html#Getting%20Started%20with%20BlackBerry) which will take you through the entire setup, and building process.

## Porting Resources 

If you're porting an existing PhoneGap application over to BlackBerry 10 refer to [Porting your existing PhoneGap app to BlackBerry 10](http://supportforums.blackberry.com/t5/Web-and-WebWorks-Development/Porting-your-existing-PhoneGap-application-to-BlackBerry-10/ta-p/2070503) for lots of helpful information.

## Using this sample

This sample shows you how to get that BlackBerry 10 look and feel from an HTML5 app.  We're making use of PhoneGap's Camera API, and the BlackBerry 10 [Invocation Framework](https://developer.blackberry.com/html5/apis/blackberry.invoke.html).  Sharing the photo via the Invocation Framework will allow the user to connect with a variety of different applications installed on the phone.

## The code

Here's a quick glimpse at what we're doing in the app...

**Invoke the camera**

First, we invoke the camera using the PhoneGap API

```
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
```

**Resize the photo**

Next, we resize the photo because nobody wants to see your enormous 10000x10000 pixel image on their Facebook wall.  Also, making it smaller will decrease the bandwidth, and time, used to transfer it.

```
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
```

** Saving the photo **

[Erik Oros](http://github.com/oros) has written a great sample that shows how to save HTML5 Canvas data to the filesystem.  Check out [Canvas-to-Filesystem](https://github.com/oros/BB10-WebWorks-Samples/tree/master/canvasToFilesystem) for more info.

** Invoke Sharing Targets **

Last, we are using the BlackBerry 10 [Invocation Framework](https://developer.blackberry.com/html5/apis/blackberry.invoke.html) to display a list of apps which you can share the photo with. Check-out the [shareTargets](https://github.com/blackberry/BB10-WebWorks-Samples/tree/master/ShareTargets) sample for more info on using the framework.

```
function invokeShare() {
    var request = {
      action: 'bb.action.SHARE',
      uri: 'file://' + savedFilePath,
      target_type: ["APPLICATION", "VIEWER", "CARD"]
    };

    blackberry.invoke.card.invokeTargetPicker(request, "Sharing is caring",

    // success callback
    function() {
    },

    // error callback
    function(e) {
    });

  }
}
```

## More Info

* [BlackBerry HTML5 WebWorks](https://bdsc.webapps.blackberry.com/html5/) - Downloads, Getting Started guides, samples, code signing keys.
* [BlackBerry WebWorks Development Guides](https://bdsc.webapps.blackberry.com/html5/documentation)
* [BlackBerry WebWorks Community Forums](http://supportforums.blackberry.com/t5/Web-and-WebWorks-Development/bd-p/browser_dev)
* [BlackBerry Open Source WebWorks Contributions Forums](http://supportforums.blackberry.com/t5/BlackBerry-WebWorks/bd-p/ww_con)


## Contributing Changes

Please see the [README](https://github.com/blackberry/BB10-WebWorks-Samples) of the BB10-WebWorks-Samples repository for instructions on how to add new Samples or make modifications to existing Samples.


## Bug Reporting and Feature Requests

If you find a bug in a Sample, or have an enhancement request, simply file an [Issue](https://github.com/blackberry/BB10-WebWorks-Samples/issues) for the Sample and send a message (via github messages) to the Sample Author(s) to let them know that you have filed an [Issue](https://github.com/blackberry/BB10-WebWorks-Samples/issues).

## Disclaimer

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

