import React, { useState } from "react";
import { BrowserRouter as Router, NavLink } from "react-router-dom";
import { navLinks } from "../data";
import profile1 from "../assets/img/profiles/d3.jpg";
import profile2 from "../assets/img/profiles/d2.jpg";
import profile3 from "../assets/img/profiles/d1.jpg";
import { changeActiveLink } from "../contexts/actions/appActions";

import { useAppContext, useUsersContext } from "../contexts";

const LeftSide = () => {
	const { activeLink, dispatch } = useAppContext();
	const { friends, birthdays } = useUsersContext();

	const handleLinkChange = (id) => {
		changeActiveLink(id)(dispatch);
	};

	return (
		<div className="left-content">
			<div className="tabs">
				<h3 className="tabs__heading mt-1">Menu</h3>
				<div className="tabs__group">
					<NavLink
						exact={true}
						to="/"
						className={(isActive) =>
							isActive
								? "tabs__tab tabs__tab--active"
								: "tabs__tab"
						}
					>
						Home
					</NavLink>
					<NavLink
						to="/profile"
						className={(isActive) =>
							isActive
								? "tabs__tab tabs__tab--active"
								: "tabs__tab"
						}
					>
						Profile
					</NavLink>
					<NavLink
						to="/friends"
						className={(isActive) =>
							isActive
								? "tabs__tab tabs__tab--active"
								: "tabs__tab"
						}
					>
						Friends
						<span className="tabs__count">{`(${friends.length})`}</span>
					</NavLink>
					<NavLink
						to="/pages"
						className={(isActive) =>
							isActive
								? "tabs__tab tabs__tab--active"
								: "tabs__tab"
						}
					>
						Pages
						<span className="tabs__count">(12)</span>
					</NavLink>
				</div>
			</div>

			<div className="tabs">
				<h3 className="tabs__heading mt-2">
					Birthdays
					<span className="tabs__count">{`(${birthdays.length})`}</span>
				</h3>
				<div className="birthdays mt-1">
					{birthdays.length === 0 && <p className="birthdays__none">No Birthdays Today</p>}
					{birthdays.slice(0, 6).map((celebrant) => (
						<img
							src={celebrant.profileImage}
							alt="profile"
							className="birthdays__img"
						/>
					))}
					{birthdays.length - 6 > 0 && (
						<span className="birthdays__count">{`${
							birthdays.length - 6
						} more`}</span>
					)}
				</div>
			</div>
		</div>
	);
};

export default LeftSide;
