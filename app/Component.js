import React from 'react';
 
export default class GMap extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      zoom: 10 
    };
  };

  
  createUserMarker(e) {
    this.initialCenter = {
      lng: e.latLng.lat(),
      lat: e.latLng.lng()
    }
    // console.log(this.initialCenter);

    this.createMarker(this.initialCenter);
  }

  // this is just a prop validator
  static propTypes() {
    initialCenter: React.PropTypes.objectOf(React.PropTypes.number).isRequired
  }

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

  mapCenter(e) {
    console.log(e);
    // new google.maps.LatLng(-34.397, 150.644)
    return new google.maps.LatLng(
      this.props.initialCenter.lat,
      this.props.initialCenter.lng
    )
  }

  createMarker(e) {
    // console.log(e);
    return new google.maps.Marker({
      position: this.mapCenter(e),
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