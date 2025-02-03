import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import BlogList from "../components/BlogList";
import BlogShow from "../components/BlogShow";
import BlogEdit from "../components/BlogEdit";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import Navbar from "../components/Navbar";
import BlogCreate from "../components/BlogCreate";

document.addEventListener('DOMContentLoaded', () => {
	const container = document.createElement('div');
	document.body.appendChild(container);
	const root = ReactDOM.createRoot(container);

	root.render(
		<Router>
			<>
			<Navbar />
			<Switch>
				<Route exact path="/" component={BlogList} />
				<Route exact path="/blogs/new" component={BlogCreate} />
				<Route exact path="/blogs/:blogId" component={BlogShow} />
				<Route exact path="/blogs/:blogId/edit" component={BlogEdit} />
				<Route exact path="/users/sign_in" component={SignIn} />
				<Route exact path="/users/sign_up" component={SignUp} />
			</Switch>
	</>
	</Router>
);
});
