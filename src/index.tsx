import ReactDom from 'react-dom';

function App() {
    console.log('!!', process.env.KD_GIT_BRANCH);
    return <p>ok</p>;
}

window.addEventListener('load', () => {
    ReactDom.render(<App />, document.getElementById('root'));
});

console.log('sadass');
