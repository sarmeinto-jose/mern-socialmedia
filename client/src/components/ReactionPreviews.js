import React from "react";
import ReactionPreview from "./ReactionPreview";
import { useSelector } from "react-redux";

const ReactionPreviews = props => {
	const { reactionPreviews, reactions, inComment = false } = props;
	const auth = useSelector(state => state.auth);

	return (
		<>
			<div
				className={
					inComment
						? "post__reacts comment__reactions"
						: "post__reacts"
				}
			>
				{reactionPreviews.slice(0, 3).map((type, index) => (
					<ReactionPreview type={type.react} key={index} />
				))}
			</div>

			{!inComment && (
				<span className="post__people-react">
					{reactions.length === 1 &&
					reactions[0].userId === auth.user?._id
						? `you liked this post`
						: reactions.length === 1
						? `${reactions[0].name} likes the post`
						: reactions.length === 2
						? `${
								reactions[0].userId === auth.user._id
									? "You"
									: reactions[0].name
						  } and ${
								reactions[1].userId === auth.user._id
									? "You"
									: reactions[1].name
						  } likes the post`
						: reactions.length > 2
						? `${reactions[0].name}, ${reactions[1].name} and ${
								reactions.length - 2
						  } ${reactions.length === 1 ? "other" : "others"}`
						: ""}
				</span>
			)}
		</>
	);
};

export default ReactionPreviews;
