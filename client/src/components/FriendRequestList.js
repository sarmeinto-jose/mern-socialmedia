import React, {useEffect} from 'react';
import FriendRequestItem from './FriendRequestItem';
import { FaUserPlus } from 'react-icons/fa';
import { useAuthContext, useUsersContext, useSocketContext } from '../contexts';

import {useSelector, useDispatch} from "react-redux";
import { acceptRequest, rejectRequest } from '../store/users';

const FriendRequestList = () => {

	const dispatch = useDispatch()

	const auth = useSelector(state => state.auth);
	const users = useSelector(state => state.entities.users);

	const socket = useSocketContext()

	useEffect(() => {
		if(!users.loading.confirm) return;
		// TODO send my data to requester
		// socket.current.emit("friendRequestAccepted", {
		// 	payload: {

		// 	},
		// 	receiverId:
		// })
	}, [users.loading.confirm])

	const handleRequestConfirm = friend => dispatch(acceptRequest(friend));

	const handleRequestReject = id => dispatch(rejectRequest(id));

	return (
		<section className='list'>
			<div className='list__heading'>
				<div className='list__icon-wrapper'>
					<FaUserPlus className='list__icon' />
				</div>
				<h3 className='list__title'>
					Friend Requests <span>({users.friendRequests.length})</span>
				</h3>
			</div>
			<div className='list__group'>
				<ul className='list__body'>
					{users.friendRequests.map(friend => (
						<FriendRequestItem
							key={friend._id}
							friend={friend}
							confirm={handleRequestConfirm}
							reject={handleRequestReject}
						/>
					))}
				</ul>
			</div>
		</section>
	);
};

export default FriendRequestList;
