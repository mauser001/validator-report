import React from 'react';
import "./ReportBox.css"
import ValidatorBox from "./components/validatorBox/ValidatorBox";

class ReportBox extends React.Component {

	renderValidorBoxes(validators) {
		return validators.map((val, index) => {
			return <ValidatorBox key={index} data={val}></ValidatorBox>;
		});
	}

	checkDateClass(ts) {
		var div = new Date().getTime() - new Date(ts).getTime();
		return "date " + (div > 60000 ? " expired" : "");
    }

	render() {
		return (
			<div>
				<div className="header">
					<span className="report-label" >{this.props.data.Label}</span>
					<span>Last updated: </span>
					<span className={this.checkDateClass(this.props.data.TS)} > {new Date(this.props.data.TS).toLocaleString()}</span>
				</div>
				<div>
					{this.renderValidorBoxes(this.props.data.Validators)}
				</div>
			</div>
		);
	}
}
export default ReportBox;
