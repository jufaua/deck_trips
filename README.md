Standalone implementation of the deck.gl trips layer, with minimal playback controls.

## Usage

### Mapbox

To see the base map, you need a [Mapbox access token](https://docs.mapbox.com/help/how-mapbox-works/access-tokens/). This token should be set in config.json file, as well as other settings that will help control playback (like min/max time values)

### Installing and launching

Using your favorite package manage, either

```bash
npm install
```

```bash
yarn
```

And then, launching with

```bash
npm start
```

### Data format

The expected data format closely ressembles the one in the [deck.gl example folder](https://github.com/uber-common/deck.gl-data/blob/master/examples/trips/trips.json). To provide slightly more versatility, colors are expected to be stored inside the trips file. One trip should look like the following :

```json
{
  "color":[0,179,0],
  "segments":[
    [-73.53498,45.59714,19800.0],
    [-73.53541,45.59641,19808.3],
    ["..."]
  ]
}
```

With every array of segment reprenting the longitude, latitude, and time value. Expected values of time are seconds since time 0 (commonly the beginning of the day), but any value should also work as long as the startTime and endTime values are set appropriately in config.json.
