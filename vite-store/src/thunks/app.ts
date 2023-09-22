import { call, Next, run } from 'starfx';
// import {useScope} from "starfx";
import { createSelector, select, takeEvery, updateStore } from 'starfx/store';

import { db, thunks } from '../api';
import { ThunkCtx } from '../types';

const called = function* () {
	const ndata = yield* select(db.app.select);
	console.log('we set the user in nested called:', ndata.winUser);
}

const runed = function* () {
	const ndata = yield* select(db.app.select);
	console.log('we set the user in nested runed:', ndata.winUser);
}

const fxRunned = function* () {
	const ndata = yield* select(db.app.select);
	console.log('we set the user in nested fxRunned:', ndata.winUser);
}
export const currentUser = createSelector(db.app.select, (app) => app.winUser);
export const setWinUser2 = thunks.create<string>(
	"thunks/setWinUser2",
	{ supervisor: takeEvery },
	function* (ctx: ThunkCtx, next: Next) {
		yield* updateStore(db.app.update({ key: 'winUser', value: ctx.payload }));

		const data = yield* select(db.app.select);

		console.log('we set the user:', data.winUser);
		// const scope = useScope();
		const nested = function* () {
			const ndata = yield* select(db.app.select);
			console.log('we set the user in nested function:', ndata.winUser);
		}

		yield* call(() => nested())
		console.log('PASSES THE NESTED')
	
		yield* call(() => called());
		console.log('PASSES THE CALLED')
		
		yield* window.fx.run(() => fxRunned());
		console.log('PASSES THE FX RUNED')

		/* 
		- the following doesn't pass through.
		- it doesn't error visibly,
		- it locks the thunk for future use.
		*/
		yield* run(() => runed());
		console.log(`PASSES THE RUNED`)
		yield* next();
	}

);

/* 
It seems that run is a "no-go" for thunks.

If for some reason we intend to "run" function from the thunk we have to "fx" call it, which means that we reference the store.

Basically if you "run"  you lose context 'store'. And it swallows errors.
*/
