import React, {Component} from 'react';
import {render} from 'react-dom';
import {StaticMap} from 'react-map-gl';
import {PhongMaterial} from '@luma.gl/core';
import {AmbientLight, PointLight, LightingEffect} from '@deck.gl/core';
import DeckGL from '@deck.gl/react';
import {PolygonLayer} from '@deck.gl/layers';
import {TripsLayer} from '@deck.gl/geo-layers';
import config from './config.json';
import ControlPanel from './control-panel.js';
import FPSStats from 'react-stats-zavatta';

// Set your mapbox token here
const MAPBOX_TOKEN = config.mapboxToken; // eslint-disable-line

const ambientLight = new AmbientLight(config.lighting.ambientLight || {color: [255, 255, 255], intensity: 1.0} );

const pointLight = new PointLight(config.lighting.pointLight || {color: [255, 255, 255],intensity: 2.0,position: [-74.05, 40.7, 8000]} );

const lightingEffect = new LightingEffect({ambientLight, pointLight});

const material = new PhongMaterial(config.material || { ambient: 0.1, diffuse: 0.6, shininess: 32, specularColor: [60, 64, 70] });

const INITIAL_VIEW_STATE = config.mapConfig || {longitude: -73.6, latitude: 45.5, zoom: 10, pitch: 45, bearing: 0};

const DATA_URL = {
  TRIPS: config.dataPath
}

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buildings: null,
      trips: null,
      time: config.startTime,
      animating: false,
      animationSpeed: 2,
      startTime: config.startTime,
      endTime: config.endTime
    };

    this._pauseAnimation = this._pauseAnimation.bind(this);
    this._startAnimation = this._startAnimation.bind(this);
    this._updateTime = this._updateTime.bind(this);

  }

  componentDidMount() {
    this._startAnimation(this.state.animationSpeed);
  }

  componentWillUnmount() {
    if (this._animationFrame) {
      window.cancelAnimationFrame(this._animationFrame);
    }
  }

  _pauseAnimation() {
    this.setState({
      animating: false,
      animationSpeed: 0
    });
    if (this._animationFrame) {
      window.cancelAnimationFrame(this._animationFrame);
    }
  }

  _startAnimation(speed) {
    if (this._animationFrame) {
      window.cancelAnimationFrame(this._animationFrame);
    }
    if (this.state.time > config.endTime || this.state.time < config.startTime) {
      this._pauseAnimation();
      if (this.state.time < config.startTime) {
        this.setState({ time: config.startTime });
      } else {
        this.setState({ time: config.endTime });
      }
    } else {
      this.setState({
        time: this.state.time + speed,
        animating: true,
        animationSpeed: speed
      });
      this._animationFrame = window.requestAnimationFrame(this._startAnimation.bind(this, speed));
    }
    //this._animate();
  }

  _updateTime(time) {
    this._pauseAnimation();
    this.setState({
      time: time,
      animating: false
    });
  }


  _renderLayers() {
    const {trips = DATA_URL.TRIPS, trailLength = config.trailLength} = this.props;

    return [
      new TripsLayer({
        id: 'trips',
        data: trips,
        getPath: d => d.segments,
        getColor: d => d.color,
        opacity: 0.3,
        widthMinPixels: 2,
        rounded: true,
        trailLength,
        currentTime: this.state.time
      })
    ];
  }

  render() {
    const {viewState, mapStyle = config.mapboxStyle } = this.props;

    return (
      <div>
        <DeckGL
          layers={this._renderLayers()}
          effects={[lightingEffect]}
          initialViewState={INITIAL_VIEW_STATE}
          viewState={viewState}
          controller={true}
        >
          <StaticMap
            reuseMaps
            mapStyle={mapStyle}
            preventStyleDiffing={true}
            mapboxApiAccessToken={MAPBOX_TOKEN}
          />
        </DeckGL>
        <ControlPanel
          containerComponent={this.props.containerComponent}
          settings={this.state}
          onChange={this._updateSettings}
          _pauseAnimation={this._pauseAnimation}
          _startAnimation={this._startAnimation}
          _updateTime={this._updateTime}
        />
        <FPSStats isActive right='0' top='0' />
      </div>
    );
  }
}

export function renderToDOM(container) {
  render(<App />, container);
}
