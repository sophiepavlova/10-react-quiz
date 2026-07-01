import { useEffect, useReducer } from 'react';
// import DateCounter from './DateCounter.js';
import Main from './Main.js';
import Header from './Header.js';
import Loader from './Loader.js';
import Error from './Error.js';
import StartScreen from './StartScreen.js';

const initialState = {
  questions: [],
  //"loading", 'error', 'ready', 'active', 'finished'
  status: 'loading',
};
function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return { ...state, questions: action.payload, status: 'ready' };
    case 'dataFailed':
      return { ...state, status: 'error' };
    default:
      throw new Error('Action is unknown');
  }
}

export default function App() {
  // const [state, dispatch] = useReducer(reducer, initialState);
  const [{ questions, status }, dispatch] = useReducer(reducer, initialState);
  const numQuestions = questions.length;

  useEffect(function () {
    fetch('http://localhost:8000/questions')
      .then((res) => res.json())
      .then((data) => dispatch({ type: 'dataReceived', payload: data }))
      .catch((err) => dispatch({ type: 'dataFailed' }));
  }, []);
  return (
    <div className='app'>
      <Header />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && <StartScreen numQuestions={numQuestions} />}
      </Main>
    </div>
  );
}
