import React from 'react';
import './Post.css';
import { CgProfile } from "react-icons/cg";
import { GoVerified } from "react-icons/go";
import { FaRegComment, FaRetweet } from "react-icons/fa";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io"; // Import filled heart
import { FiShare } from "react-icons/fi";

// Destructure the new props
function Post({ displayName, username, verified, text, image, avatar, likes, isLiked, onLikeToggle }) {
  return (
    <div className="post">
      <div className="post__avatar">
        {avatar ? <img src={avatar} alt={displayName} /> : <CgProfile size={40} />}
      </div>
      <div className="post__body">
        <div className="post__header">
          <div className="post__header-text">
            <h3>
              {displayName}{" "}
              <span className="post__header-special">
                {verified && <GoVerified className="post__badge" />} @{username}
              </span>
            </h3>
          </div>
          <div className="post__header-description">
            <p>{text}</p>
          </div>
        </div>
        {image && <img src={image} alt="Post" className="post__image" />}
        <div className="post__footer">
          <div className="post__footer-action">
            <FaRegComment size={16} />
          </div>
          <div className="post__footer-action">
            <FaRetweet size={16} />
          </div>
          {/* Like button action */}
          <div className={`post__footer-action action__like ${isLiked && 'liked'}`} onClick={onLikeToggle}>
            {isLiked ? <IoMdHeart size={16} /> : <IoMdHeartEmpty size={16} />}
            <span>{likes > 0 && likes}</span>
          </div>
          <div className="post__footer-action">
            <FiShare size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}



export default Post;