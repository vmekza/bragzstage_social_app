import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

const router = express.Router();

//Update user
router.put('/:id', async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).send({ message: err.message });
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).send({ message: 'Account has been updated' });
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  } else {
    return res
      .status(403)
      .send({ message: 'You can update only your account!' });
  }
});

//Delete user
router.delete('/:id', async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res
        .status(200)
        .send({ message: 'Account has been deleted successfully' });
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  } else {
    return res
      .status(403)
      .send({ message: 'You can delete only your account!' });
  }
});

//Get a user
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).send(other);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

//Follow a user
router.put('/:id/follow', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).send({ message: 'User has been followed' });
      } else {
        res.status(403).send({ message: 'You already follow this user' });
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  } else {
    res.status(403).send({ message: 'You can not follow yourself' });
  }
});

//Unfollow a user
router.put('/:id/unfollow', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).send({ message: 'User has been unfollowed' });
      } else {
        res.status(403).send({ message: 'You do not follow this user' });
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  } else {
    res.status(403).send({ message: 'You can not unfollow yourself' });
  }
});
export default router;
