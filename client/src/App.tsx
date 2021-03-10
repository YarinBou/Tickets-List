import React from 'react';
import './App.scss';
import { createApiClient, Ticket } from './api';
import { TicketCont } from './components/TicketCont/TicketCont';

export type AppState = {
	tickets: Ticket[],
	pinnedTickets: Ticket[];
	search: string;
	mode: string;
	page: number;
	orderBy: string;
}

const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {

	state: AppState = {
		search: '',
		pinnedTickets: [],
		tickets: [],
		mode: 'darkMode',
		page: 1,
		orderBy: 'None',
	}

	searchDebounce: any = null;

	async componentDidMount() {
		this.setState({
			tickets: await api.getTickets(this.state.search, this.state.page, this.state.orderBy)
		});
	}

	//  pin to top the tickets from view.

	onPinChange = (pinned: any) => {

		let index = this.state.tickets.indexOf(pinned);
		if (index !== -1) {
			this.setState({
				pinnedTickets: this.state.pinnedTickets.concat([pinned]),
				tickets: this.state.tickets.filter(element => element !== pinned)
			});
		} else {
			this.setState({
				tickets: this.state.tickets.concat([pinned]),
				pinnedTickets: this.state.pinnedTickets.filter(element => element !== pinned)
			});
		}
	}

   // A change to Dark Mode and vice versa

	onThemeChange = () => {
		if (this.state.mode === 'darkMode') {
			this.setState({
				mode: 'lightMode'
			});
		} else {
			this.setState({
				mode: 'darkMode'
			});
		}
	}

	// Switch between pages

	nextPage = async () => {
		if (this.state.page === 11){
			return;
		}
		this.setState({
			page: this.state.page + 1,
			tickets: await api.getTickets(this.state.search, this.state.page + 1, this.state.orderBy)
		});
		this.forceUpdate();
	}

	previousPage = async () => {
		if (this.state.page === 1){
			return;
		}
		this.setState({
			page: this.state.page - 1,
			tickets: await api.getTickets(this.state.search, this.state.page - 1., this.state.orderBy)
		});
		this.forceUpdate();
	}

	// Sorted by different categories

	orderBy = async (e: any) => {
		this.setState({
			orderBy: e.target.value,
			tickets: await api.getTickets(this.state.search, this.state.page, e.target.value)
		});
		this.forceUpdate();
	}

	renderTickets = (tickets: Ticket[]) => {

		const filteredTickets = tickets
			.filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(this.state.search.toLowerCase()));

    //TicketCont = Component for the container of tickets
		return (<ul className='tickets'>
			{filteredTickets.map((ticket) => (<li key={ticket.id} className='ticket'>
				<TicketCont title={ticket.title} content={ticket.content} userEmail={ticket.userEmail}
					creationTime={ticket.creationTime} onPinChange={this.onPinChange} ticketObj={ticket} mode={this.state.mode} pinnedTickets={this.state.pinnedTickets}></TicketCont>
			</li>))}
		</ul>);
	}

	onSearch = async (val: string, newPage?: number) => {
		clearTimeout(this.searchDebounce);

		this.searchDebounce = setTimeout(async () => {
			this.setState({
				search: val,
				tickets: await api.getTickets(val, this.state.page, this.state.orderBy),
				page: this.state.page
			});
		}, 300);
	}



	render() {
		const { tickets } = this.state;
		const { pinnedTickets } = this.state;
		let currentMode = this.state.mode === 'lightMode' ? 'lightMode' : 'darkMode';
		return (
			<div className={currentMode}>
				<main className={currentMode}>
					<h1>Tickets List</h1>
					<header className={currentMode}>
						<input className={currentMode} type="search" placeholder="Search..." onChange={(e) => { this.onSearch(e.target.value); }} />
					</header>
					<button onClick={this.onThemeChange}>{this.state.mode === 'lightMode'? 'Dark Mode' :'Light Mode'}</button>
					<button id='NextBtn' onClick={this.nextPage}>Next Pages</button>
					<button id='PreviousBtn' onClick={this.previousPage}>Previous Page</button>
					<p className='page'>Page {this.state.page}</p>
					<p>Order by:</p>
					<div onChange={this.orderBy}>
						<input type="radio" value="Date" name="orderBy" /> Date
						<input type="radio" value="Title" name="orderBy" /> Title
						<input type="radio" value="ID" name="orderBy" /> ID
						<input type="radio" value="None" name="orderBy" defaultChecked /> None
					</div>
					<br></br>
					{pinnedTickets ? <div className={{ currentMode } + 'results'}>Showing Pinned Tickets {pinnedTickets.length} results</div> : null}
					{pinnedTickets ? this.renderTickets(pinnedTickets) : null}
					{tickets ? <div className={{ currentMode } + 'results'}>Showing {tickets.length} results</div> : null}
					{tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}
					<br></br>
					<button onClick={this.onThemeChange}>Dark/Light Mode</button>
					<button id='NextBtn' onClick={this.nextPage}>Next Pages</button>
					<button id='PreviousBtn' onClick={this.previousPage}>Previous Page</button>
					<p className='page'>Page {this.state.page}</p>
				</main>
			</div>
		)
	}
}

export default App;