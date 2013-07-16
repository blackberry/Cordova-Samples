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

/*global self */

self.timeout = 0;

self.addEventListener('message', function (e) {
	if (e.data.cmd === 1) {
		self.ms = e.data.ms;
		if (self.timeout === 0) {
			self.timeout = setTimeout(self.tick, self.ms);
		}
	} else {
		clearTimeout(self.timeout);
		self.timeout = 0;
	}
}, false);

self.tick = function () {
	self.timeout = setTimeout(self.tick, self.ms);
	self.postMessage();
};