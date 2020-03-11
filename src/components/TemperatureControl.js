import * as React from "react";
import OpacityIcon from '@material-ui/icons/Opacity';
import { withStyles } from '@material-ui/core/styles';
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import {TemperatureRepository} from "../services/storage-repository/TemperatureRepository";

const TemperatureSlider = withStyles({
    root: {
      height: 8,
    },
    thumb: {
      height: 16,
      width: 16,
      backgroundColor: '#fff',
      border: '2px solid currentColor',
      marginTop: -3,
      marginLeft: -12,
      '&:focus,&:hover,&$active': {
        boxShadow: 'inherit',
      },
    },
    active: {},
    valueLabel: {
      left: 'calc(-50% + 4px)',
    },
    track: {
      height: 8,
    },
    rail: {
      height: 8,
    },
  })(Slider);

export class TemperatureControl extends React.Component {
    temperatureRepository = new TemperatureRepository();

    constructor(props) {
        super(props);

        const {temperature} = this.props;

        this.state = {
            temperature: temperature
        };
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        // When the value of the control changes, update the new temperature into the local storage
        const { onTemperatureChange } = this.props;
        const { temperature } = this.state;
        onTemperatureChange(temperature, nextState.temperature);
    }

    handleSliderChange = (event, newValue) => {
        this.setState({temperature: Number(newValue)});
    };

    handleInputChange = event => {
        this.setState({temperature: (event.target.value === '' ? '' : Number(event.target.value))});
    };

    handleBlur = () => {
        if (this.temperatureRepository.getTemperature() < 0) {
            this.setState({temperature: 0});
        } else if (this.temperatureRepository.getTemperature() > 100) {
            this.setState({temperature: 100});
        }
    };

    render() {
        return <div className="temperature">
            <Typography id="input-slider" gutterBottom>
                Temperature in ℃
            </Typography>
            <div className="slide">

                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <OpacityIcon />
                    </Grid>
                    <Grid item xs>
                        <TemperatureSlider
                            value={this.state.temperature}
                            onChange={this.handleSliderChange}
                            aria-labelledby="input-slider"
                        />
                    </Grid>
                    <Grid item>
                        <Input
                            value={this.state.temperature}
                            placeholder="Temperature"
                            margin="dense"
                            className="temper-input"
                            onChange={this.handleInputChange}
                            onBlur={this.handleBlur}
                            inputProps={{
                                step: 1,
                                min: 0,
                                max: 100,
                                type: 'number',
                                'aria-labelledby': 'input-slider',
                                // style:{width:'50px'}
                            }}
                        />
                    </Grid>
                </Grid>
            </div>
        </div>
    }
}
