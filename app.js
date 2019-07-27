/* global window */
import React, {Component} from 'react';
import {render} from 'react-dom';
import {StaticMap} from 'react-map-gl';
import {PhongMaterial} from '@luma.gl/core';
import {AmbientLight, PointLight, LightingEffect} from '@deck.gl/core';
import DeckGL from '@deck.gl/react';
import {PolygonLayer} from '@deck.gl/layers';
import {TripsLayer} from '@deck.gl/geo-layers';
import config from './config.json';

// Set your mapbox token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

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
      time: 0
    };
  }

  componentDidMount() {
    this._animate();
  }

  componentWillUnmount() {
    if (this._animationFrame) {
      window.cancelAnimationFrame(this._animationFrame);
    }
  }

  _animate() {
    const {
      loopLength = 1800, // unit corresponds to the timestamp in source data
      animationSpeed = 30 // unit time per second
    } = this.props;
    const timestamp = Date.now() / 1000;
    const loopTime = loopLength / animationSpeed;

    this.setState({
      time: (((timestamp % loopTime) / loopTime) * loopLength) + 25000
    });
    this._animationFrame = window.requestAnimationFrame(this._animate.bind(this));
  }

  _renderLayers() {
    const {trips = trips = DATA_URL.TRIPS, trailLength = 180} = this.props;

    return [
      new TripsLayer({
        id: 'trips',
        data: trips,
        getPath: d => d.segments,
        getColor: d => (d.vendor === 0 ? [253, 128, 93] : [23, 184, 190]),
        opacity: 0.3,
        widthMinPixels: 2,
        rounded: true,
        trailLength,
        currentTime: this.state.time
      })
    ];
  }

  render() {
    const {viewState, mapStyle = 'mapbox://styles/mapbox/dark-v9'} = this.props;

    return (
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
    );
  }
}

export function renderToDOM(container) {
  render(<App />, container);
}
