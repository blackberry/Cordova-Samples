![Splash](http://github.rim.net/eoros/LowLatencySequencer/raw/master/images/sequencer_landscape768.jpg)

Requirements
============
* Cordova 2.9.0 or higher.
* BlackBerry 10.1.0 or higher.

Background
==========
This sample is a Cordova implementation that leverages the LowLatencyAudio plugin available here:
[https://github.com/blackberry/WebWorks-Community-APIs/tree/master/BB10-Cordova/LowLatencyAudio](https://github.com/blackberry/WebWorks-Community-APIs/tree/master/BB10-Cordova/LowLatencyAudio)

The application contains four actions on the Action Bar (left-to-right):
* **Choose Sound Kit**: This will provide a display to select an audio pack.
* **Play Toggle**: Will begin/stop playback of the currently loaded audio pack / sequences.
* **Repeat Toggle**: Will loop playback when the end of the sequence is reached.
* **BPM Slider**: Increase or decrease the speed of playback.

At **120 BPM** (default) each square node represents **1 second** with the ability to play sounds at half-steps.

**Special Thanks**
* Ken Huynh for the LowLatencyAudio plugin implementation.
* Anzor Bashkhaz for the splashscreen, background images, and moral support.
* Tomas Pettersson for his [sfxr](http://www.drpetter.se/) tool; used to create the sound kits.

LLAudio.js
==========
Included in this implementation is LLAudio.js which bridges the default HTML5 Audio implementation
with the LowLatencyAudio plugin. While still a work in progress, the goal is that LLAudio.js can be
re-used in any HTML5 application with an existing Audio implementation and the wrapper should provide
a low latency implementation.

Not all audio implementations will be compatible with this wrapper.
	
Create Cordova Project
=========================================

Here is a quick overview of the steps and command-line scripts necessary to create a Cordova project to
build your own version of LowLatencySequencer. [Full BlackBerry 10 documentation](http://cordova.apache.org/docs/en/2.9.0rc1/guide_getting-started_blackberry10_index.md.html#Getting%20Started%20with%20BlackBerry%2010) is available on the Cordova website.

1.  Download the latest version of Cordova.

	[http://cordova.apache.org/](http://cordova.apache.org/)

2.  Create a new BlackBerry 10 Cordova project using the **bin\create** command.

    ```
    C:\cordova-2.9.0>bin\create LowLatencySequencer
    ```

3.  Delete the default contents of your **www** folder and copy the contents of this repository to the **www** folder.

    ```
    C:\cordova-2.9.0\LowLatencySequencer\www
    ```

4.  Download the LowLatencyAudio plugin to your PC.

	[https://github.com/blackberry/WebWorks-Community-APIs/tree/master/BB10-Cordova/LowLatencyAudio](https://github.com/blackberry/WebWorks-Community-APIs/tree/master/BB10-Cordova/LowLatencyAudio)

5.  Install the LowLatencyAudio plugin to your LowLatencySequencer project using the **cordova\plugin add** command.

    ```
    C:\cordova-2.9.0\LowLatencySequencer>cordova\plugin add C:\WebWorks-Community-APIs\BB10-Cordova\LowLatencyAudio
    ```

6. **Copy cordova.js** from:

    ```
    C:\cordova-2.9.0\LowLatencySequencer\lib\cordova.2.9.0\javascript\cordova.js
    ```

   To your **www** folder:

    ```
    C:\cordova-2.9.0\LowLatencySequencer\www
    ```

Your project is now set up and you can use the Cordova **build** or **run** commands to deploy the application to your device.
