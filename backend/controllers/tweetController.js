import { Tweet } from "../models/tweetSchema.js";
import { User } from "../models/userSchema.js";

export const createTweet = async (req, res) => {
    try {
        const { description, id } = req.body;
        if (!description || !id) {
            return res.status(401).json({
                message: "Fields are required.",
                success: false
            });
        };
        const newTweet = await Tweet.create({
            description,
            userId: id,
        });
        // We will populate the user details right away to send back to the frontend
        const populatedTweet = await Tweet.findById(newTweet._id).populate({
            path: 'userId',
            select: 'name username'
        });
        return res.status(201).json({
            message: "Tweet created successfully.",
            success: true,
            tweet: populatedTweet
        })
    } catch (error) {
        console.log(error);
    }
}

export const deleteTweet = async (req,res) => {
    try {
        const {id}  = req.params;
        await Tweet.findByIdAndDelete(id);
        return res.status(200).json({
            message:"Tweet deleted successfully.",
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}

export const likeOrDislike = async (req,res) => {
    try {
        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;
        const tweet = await Tweet.findById(tweetId);
        if(tweet.like.includes(loggedInUserId)){
            // dislike
            await Tweet.findByIdAndUpdate(tweetId,{$pull:{like:loggedInUserId}});
            return res.status(200).json({
                message:"User disliked your tweet."
            })
        }else{
            // like
            await Tweet.findByIdAndUpdate(tweetId, {$push:{like:loggedInUserId}});
            return res.status(200).json({
                message:"User liked your tweet."
            })
        }
    } catch (error) {
        console.log(error);
    }
};

export const getAllTweets = async (req,res) => {
    try {
        const id = req.params.id;
        const loggedInUser = await User.findById(id);
        const loggedInUserTweets = await Tweet.find({userId:id})
            .populate({
                path: 'userId',
                select: 'name username'
            });

        const followingUserTweet = await Promise.all(loggedInUser.following.map((otherUsersId)=>{
            return Tweet.find({userId:otherUsersId})
                .populate({
                    path: 'userId',
                    select: 'name username'
                });
        }));
        
        const allTweets = loggedInUserTweets.concat(...followingUserTweet);

        return res.status(200).json({
            tweets: allTweets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
        })
    } catch (error) {
        console.log(error);
    }
}

export const getFollowingTweets = async (req,res) =>{
    try {
        const id = req.params.id;
        const loggedInUser = await User.findById(id); 
        const followingUserTweet = await Promise.all(loggedInUser.following.map((otherUsersId)=>{
            return Tweet.find({userId:otherUsersId})
                .populate({
                    path: 'userId',
                    select: 'name username'
                });
        }));

        const allFollowingTweets = [].concat(...followingUserTweet);

        return res.status(200).json({
            tweets: allFollowingTweets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        });
    } catch (error) {
        console.log(error);
    }
}
