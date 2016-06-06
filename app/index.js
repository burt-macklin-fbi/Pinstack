var React = require('react');
var ReactDOM = require('react-dom');

import GMap from './Component';

var App = React.createClass({
  render: function() {
    return <GMap initialCenter={initialCenter} />;
  }
});

var initialCenter = { lng: -90.1056957, lat: 29.9717272 }

ReactDOM.render(
	<div>
		<App>
			<GMap initialCenter={initialCenter} />
		</App>
	</div>,
	document.querySelector('#app')
);
