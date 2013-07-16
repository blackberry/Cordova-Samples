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

/*global Audio, App, Node */

var Sequence = {
	STATUS_ERROR: -1,
	STATUS_LOADING: 0,
	STATUS_READY: 1,
	STATUS_MUTED: 2,
	NODE_COUNT: 16,

	el: null,
	status: 0,
	nodes: null,
	images: null,
	audio: null,

	init: function (images) {
		this.status = Sequence.STATUS_LOADING;
		this.nodes = [];
		this.images = {};
		this.images.on = images.on;
		this.images.off = images.off;

		return this;
	},

	loadAudio: function (audiopath, voices) {
		var _this = this;

		this.audio = new Audio();
		this.audio.voices = voices * 2;
		this.audio.addEventListener('canplaythrough', function () {
			_this.status = Sequence.STATUS_READY;
			_this.el.classList.add('ready');
		}, false);
		this.audio.addEventListener('error', function () {
			_this.status = Sequence.STATUS_ERROR;
			_this.el.classList.add('error');
		}, false);
		this.audio.src = audiopath;
	},

	release: function () {
		this.audio.release();
	},

	play: function () {
		this.audio.play();
	},

	stop: function () {
		this.audio.pause();
	},

	render: function () {
		var wrapper, logo, imgOn, imgOff, nodes,
			_this = this;

		this.el = document.createElement('div');
		wrapper = document.createElement('div');
		logo = document.createElement('div');
		imgOn = document.createElement('img');
		imgOff = document.createElement('img');
		nodes = document.createElement('div');

		logo.addEventListener('touchstart', function (evt) {
			_this.toggleMuted(evt.currentTarget);
		}, false);

		imgOn.src = this.images.on;
		imgOff.src = this.images.off;

		this.el.classList.add('sequence');
		wrapper.classList.add('wrapper');
		logo.classList.add('logo');
		imgOff.classList.add('hide');
		nodes.classList.add('nodes');

		logo.appendChild(imgOn);
		logo.appendChild(imgOff);
		wrapper.appendChild(logo);
		wrapper.appendChild(this.renderNodes(nodes));
		this.el.appendChild(wrapper);
	},

	renderNodes: function (el) {
		var tempNode, node, i, j;

		tempNode = document.createDocumentFragment();

		for (i = 0, j = Sequence.NODE_COUNT; i < j; ++i) {
			node = Object.create(Node).init();
			tempNode.appendChild(node.render());
			this.nodes.push(node);
		}
		el.appendChild(tempNode);

		return el;
	},

	toggleMuted: function (el) {
		var children;

		if (this.status === Sequence.STATUS_READY) {
			this.status = Sequence.STATUS_MUTED;
			el.classList.add('selected');
			children = el.querySelectorAll('img');
			children[0].classList.add('hide');
			children[1].classList.remove('hide');
		} else if (this.status === Sequence.STATUS_MUTED) {
			this.status = Sequence.STATUS_READY;
			el.classList.remove('selected');
			children = el.querySelectorAll('img');
			children[0].classList.remove('hide');
			children[1].classList.add('hide');
		}
	}
};