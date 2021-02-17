import { initWeglot } from './components';
import * as params from '@params';

(function() {
	// This will be loaded before body end.
	initWeglot(params.weglot_api_key);
})();
