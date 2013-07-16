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

/*global Worker, Sequence, Node */

var App = {
	el: null,
	metronome: null,
	sequences: null,
	oldIndex: 0,
	newIndex: 0,
	isPlaying: false,
	repeat: false,

	/* Lazy workaround. */
	lazy: function () {
		setTimeout(function () {
			App.el.content.classList.toggle('lazy_workaround');
			setTimeout(function () {
				App.el.content.classList.toggle('lazy_workaround');
			}, 0);
		}, 0);
	},

	/* Initialize. */
	init: function () {
		var _this = this;

		this.el = {
			container: document.querySelector('.container'),
			header: document.querySelector('.header'),
			content: document.querySelector('.content'),
			curtain: document.querySelector('.curtain'),
			footer: document.querySelector('.footer'),
			kits: document.querySelector('.kits'),
			bpmslider: document.querySelector('.bpmslider'),
			bpm: document.querySelector('input[name="bpm"]')
		};

		this.metronome = new Worker('./js/metronome.js');
		this.metronome.addEventListener('message', function () {
			_this.tick();
		}, false);

		this.sequences = [];
		this.oldIndex = 0;
		this.newIndex = 0;
		this.isPlaying = false;
		this.repeat = false;

		return this;
	},

	tick: function () {
		if (this.isPlaying === true) {
			if (this.oldIndex === Sequence.NODE_COUNT - 1 && this.repeat === false) {
				this.togglePlay(this.el.footer.querySelector('.togglePlay'));
				return;
			}
			this.clearHighlighted();
			this.playSequences();
			this.oldIndex = this.newIndex;
			this.newIndex = (this.newIndex === Sequence.NODE_COUNT - 1) ? 0 : (this.newIndex + 1);
		}
	},

	playSequences: function () {
		var sequences, sequence, node, i, j;

		/* Loop through all active sequences, try to play the node. */
		sequences = [];
		for (i = 0, j = this.sequences.length; i < j; ++i) {
			sequence = this.sequences[i];
			node = sequence.nodes[this.newIndex];

			if (sequence.status === Sequence.STATUS_MUTED) {
				node.el.classList.add('muted');
			} else {
				if (sequence.status === Sequence.STATUS_READY && node.status === Node.STATUS_READY) {
					sequences.push(sequence); // sequence.play();
				}
				node.el.classList.add('highlighted');
			}
		}

		for (i = 0, j = sequences.length; i < j; ++i) {
			sequences[i].play();
		}
		sequences = null;
	},

	stopSequences: function () {
		var sequence, i, j;

		/* Loop through all active sequences, try to stop the node. */
		for (i = 0, j = this.sequences.length; i < j; ++i) {
			sequence = this.sequences[i];
			sequence.stop();
		}
	},

	killSequences: function () {
		var sequence, i, j;

		/* Loop through all active sequences and release them. */
		for (i = 0, j = this.sequences.length; i < j; ++i) {
			sequence = this.sequences[i];
			sequence.release();
		}
		this.sequences = [];
	},

	/* el = .kit */
	toggleKit: function (el) {
		var selected, children, dataKit, xhr,
			_this = this;

		/* Store our selections. */
		selected = this.el.kits.querySelector('.kit.selected');

		/* Toggle our selection. */
		el.classList.toggle('selected');
		children = el.querySelectorAll('img');
		children[0].classList.toggle('hide');
		children[1].classList.toggle('hide');

		/* Unselect other selected item. */
		if (selected !== null && selected !== el) {
			selected.classList.remove('selected');
			children = selected.querySelectorAll('img');
			children[0].classList.toggle('hide');
			children[1].classList.toggle('hide');
		}

		/* Release existing kit. */
		this.stopSequences();
		this.killSequences();
		this.el.content.innerHTML = '';

		/* If we were just selected. */
		if (el.classList.contains('selected') === true) {
			/* Load new sequences. */
			dataKit = el.getAttribute('data-kit');
			xhr = new XMLHttpRequest();
			xhr.open('GET', dataKit, true);
			xhr.onload = function () {
				var json, tempNode, kitRoot, audio, sequence, i, j;

				json = JSON.parse(this.response);
				tempNode = document.createDocumentFragment();
				kitRoot = dataKit.substring(0, dataKit.lastIndexOf('/') + 1);

				for (i = 0, j = json.audio.length; i < j; ++i) {
					audio = json.audio[i];
					sequence = Object.create(Sequence).init(
						{
							on: kitRoot + audio.img,
							off: kitRoot + audio.imgMuted
						}
					);
					sequence.render();
					sequence.loadAudio(kitRoot + audio.id, audio.voices);
					tempNode.appendChild(sequence.el);
					_this.sequences.push(sequence);
				}

				_this.toggleKits(_this.el.footer.querySelector('.toggleKits'));
				window.webkitRequestAnimationFrame(function () {
					/* Load new DOM fragment. */
					_this.el.content.appendChild(tempNode);
					_this.lazy();
				});
			};
			xhr.send();
		}
	},

	/* el = .toggleKits */
	toggleKits: function (el) {
		var children,
			_this = this;

		/* Show Kits. */
		el.classList.toggle('selected');
		children = el.querySelectorAll('img');
		children[0].classList.toggle('hide');
		children[1].classList.toggle('hide');
		window.webkitRequestAnimationFrame(function () {
			var selected = _this.el.kits.querySelectorAll('.kit.selected');
			if (el.classList.contains('selected') === true) {
				if (selected.length > 0) {
					_this.el.content.classList.remove('show');
				} else {
					_this.el.curtain.classList.add('show');
				}
			} else {
				if (selected.length > 0) {
					_this.el.content.classList.add('show');
				} else {
					_this.el.curtain.classList.remove('show');
				}
			}
		});
	},

	/* el = .togglePlay */
	togglePlay: function (el) {
		var children;

		el.classList.toggle('selected');
		children = el.querySelectorAll('img');
		children[0].classList.toggle('hide');
		children[1].classList.toggle('hide');

		if (this.isPlaying === false) {
			this.metronome.postMessage({cmd: 1, ms: this.BPMtoMS(this.el.bpm.value)});
			this.isPlaying = true;
		} else {
			this.metronome.postMessage({cmd: 0});
			this.isPlaying = false;
			this.stopSequences();
			this.clearHighlighted();
			this.oldIndex = 0;
			this.newIndex = 0;
		}
	},

	/* el = .toggleRepeat */
	toggleRepeat: function (el) {
		var children;

		this.repeat = !this.repeat;
		el.classList.toggle('selected');
		children = el.querySelectorAll('img');
		children[0].classList.toggle('hide');
		children[1].classList.toggle('hide');
	},

	/* el = .toggleBPM */
	toggleBPM: function (el) {
		/* Show BPM. */
		el.classList.toggle('selected');
		this.el.bpmslider.classList.toggle('show');
	},

	/* .el = input[name="bpm"] */
	updateBPM: function (el) {
		this.el.footer.querySelector('.toggleBPM').innerText = el.value;
		this.metronome.postMessage({cmd: 1, ms: this.BPMtoMS(el.value)});
	},

	BPMtoMS: function (bpm) {
		return ((60000 / bpm) / 2.0);
	},

	/* Clear all .highlighted elements. */
	clearHighlighted: function () {
		var children, i, j;

		children = this.el.content.querySelectorAll('.highlighted, .muted');
		for (i = 0, j = children.length; i < j; ++i) {
			children[i].classList.remove('highlighted');
			children[i].classList.remove('muted');
		}
	}
};