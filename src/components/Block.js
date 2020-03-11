import * as React from "react";
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import { resolveProductByName } from "../services/products";
import '../assets/block.css';

const StockIndicator = withStyles({})(LinearProgress);

export class Block extends React.Component {
    constructor(props) {
        super(props);

        const { drink } = props;
        const initialState = {};
        for (const additive of drink.additives) {
            initialState[additive.name] = false;
        }
        this.state = initialState;
    }

    handleSubmit = (event) => {
        event.preventDefault();

        const { onSubmitOffer, drink } = this.props;
        const additives = [];
        for (const additiveName in this.state) {
            if (this.state.hasOwnProperty(additiveName) && this.state[additiveName] === true) {
                additives.push(resolveProductByName(additiveName));
            }
        }
        onSubmitOffer && onSubmitOffer(drink, additives);
        this.clearInputs();
    };

    handleChange(event, key) {
        this.setState({
            [key]: event.target.checked
        });
    }

    clearInputs() {
        // Clear the inputs
        const { drink } = this.props;
        for (const additive of drink.additives) {
            this.setState({ [additive.name]: false });
        }
    }

    render() {
        const { percent, drink } = this.props;

        return <div className="block-container">
            <div className="stock-indicator-container">
                <StockIndicator variant="determinate" value={percent} className="progress" />
            </div>
            <div className="block-tile">
                <form onSubmit={this.handleSubmit}>
                    <div className="block-labels">
                        {drink.additives.map((additive, index) => (
                            <div key={additive.name} className="block-label">
                                <label>
                                    {additive.name.toUpperCase()}
                                </label>
                                <Switch
                                    checked={this.state[additive.name]}
                                    onChange={(event) => this.handleChange(event, additive.name)}
                                    value={true}
                                    color="primary"
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                />
                            </div>
                        ))}
                    </div>
                    <Button variant="contained" color="primary" id={drink.name + "-button"} type="submit" className="block-button">
                        {drink.name}
                    </Button>
                </form>
            </div>
        </div>;
    }
}
