import './App.css';

// import Navbar from './Component/Navbar/Navbar'
import TableWithPagination from './Container/TableWithPagination/TableWithPagination'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {
  return (
    <div className="App">
      {/*<Navbar/>*/}
        <TableWithPagination/>
    </div>
  );
}

export default App;
