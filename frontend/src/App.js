import React from 'react';
import Header from './components/Header';
import ProductBox from './components/Product';

function App() {
  return (
    <div>
      <Header title="Products" />
      <div className="container-fluid">
        <br />
        <ProductBox />
      </div>
    </div>
  );
}

export default App;
