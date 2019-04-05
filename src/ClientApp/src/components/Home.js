import React, { Component } from 'react';

export class Home extends Component {
  displayName = Home.name

  render() {
    return (
      <div>
        <h1>Worldwide Volunteering Directory</h1>
        <p>Welcome to our worldwide volunteering register.</p>

        <p>This project is based on:</p>
        <ul>
          <li><a href='https://get.asp.net/'>ASP.NET Core</a> and <a href='https://msdn.microsoft.com/en-us/library/67ef8sbd.aspx'>C#</a> for cross-platform server-side code</li>
          <li><a href='https://facebook.github.io/react/'>React</a> for client-side code</li>
          <li><a href='http://getbootstrap.com/'>Bootstrap</a> for layout and styling</li>
          <li><a href='https://docs.microsoft.com/en-us/azure/cosmos-db/mongodb-introduction'>Cosmos DB</a> for data storage</li>
        </ul>

        <p>Project source code @ <a href='https://github.com/TomGeske/Volunteering' target="_blank">GitHub</a> </p>
        <p>REST API<a href='/swagger/' target="_blank"> Swagger</a> </p>
      </div>
    );
  }
}
