import React from 'react';
import "./Main.css"
import ReportBox from "./components/reportBox/ReportBox";

class Main extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: undefined,
			error: undefined
		};
	}

	loadData = () => {
		setTimeout(this.loadData, 10000);
		fetch(this.getPath()).then(response => {
			response.json().then(parsed => {
				this.setState(state => ({data: parsed}));
			})
		}, error => {
			this.setState(state => ({error: error}));
		});

	};

	getPath() {
		return document.location.hostname === "localhost" ? "http://localhost:8010/loadReport.php" : "./php/loadReport.php";
    }

	renderReport(data) {
		return data.map((reportData, index) => {
			return <ReportBox key={index} data={reportData}></ReportBox>
		});
	}

	componentDidMount() {		
		this.loadData();
	}

	render() {
		return (<div>
			{
				this.state.data
					? this.renderReport(this.state.data)
					: this.state.error ?
						this.state.error :
						'Data could not be loaded!'
			}
		</div>);
	}
}
export default Main;
