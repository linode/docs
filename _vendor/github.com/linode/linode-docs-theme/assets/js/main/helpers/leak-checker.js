export function leackChecker(Alpine) {
	weakRefs = new Set();
	weakSet = new WeakSet();

	return {
		selector: '[x-data]',
		active: 0,
		dirty: 0,

		add: function (el) {
			weakRefs.add(new WeakRef(el));
			weakSet.add(el);
		},

		listAllive: function () {
			this.dirty++;
			let allive = [];
			weakRefs.forEach((ref) => {
				let el = ref.deref();
				if (el !== undefined) {
					allive.push(`${el.localName}#${el.id}/${el.classList}`);
				}
			});
			return allive;
		},

		clear: function () {
			weakRefs.clear();
			this.active = 0;
			weakSet = new WeakSet();
		},

		trackComponents: function (selector = '[x-data]') {
			console.log(`Track Components for leak detection using selector ${selector}...`);

			document.body.querySelectorAll(selector).forEach((el) => {
				if (el.id === 'leack-checker' || el.hasAttribute('data-turbo-permanent')) {
					return;
				}
				this.add(el);
			});
		},

		replaceBody() {
			Alpine.deferMutations();
			let newBody = document.body.cloneNode(true);
			newBody.replaceChildren(this.$root.cloneNode(true));
			document.body.replaceWith(newBody);
			Alpine.flushAndStopDeferringMutations();
		},

		// Running Chrome with these flags will expose a gc() method that is very useful.
		// /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --js-flags="--expose-gc" --enable-memory-info
		runGC() {
			console.log('Run Garbage Collection...');
			if (!window.gc) {
				throw `window.gc() not available; you need to enable that in Chrome, e.g. /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --js-flags="--expose-gc" --enable-memory-info`;
			}
			window.gc();
			setTimeout(() => {
				console.log('Check Leaks...');
				this.active = this.listAllive().length;
				console.dir(weakSet);
			}, 2000);
		},
	};
}
