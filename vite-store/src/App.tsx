import './App.css';

import { useDispatch, useSelector } from 'starfx/react';
// import { updateStore } from 'starfx/store';

import { AppState, db, fetchUsers, setWinUser } from './api.ts';
import { currentUser, setWinUser2 } from './thunks/app.ts';

function App({ id }: { id: string }) {
  const dispatch = useDispatch();
  const theUser = useSelector(currentUser);
  const user = useSelector((s: AppState) => db.users.selectById(s, { id })) 
  const userList = useSelector(db.users.selectTableAsList) as any[];
  return (
    <div>
      <div>
        <button onClick={() => dispatch(setWinUser("A"))}>
          <code>A</code>
        </button>
      </div>
      <div>
        <button onClick={() =>{
          // ths ok:
           dispatch(setWinUser2("B"))
          // but this is not:
          // cannot dispatch to store directly
          // window.fx.dispatch(db.app.update({ key: 'winUser', value: 'B' }))
          }}>
          <code>B</code>
        </button>
      </div>
      <div><code>Now selected&nbsp;</code><code style={{'color':'yellowgreen'}}>{theUser}</code></div>
      <br/>
      <div>hi there, {user.name}</div>
      <button onClick={() => dispatch(fetchUsers())}>Fetch users</button>
      {userList.map((u) => {
        return <div key={u.id}>({u.id}) {u.name}</div>
      })}
    </div>
  );
}

export default App;
