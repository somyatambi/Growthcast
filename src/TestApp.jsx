import React, { useState } from 'react';

function TestApp() {
  return (
    <div className="min-h-screen bg-red-500">
      <h1 className="text-white text-4xl p-8">TEST - If you see this, React is working!</h1>
      <div className="bg-green-500 p-8 m-8">
        <p className="text-black text-2xl">Green box test</p>
      </div>
      <div className="bg-white p-8 m-8">
        <p className="text-black text-2xl">White box test</p>
      </div>
    </div>
  );
}

export default TestApp;
