import React from "react";
import { FiUsers, FiUserPlus } from "react-icons/fi";
import { useSelector } from "react-redux";
import {
	AppLayout,
	MyFriendsList,
	FriendRequestList,
	PeopleList,
} from "../../container";
import { Friend, AddFriend, FriendRequest } from "../../components";

import "./FriendsScreen.scss";

const FriendsScreen = () => {
	const users = useSelector(state => state.entities.users);

	return (
		<AppLayout>
			<div className="_friends">
				<div className="_friends__list _friends__list--me">
					<div className="_friends__header">
						<FiUsers />
						<h4>Friends</h4>
						<span>({users.friends.length})</span>
					</div>
					<div className="_friends__body">
						{users.friends.map((friend, idx) => (
							<Friend
								friend={friend}
								idx={idx}
								key={friend._id}
							/>
						))}
					</div>
				</div>
				<div className="_friends__list _friends__list--requests">
					<div className="_friends__header">
						<FiUserPlus />
						<h4>Friends Requests</h4>
						<span>({users.friendRequests.length})</span>
					</div>
					<div className="_friends__body">
						{users.friendRequests.map((friend, idx) => (
							<FriendRequest
								friend={friend}
								idx={idx}
								key={friend._id}
							/>
						))}
					</div>
				</div>
				<div className="_friends__list _friends__list--people">
					<div className="_friends__header">
						<FiUsers />
						<h4>People you should add</h4>
					</div>
					<div className="_friends__body">
						{users.people.map(friend => (
							<AddFriend 
								friend={friend} 
								key={friend._id}
							/>
						))}
					</div>
				</div>
			</div>
		</AppLayout>
	);
};

export default FriendsScreen;
