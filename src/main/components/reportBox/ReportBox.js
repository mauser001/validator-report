import React from 'react';
import "./ReportBox.css"
import ValidatorBox from "./components/validatorBox/ValidatorBox";

class ReportBox extends React.Component {

	renderValidorBoxes(validators) {
		if (!Array.isArray(validators)) {
			return null;
		}

		return validators.map((val, index) => {
			return <ValidatorBox key={index} data={val}></ValidatorBox>;
		});
	}

	checkDateClass(ts) {
		var div = new Date().getTime() - new Date(ts).getTime();
		return "date " + (div > 60000 ? " expired" : "");
    }

	hasValue(value) {
		return value !== undefined && value !== null && value !== "";
	}

	parseBoolean(value) {
		if (typeof value === "boolean") {
			return value;
		}

		if (typeof value === "string") {
			var normalized = value.trim().toLowerCase();
			if (normalized === "true") {
				return true;
			}
			if (normalized === "false") {
				return false;
			}
		}

		return undefined;
	}

	parseNumber(value) {
		if (typeof value === "number") {
			return Number.isFinite(value) ? value : undefined;
		}

		if (typeof value === "string") {
			var parsed = Number(value);
			return Number.isFinite(parsed) ? parsed : undefined;
		}

		return undefined;
	}

	getBeaconStatus(data) {
		var beaconHealthy = this.parseBoolean(data.BeaconHealthy);
		if (beaconHealthy !== undefined) {
			return beaconHealthy ? "healthy" : "unhealthy";
		}

		if (this.hasValue(data.BeaconHealth)) {
			var beaconHealthText = String(data.BeaconHealth).toLowerCase();
			if (beaconHealthText.indexOf("healthy") !== -1 || beaconHealthText.indexOf("ok") !== -1) {
				return "healthy";
			}

			if (beaconHealthText.indexOf("unhealthy") !== -1 || beaconHealthText.indexOf("error") !== -1 || beaconHealthText.indexOf("fail") !== -1) {
				return "unhealthy";
			}
		}

		return "unavailable";
	}

	getEth1Status(data) {
		var eth1Syncing = this.parseBoolean(data.Eth1Syncing);
		if (eth1Syncing !== undefined) {
			return eth1Syncing ? "syncing" : "synced";
		}

		if (this.hasValue(data.Eth1SyncState)) {
			var syncState = String(data.Eth1SyncState).toLowerCase();
			if (syncState.indexOf("sync") !== -1 && syncState.indexOf("ed") === -1) {
				return "syncing";
			}

			if (syncState.indexOf("sync") !== -1 || syncState.indexOf("ready") !== -1 || syncState.indexOf("ok") !== -1) {
				return "synced";
			}
		}

		return "unavailable";
	}

	getEth1Progress(data, eth1Status) {
		if (eth1Status !== "syncing") {
			return undefined;
		}

		var currentBlock = this.parseNumber(data.Eth1CurrentBlock);
		var highestBlock = this.parseNumber(data.Eth1HighestBlock);
		if (currentBlock === undefined || highestBlock === undefined || highestBlock <= 0) {
			return undefined;
		}

		var rawPercent = (currentBlock / highestBlock) * 100;
		var percent = Math.max(0, Math.min(100, rawPercent));
		var roundedPercent = Math.round(percent * 10) / 10;
		var percentText = Number.isInteger(roundedPercent) ? roundedPercent.toString() : roundedPercent.toFixed(1);
		return {
			currentBlock: currentBlock,
			highestBlock: highestBlock,
			percentText: percentText
		};
	}

	getControllerStatusText(data) {
		if (!this.hasValue(data.ControllerStatus)) {
			return "unavailable";
		}

		return String(data.ControllerStatus).trim();
	}

	renderControllerStatus(controllerStatusText) {
		if (controllerStatusText === "unavailable") {
			return <span className="status-value unavailable">unavailable</span>;
		}

		if (controllerStatusText.length <= 120) {
			return <span className="status-value controller-status">{controllerStatusText}</span>;
		}

		return (
			<details className="controller-status-details">
				<summary>{controllerStatusText.substring(0, 120)}...</summary>
				<div>{controllerStatusText}</div>
			</details>
		);
	}

	renderStatusSection(data) {
		var beaconStatus = this.getBeaconStatus(data);
		var eth1Status = this.getEth1Status(data);
		var eth1Progress = this.getEth1Progress(data, eth1Status);
		var controllerStatusText = this.getControllerStatusText(data);

		return (
			<div className="report-status">
				<div className="status-row">
					<span className="status-label">Beacon:</span>
					<span className={"status-value " + beaconStatus}>{beaconStatus}</span>
				</div>
				<div className="status-row">
					<span className="status-label">Eth1:</span>
					<span className={"status-value " + eth1Status}>{eth1Status}</span>
					{eth1Progress ? (
						<span className="eth1-progress">({eth1Progress.currentBlock}/{eth1Progress.highestBlock}, {eth1Progress.percentText}%)</span>
					) : null}
				</div>
				<div className="status-row controller-row">
					<span className="status-label">Controller:</span>
					{this.renderControllerStatus(controllerStatusText)}
				</div>
			</div>
		);
	}

	render() {
		var data = this.props.data || {};
		var labelText = data.Label || "Unknown";
		var versionText = data.Version || "";
		var hasVersion = this.hasValue(versionText);
		var tsText = this.hasValue(data.TS) ? new Date(data.TS).toLocaleString() : "unavailable";
		var tsClass = this.hasValue(data.TS) ? this.checkDateClass(data.TS) : "date";

		return (
			<div>
				<div className="header">
					<span className="report-label" >{hasVersion ? labelText + ": " + versionText : labelText}</span>
					<span>Last updated: </span>
					<span className={tsClass} > {tsText}</span>
					{this.renderStatusSection(data)}
				</div>
				<div>
					{this.renderValidorBoxes(data.Validators)}
				</div>
			</div>
		);
	}
}
export default ReportBox;
