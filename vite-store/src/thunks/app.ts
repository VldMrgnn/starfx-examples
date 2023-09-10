import { takeEvery } from "starfx/store";
import { updateStore } from "starfx/store";
import { db, thunks } from "../api";

import { Next } from "starfx";
import { ThunkCtx } from "../types";

export const setWinUser2 = thunks.create<string>(
	"thunks/setWinUser2",
	{supervisor: takeEvery},
	function* (ctx:ThunkCtx, next:Next) {
		yield* updateStore(db.app.patch({key: 'winUser', value: ctx.payload}));
		yield* next(); 
	}
);

