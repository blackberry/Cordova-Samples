/*
 * Copyright (c) 2013 Research In Motion Limited.
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

/*global PGLowLatencyAudio */

var PGLowLatencyAudioStore = {};

function LLAudio() {
	this.HAVE_NOTHING = 0;
	this.HAVE_METADATA = 1;
	this.HAVE_CURRENT_DATA = 2;
	this.HAVE_FUTURE_DATA = 3;
	this.HAVE_ENOUGH_DATA = 4;

	this.events = {};
	this.src = false;
	this.autoplay = false;
	this.loop = false;
	this.paused = true;
	this.ended = false;
	this.duration = 0;
	this.voices = 1;
	this.timeoutID = 0;
	this.readyState = this.HAVE_NOTHING;

	this.addEventListener = this._addEventListener.bind(this);
	this.removeEventListener = this._removeEventListener.bind(this);
	this.dispatchEvent = this._dispatchEvent.bind(this);
	this.canPlayType = this._canPlayType.bind(this);
	this.waitForLoad = this._waitForLoad.bind(this);
	this.srcLoaded = this._srcLoaded.bind(this);
	this.loadSrc = this._loadSrc.bind(this);
	this.play = this._play.bind(this);
	this.pause = this._pause.bind(this);
	this.load = this._load.bind(this);
	this.release = this._release.bind(this);

	window.webkitRequestAnimationFrame(this.waitForLoad);
}

LLAudio.prototype._addEventListener = function _addEventListener(event, callback) {
	this.events['on' + event] = callback;
};

LLAudio.prototype._removeEventListener = function _removeEventListener(event) {
	delete this.events['on' + event];
};

LLAudio.prototype._dispatchEvent = function _dispatchEvent(event, params) {
	//console.log(params.origin + ': ' + this.src + '(' + event + ')');
	if (typeof this.events[event] !== 'undefined') {
		this.events[event](params);
	}
};

LLAudio.prototype._canPlayType = function _canPlayType(type) {
	if (type.indexOf('audio/wav') !== -1) {
		return 'probably';
	}
	return '';
};

LLAudio.prototype._waitForLoad = function _waitforLoad() {
	if (this.src === false) {
		window.webkitRequestAnimationFrame(this.waitForLoad);
	} else {
		this.loadSrc();
	}
};

LLAudio.prototype._srcLoaded = function _srcLoaded(duration) {
	this.duration = duration;
	this.dispatchEvent('ondurationchange', {origin: 'LLAudio._loadSrc'});

	this.readyState = this.HAVE_METADATA;
	this.dispatchEvent('onloadedmetadata', {origin: 'LLAudio._srcLoaded'});

	this.readyState = this.HAVE_CURRENT_DATA;
	this.dispatchEvent('onloadeddata', {origin: 'LLAudio._srcLoaded'});

	this.readyState = this.HAVE_FUTURE_DATA;
	this.dispatchEvent('oncanplay', {origin: 'LLAudio._srcLoaded'});

	this.readyState = this.HAVE_ENOUGH_DATA;
	this.dispatchEvent('oncanplaythrough', {origin: 'LLAudio._srcLoaded'});

	if (this.autoplay === true) {
		this.play();
	}
};

LLAudio.prototype._loadSrc = function _loadSrc() {
	var _this = this;

	this.audioFile = this.src.substring(this.src.lastIndexOf('/') + 1);
	this.audioPath = this.src.substring(0, this.src.lastIndexOf('/') + 1);
	this.dispatchEvent('onloadstart', {origin: 'LLAudio._loadSrc'});

	if (typeof PGLowLatencyAudioStore[this.audioFile] !== 'undefined') {
		this.srcLoaded(PGLowLatencyAudioStore[this.audioFile].duration);
		return;
	}

	PGLowLatencyAudio.preloadAudio(
		this.audioFile,
		this.audioPath,
		this.voices,
		function success() {
			PGLowLatencyAudioStore[_this.audioFile] = _this;
			PGLowLatencyAudio.getDuration(
				_this.audioFile,
				function success(duration) {
					_this.srcLoaded(duration);
				}
			);
		},
		function fail(e) {
			_this.dispatchEvent('onerror', {origin: 'PGLowLatencyAudio.preloadAudio', evt: e});
		}
	);
};

LLAudio.prototype._play = function _play() {
	var _this = this;

	if (this.loop === true) {
		PGLowLatencyAudio.loop(
			this.audioFile,
			function success(e) {
				_this.dispatchEvent('onprogress', {origin: 'PGLowLatencyAudio.loop', evt: e});
				_this.paused = false;
				_this.ended = false;
			},
			function fail(e) {
				_this.autoplay = true;
				_this.dispatchEvent('onerror', {origin: 'PGLowLatencyAudio.loop', evt: e});
			}
		);
	} else {
		PGLowLatencyAudio.play(
			this.audioFile,
			function success(e) {
				_this.dispatchEvent('onplay', {origin: 'PGLowLatencyAudio.play'});

				if (_this.duration) {
					_this.timeoutID = setTimeout(function () {
						_this.dispatchEvent('onended', {origin: 'PGLowLatencyAudio.play', evt: e});
						_this.pause();
					}, _this.duration * 1000);
				}
				_this.paused = false;
				_this.ended = false;
			},
			function fail(e) {
				_this.dispatchEvent('onerror', {origin: 'PGLowLatencyAudio.play', evt: e});
			}
		);
	}
};

LLAudio.prototype._pause = function _pause() {
	var _this = this;

	PGLowLatencyAudio.stop(
		this.audioFile,
		function success(e) {
			clearTimeout(_this.timeoutID);
			_this.dispatchEvent('onpause', {origin: 'PGLowLatencyAudio.stop', evt: e});
			_this.paused = true;
			_this.ended = true;
		},
		function fail(e) {
			_this.dispatchEvent('onerror', {origin: 'PGLowLatencyAudio.stop', evt: e});
		}
	);
};

LLAudio.prototype._load = function _load() {
	var _this = this;

	if (this.audioFile) {
		PGLowLatencyAudio.unload(
			this.audioFile,
			function success(e) {
				_this.audioFile = null;
				_this.dispatchEvent('onprogress', {origin: 'PGLowLatencyAudio.unload', evt: e});
				_this.loadSrc();
			},
			function fail(e) {
				_this.audioFile = null;
				_this.dispatchEvent('onerror', {origin: 'PGLowLatencyAudio.unload', evt: e});
				_this.loadSrc();
			}
		);
	} else {
		_this.loadSrc();
	}
};

LLAudio.prototype._release = function _release() {
	var _this = this;

	PGLowLatencyAudio.unload(
		this.audioFile,
		function success(e) {
			delete PGLowLatencyAudioStore[_this.audioFile];

			_this.ended = true;
			_this.dispatchEvent('onprogress', {origin: 'PGLowLatencyAudio.unload', evt: e});
		},
		function fail(e) {
			_this.dispatchEvent('onerror', {origin: 'PGLowLatencyAudio.unload', evt: e});
		}
	);
};

window.Audio = LLAudio;