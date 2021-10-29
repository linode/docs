import { Query } from './query';

export enum SearchGroupIdentifier {
	Main = 1,
	AdHoc
}

interface Request {
	facetFilters: string[];
	filters: string;
	indexName: string;
	params: string;
}

interface Result {
	hits: Record<string, any>[];
	facets: Record<string, Record<string, number>>;
	nbHits: number;
	nbPages: number;
	hitsPerPage: number;
	page: number;
	index: string;
	params: string;
}

interface RequestCallback {
	request: Request;
	callback(result: Result): void;
	pronto: boolean;
}

export enum RequestCallBackStatus {
	Off,
	On,
	Once
}

interface RequestCallBackFactory {
	status(): RequestCallBackStatus;
	create(query: Query): RequestCallback;
}

interface RequestCallBackFactoryTarget {
	factory: RequestCallBackFactory;
	target: SearchGroupIdentifier;
}

export const newRequestCallbackFactories = function(): RequestCallBackFactory[] {
	return [];
};

export const newRequestCallback = function(
	request: Request,
	callback: (result: Result) => void,
	pronto?: boolean
): RequestCallback {
	return {
		request: request,
		callback: callback,
		pronto: pronto
	};
};

export const newRequestCallbackFactoryTarget = function(
	factory: RequestCallBackFactory,
	target: SearchGroupIdentifier
): RequestCallBackFactoryTarget {
	return {
		factory: factory,
		target: target
	};
};
