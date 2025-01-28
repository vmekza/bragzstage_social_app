import express from 'express';
import Post from '../models/Post.js';
import User from '../models/User.js';

const router = express.Router();

//Create post
router.post('/', async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).send(savedPost);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

//Update post
router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).send({ message: 'Post has been updated' });
    } else {
      res.status(403).send({ message: 'You can update only your post' });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

//Delete post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).send({ message: 'Post has been deleted' });
    } else {
      res.status(403).send({ message: 'You can delete only your post' });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});
//Like a post
router.put('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).send({ message: 'The post has been liked' });
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).send({ message: 'The post has been disliked' });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});
//Get a post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).send(post);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});
//Get timeline posts
router.get('/timeline/all', async (req, res) => {
  try {
    const userId = req.body.userId;
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).send({ message: 'User not found' });
    }
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).send(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

export default router;
