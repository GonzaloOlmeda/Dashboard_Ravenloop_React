

import './App.css'
import Sidebar from './componentes/sidebar';

function App() {

  return (
    
     <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-blue-200 flex items-center justify-center">
        <h1>Content</h1>
      </div>
     </div>
        
  
  );
}

export default App
