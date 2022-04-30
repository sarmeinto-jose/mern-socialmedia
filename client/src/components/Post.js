import React, { useState, useRef, useEffect } from "react";
import { FaCamera, FaPaperPlane } from "react-icons/fa";
import moment from "moment";
import axios from "axios";
import { Link } from "react-router-dom";
import PostMedias from "./PostMedias";
import ReactButton from "./ReactButton";
import Toast from "./Toast";
import ReactionPreviews from "./ReactionPreviews";
import Comment from "./Comment";
import CircleImage from "./CircleImage";

import {useAppContext} from "../contexts"

import {useSelector} from "react-redux";

const maxCount = 200;

const Post = React.forwardRef(({ post, isFullscreen, small }, ref) => {
   const { toastIsShowing, toastType, toastMessage } = useAppContext();
   const auth = useSelector(state => state.auth);

   const [showMore, setShowMore] = useState(false);
   const [reactions, setReactions] = useState([]);
   const [reactionPreviews, setReactionPreviews] = useState([]);
   const [userReaction, setUserReaction] = useState();
   const [comments, setComments] = useState([]);
   const [loadingReact, setLoadingReact] = useState(false);
   const [errorReact, setErrorReact] = useState(null);
   const [loadingComment, setLoadingComment] = useState(false);
   const [errorComment, setErrorComment] = useState(null);

   const commentInputRef = useRef();

   useEffect(() => {
      if (!post.reactions) return;

      setReactions(
         post.reactions.map((curr) => ({
            id: curr.userId,
            name: curr.userName,
            reaction: curr.reaction,
         }))
      );

      if (post.comments) setComments(post.comments);
   }, []);

   useEffect(() => {
      setUserReaction(() => {
         const _ = reactions.find((curr) => curr.id === auth._id);
         return _ ? _.reaction : undefined;
      });

      setReactionPreviews(() => {
         const allReactions = reactions.map((i) => i.reaction);
         const distinct = [...new Set(allReactions)];
         const newArr = distinct.map((react) => {
            const count = allReactions.filter((item) => item === react).length;
            return { count, react };
         });
         return newArr.sort((a, b) => (a.count > b.count ? 1 : -1));
      });
   }, [reactions]);

   const handleCommentAdd = async (e) => {
      e.preventDefault();
      setLoadingComment(true);
      try {
         const { data } = await axios.post(
            `${process.env.REACT_APP_API_ENDPOINT}/posts/${post._id}/comments`,
            { comment: commentInputRef.current.value },
            {
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${auth.token}`,
               },
            }
         );
         setComments(data.comments);
         console.log(data.comments)
         setLoadingComment(false);
         commentInputRef.current.value = "";
      } catch (error) {
         setLoadingComment(false);
         setErrorComment(
            error.response && error.response.data.message
               ? error.response.data.message
               : error.message
         );
      }
   };

   const handlePostReact = async (value) => {
      setLoadingReact(true);
      try {
         const { data } = await axios.put(
            `${process.env.REACT_APP_API_ENDPOINT}/posts/${post._id}/likes`,
            { reaction: value },
            {
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${auth.token}`,
               },
            }
         );
         setReactions(() =>
            data.result.reactions.map((idx) => ({
               id: idx.userId,
               name: idx.userName,
               reaction: idx.reaction,
            }))
         );
         setLoadingReact(false);
      } catch (error) {
         setLoadingReact(false);
         setErrorReact(
            error.response && error.response.data.message
               ? error.response.data.message
               : error.message
         );
      }
   };

   return (
      <>
         {toastIsShowing && <Toast />}
         <div className={small ? "post post--small": isFullscreen ? "post post--big" : "post"} ref={ref}>
            <Link to={`/posts/${post._id}`}>
               <div className="post__header mb-_5">
                  <figure className="post__user-img">
                     <img
                        src={post.author.profileImage}
                        alt={`${post.author.firstname} ${post.author.lastname}`}
                     />
                  </figure>

                  <h2 className="post__heading">
                     {`${post.author.firstname} ${post.author.lastname} Shared a Story`}
                     <span className="middot">&#9679;</span>
                     <span className="post__follow">Following</span>
                  </h2>

                  <span className="post__time">
                     {moment(post.createdAt).fromNow(true)}
                  </span>
               </div>
            </Link>

            <div className="post__body">
               {post.multimedia && post.multimedia.length > 0 && (
                  <PostMedias posts={post.multimedia} fullHeight={isFullscreen} />
               )}

               <div className="post__description">
                  {post.title && <h2 className="post__title">{post.title}</h2>}
                  {post.body && isFullscreen ? (
                     <p className="post__caption">{post.body}</p>
                  ) : 
                  post.body ? (
                     <p className="post__caption">
                        {showMore
                           ? post.body
                           : post.body.split("").length <= maxCount
                           ? post.body
                           : `${post.body.substring(0, maxCount)}... `}
                        {post.body.split("").length >= maxCount && (
                           <span
                              className="post_show-more"
                              onClick={() => setShowMore(!showMore)}
                           >
                              {showMore ? " show less" : " show more"}
                           </span>
                        )}
                     </p>
                  ) : ''}
               </div>

               {(reactions.length > 0 || comments.length > 0) && (
                  <div className="post__stats">
                     {reactions.length > 0 ? <ReactionPreviews
                                             reactionPreviews={reactionPreviews}
                                             reactions={reactions}
                                          /> : <span>Be the first to react on this post</span>}

                     {comments.length > 0 && (
                        <span className="post__comment-counts">
                           {`${comments.length} ${
                              comments.length === 1 ? "comment" : "comments"
                           }`}
                        </span>
                     )}
                  </div>
               )}
            </div>

            {isFullscreen && (
               <div className="post__comments">
                  {comments.length === 0 ? <p className="post__no-comment">Be first to comment</p> : (
                     comments.map((comment) => (
                        <Comment
                           key={comment._id}
                           comment={comment}
                           postId={post._id}
                        />
                     ))
                  )}
               </div>
            )}

            <div className="post__footer">
               <form className="post__comment-form" onSubmit={handleCommentAdd}>
                  <input
                     ref={commentInputRef}
                     type="text"
                     placeholder="Write a comment"
                     className="post__comment-input"
                     required
                  />
               {/*   <FaCamera className="post__comment-icon" />*/}
                  <button type="submit" className="post__action post__action--plane">
                     <FaPaperPlane className="post__action-icon post__action--plane" />
                  </button>
               </form>


               <ReactButton
                  userReaction={userReaction}
                  react={handlePostReact}
                  loading={loadingReact}
               />
            </div>
         </div>
      </>
   );
});

export default Post;
