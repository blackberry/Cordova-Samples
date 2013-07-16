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

var Node = {
	STATUS_INACTIVE: 0,
	STATUS_READY: 1,

	el: null,
	status: 0,
	audio: null,
	tap: false,

	init: function () {
		this.status = Node.STATUS_INACTIVE;
		this.ontouchstart = this._ontouchstart.bind(this);
		this.ontouchmove = this._ontouchmove.bind(this);
		this.ontouchend = this._ontouchend.bind(this);
		return this;
	},

	render: function () {
		this.el = document.createElement('div');
		this.el.classList.add('node');
		this.el.addEventListener('touchstart', this.ontouchstart, false);
		this.el.addEventListener('touchmove', this.ontouchmove, false);
		this.el.addEventListener('touchend', this.ontouchend, false);

		return this.el;
	},

	_ontouchstart: function (evt) {
		this.tap = true;
	},

	_ontouchmove: function (evt) {
		if (this.tap === true) {
			this.tap = false;
		}
	},

	_ontouchend: function (evt) {
		if (this.tap === true) {
			this.toggleSelected(evt.currentTarget);
		}
	},

	toggleSelected: function (el) {
		if (this.status !== Node.STATUS_READY) {
			el.classList.add('ready');
			this.status = Node.STATUS_READY;
		} else {
			el.classList.remove('ready');
			this.status = Node.STATUS_INACTIVE;
		}
	}
};