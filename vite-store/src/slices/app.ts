import { takeEvery } from "starfx/store";
import { updateStore } from "starfx/store";
import { db, thunks } from "../api";

import { Next } from "starfx";
import { ThunkCtx } from "../types";

export type TApp = {
	winUser: string;
	thisPath: string;
	term_visible: boolean;
	term_history: string[];
	stateViewer: boolean;
	monEditor: boolean;
	buildID?: number;
	sourcePath?: string;
  };

// this is a legacy structure
const REPO_NAME = "app";
const initialState: TApp = {
  winUser: "",
  thisPath: "",
  term_visible: true,
  term_history: [],
  stateViewer: true,
  monEditor: true,
};

export const appRepo = {
  name: REPO_NAME,
  initialState,
};


// if this is exported from here it will crash the app: Uncaught (in promise) ReferenceError: Cannot access 'thunks' before initialization

// for the error reproduction, uncomment this thunk:

// export const setWinUser3 = thunks.create<string>(
// 	"thunks/setWinUser2",
// 	{supervisor: takeEvery},
// 	function* (_ctx:ThunkCtx, next:Next) {
// 		yield* updateStore(db.app.patch({key: 'winUser', value: 'test2'}));
// 		yield* next(); 
// 	}
// );

