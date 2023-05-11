import React from 'react';
import './App.css';
import ReactDOM from 'react-dom';
import RouterCompornent from './compornents/router';
import { Login } from './compornents/login';


const App: React.FC = () => {
  
  const items = Object.values(1)

  return (
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card">
                <div>
                  <Login/>      
                  <RouterCompornent setStateProp={items} />
                  {/* <DrawTable setStateProp ={items2} /> */}
                </div>
            </div>
          </div>
      </div>
    </div>
  )
}

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

export default App;

try{
  if (document.getElementById('App')) {
      const Index = ReactDOM.createRoot(document.getElementById("App"));
      const element = document.getElementById('example')
      //const props = JSON.parse(element.dataset.props)

      Index.render(
          <React.StrictMode>
              <App {...props}/>
          </React.StrictMode>
      )
}}catch(e){
      console.log(e)
}