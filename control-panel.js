import React, {PureComponent} from 'react';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFastBackward,faBackward,faPause,faPlay,faCircle,faForward,faFastForward } from '@fortawesome/free-solid-svg-icons'

const defaultContainer =  ({children}) => <div className="control-panel">{children}</div>;

export default class ControlPanel extends PureComponent {
  pauseAnimation() {
    this.props._pauseAnimation();
  }
  startAnimation(speed) {
    this.props._startAnimation(speed);
  }
  updateTime(time) {
    this.props._updateTime(time);
  }

  render() {
    const Container = this.props.containerComponent || defaultContainer;
    const {settings} = this.props;
    return (
      <Container>
        <div key={name} className="input">
          <button className="panelButton" onClick={() => this.startAnimation(-20)}>
          <FontAwesomeIcon icon={faFastBackward} />
          </button>
          <button className="panelButton" onClick={() => this.startAnimation(-4)}>
          <FontAwesomeIcon icon={faBackward} />
          </button>
          <button className="panelButton" onClick={() => settings.animating ? this.pauseAnimation() : this.startAnimation(2)}>
          {settings.animating ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} /> }
          </button>
          <button className="panelButton" onClick={() => this.startAnimation(8)}>
          <FontAwesomeIcon icon={faForward} />
          </button>
          <button className="panelButton" onClick={() => this.startAnimation(20)}>
          <FontAwesomeIcon icon={faFastForward} />
          </button>
          <span className="controlPanelSpan"> {settings.animationSpeed}X</span>
          <input type="text" size="8" value={moment(settings.time*1000).utc().format('HH:mm:ss')} 
          onChange={(evt) => 
            this.updateTime(parseInt(evt.target.value.split(':')[0] * 3600) + 
              parseInt(evt.target.value.split(':')[1] * 60) + 
              parseInt(evt.target.value.split(':'[2])))}
          onFocus={this.pauseAnimation}/>
          <input className="slider" type="range" value={settings.time}
            min={settings.startTime} max={settings.endTime} step={60}
            onChange={(evt) => {
              this.updateTime(parseInt(evt.target.value));
            }
          } />
        </div>
      </Container>
    );
  }
}