import React from 'react';
 
export default class GMap extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      zoom: 10,
      initialCenter: { lng: -90.1056957, lat: 29.9717272 },
      newCoodinates: { lng: '', lat: '' } 
    };
  };

  findGeolocation() {
    // var map = new google.maps.Map(document.getElementById('map'), {
    //   center: {lat: -34.397, lng: 150.644},
    //   zoom: 6
    // });

    // var infoWindow = new google.maps.InfoWindow({map: map});

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        console.log("Hey not sure what my loc is");
        // this.setState({
        //   initialCenter: {
        //     lat: position.coords.latitude,
        //     lng: position.coords.longitude
        //   }
        // })

        // infoWindow.setPosition(this.state.initialCenter);
        // infoWindow.setContent('Location found.');
        // map.setCenter(this.state.initialCenter);
      }, function() {
        // handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      // handleLocationError(false, infoWindow, map.getCenter());
    }
    // function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    //   infoWindow.setPosition(pos);
    //   infoWindow.setContent(browserHasGeolocation ?
    //     'Error: The Geolocation service failed.' :
    //     'Error: Your browser doesn\'t support geolocation.');
    // }
  }
  
  createUserMarker(e) {
    this.setState({
      newCoodinates: {
        lng: e.latLng.lng(),
        lat: e.latLng.lat()
      }
    })
    // pass this state to createNewMarker constructor
    this.createNewMarker(this.newCoodinates);
  }

  // this is just a prop validator
  // static propTypes() {
  //   initialCenter: React.PropTypes.objectOf(React.PropTypes.number).isRequired
  // }

  render() {
    return <div className="GMap">
      <div className="UpdatedText">
        <p>Current Zoom: { this.state.zoom }</p>
      </div>
      <div className='GMap-canvas' ref="mapCanvas" />
      </div>
  }

  componentDidMount() {
    // create the map, marker and infoWindow after the component has
    // been rendered because we need to manipulate the DOM for Google =(
    this.map = this.createMap()
    this.marker = this.createMarker()
    this.infoWindow = this.createInfoWindow()
  
    this.geolocation = this.findGeolocation()
    // have to define google maps event listeners here too
    // because we can't add listeners on the map until its created
    // event handlers should be bound within the constructor eg. this.handler.bind(this)
    // () => this.handler() is the same as .bind(this) ((now you can refer elsewhere to just this.handler))
    // binding event handlers are bound once for every instance
    google.maps.event.addListener(this.map, 'zoom_changed', ()=> this.handleZoomChange())
    google.maps.event.addListener(this.map, 'click', (event)=> this.createUserMarker(event))
  }

  // clean up event listeners when component unmounts
  componentDidUnMount() {
    google.maps.event.clearListeners(map, 'zoom_changed')
  }

  createMap() {
    let mapOptions = {
      zoom: this.state.zoom,
      center: this.mapCenter()
    }
    return new google.maps.Map(this.refs.mapCanvas, mapOptions)
  }

  mapCenter() {
    return new google.maps.LatLng(
      this.state.initialCenter.lat,
      this.state.initialCenter.lng
    )
  }

  newMapCenter() {
    console.log(this.state.newCoodinates);
    return new google.maps.LatLng(
      this.state.newCoodinates.lat,
      this.state.newCoodinates.lng
    )
  }

  createMarker() {
    return new google.maps.Marker({
      position: this.mapCenter(),
      map: this.map
    })
  }

  createNewMarker() {
    return new google.maps.Marker({
      position: this.newMapCenter(),
      map: this.map
    })
  }

  createInfoWindow() {
    let contentString = "<div class='InfoWindow'>I'm a Window that contains Info Yay</div>"
    return new google.maps.InfoWindow({
      map: this.map,
      anchor: this.marker,
      content: contentString
    })
  }
  
  handleZoomChange() {
    this.setState({
      zoom: this.map.getZoom()
    })
  }
}

export class Container extends React.Component {
  render() {
    const style = {
      width: '100vw',
      height: '100vh'
    }
    const pos = {lat: 37.759703, lng: -122.428093}
    return (
      <div style={style}>
        <Map google={this.props.google}>
          <Marker />
          <Marker position={pos} />
        </Map>
      </div>
    )
  }
}

export class Map extends React.Component {
  renderChildren() {
    const {children} = this.props;

    if (!children) return;

    return React.Children.map(children, c => {
      return React.cloneElement(c, {
        map: this.map,
        google: this.props.google,
        mapCenter: this.state.currentLocation
      });
    })
  }

  render() {
    return (
      <div ref='map'>
        Loading map...
        {this.renderChildren()}
      </div>
    )
  }
}
// defining PropTypes is a way to validate prop values, its only checked in development mode
Map.PropTypes = {
  google: React.PropTypes.object,
  zoom: React.PropTypes.number,
  initialCenter: React.PropTypes.object
}

const evtNames = ['click', 'mouseover'];



export class Marker extends React.Component {
  render() {
      return null;
    }
  componentDidUpdate(prevProps) {
    if ((this.props.map !== prevProps.map) ||
      (this.props.position !== prevProps.position)) {
        // The relevant props have changed
    }
  }
  renderMarker() {  
   let {
      map, google, position, mapCenter
    } = this.props;

    let pos = position || mapCenter;
    position = new google.maps.LatLng(pos.lat, pos.lng);

    const pref = {
      map: map,
      position: position
    };
    this.marker = new google.maps.Marker(pref);

    evtNames.forEach(e => {
      this.marker.addListener(e, this.handleEvent(e));
    })
  }
  handleEvent(evtName) {
    return (e) => {
      const evtName = `on${camelize(evt)}`
      if (this.props[evtName]) {
        this.props[evtName](this.props, this.marker, e);
      }
    }
  }
}

Marker.propTypes = {
  position: React.PropTypes.object,
  map: React.PropTypes.object
}