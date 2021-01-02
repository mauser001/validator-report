import React from 'react';
import "./ValidatorBox.css"

class ValidatorBox extends React.Component {

	getBoxClassName(data) {
		/**
		* Validator States
		*   UnknownStatus,
		*	Deposited,
		*	Pending,
		*	Active,
		*	Exiting,
		*	Slashing,
		*	Exited,
		*	Invalid 
		* */
		return data.StateText.toLowerCase() + (data.CorrectlyVoted ? " voted" : " not-voted");
    }

	render() {
		return (
			<div className={'validator-box ' + this.getBoxClassName(this.props.data)}>
				<div>
					Current effective balance: <span className="value">{this.props.data.CurrentEffectiveBalance}</span>
				</div>
				<div>
					Balance: <span className="value">{this.props.data.Balance}</span>
				</div>
				<div>
					State: <span className="state value">{this.props.data.StateText}</span>
				</div>
				<div>
					Inclusion distance: <span className="state value">{this.props.data.InclusionDistance}</span>
				</div>
				{this.props.data.CorrectlyVoted ?
					(<div>
						Correctly voted: <span className="vote value">yes</span>
					</div>) :
					(
						<div>
							<div>
								Correctly voted target: <span className="vote value">{this.props.data.CorrectlyVotedTarget ? 'yes' : 'no'}</span>
							</div>
							<div>
								Correctly voted source: <span className="vote value">{this.props.data.CorrectlyVotedSource ? 'yes' : 'no'}</span>
							</div>
							<div>
								Correctly voted head: <span className="vote value">{this.props.data.CorrectlyVotedHead ? 'yes' : 'no'}</span>
							</div>
						</div>
					)
				}
			</div>
		);
	}
}
export default ValidatorBox;
