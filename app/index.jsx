import React from 'react';
import {render} from 'react-dom';

import Component from './component';

class App extends React.Component {
  render () {
    return Component;
  }
}

ReactDOM.render(
	<div>
		<App />
		Hi THere
	</div>,
	document.querySelector('#app')
);
