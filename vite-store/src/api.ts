import {
  createPipe,
  errorHandler,
} from "starfx";
import { createApi, fetcher, requestMonitor } from "starfx";
import { takeEvery, storeMdw} from 'starfx/store';
import { createSchema } from 'starfx/store';
import { slice } from 'starfx/store';
import { appRepo } from './slices/app';
import { updateStore } from 'starfx/store';
import type { Next } from 'starfx';
import type { ThunkCtx } from './types';

interface User {
  id: string;
  name: string;
}

const emptyUser = { id: "", name: "" };
export const schema = createSchema({
  users: slice.table({ empty: emptyUser }),
  app: slice.obj(appRepo.initialState),
  data: slice.table({ empty: {} }),
  loaders: slice.loader(),
});
export type AppState = typeof schema.initialState;
export const db = schema.db;

export const api = createApi();
api.use(requestMonitor());
api.use(storeMdw(db));
api.use(api.routes());
api.use(fetcher({ baseUrl: 'https://jsonplaceholder.typicode.com' }));

export const thunks = createPipe<ThunkCtx>();
thunks.use(errorHandler);
thunks.use(thunks.routes());

export const fetchUsers = api.get<never, User[]>(
  '/users',
  { supervisor: takeEvery },
  function*(ctx, next) {
    yield* next();
    if (!ctx.json.ok) {
      return;
    }

    const users = ctx.json.data.reduce<Record<string, User>>((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});
    yield* schema.update(db.users.add(users));
  },
);


export const setWinUser = thunks.create<string>(
	"thunks/setWinUser",
	{supervisor: takeEvery},
	function* (ctx:ThunkCtx, next:Next) {
		// note: if we define the schema as follows:
		// [appRepo.name]: slice.obj(appRepo.initialState) we get ts error below: Property 'patch' does not exist on type 'TableOutput .....
		yield* updateStore(db.app.patch({key: 'winUser', value: ctx.payload}));
		yield* next(); 
	}
)