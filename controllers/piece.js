const Piece = require('../models/piece');
const User = require('../models/user')


module.exports = {
    create,
    show,
  };


async function create(req, res) {
  if (req.isAuthenticated()) {
    try {
      const newPiece = await Piece.create(req.body);
      newPiece.users.push(req.user._id);
      await newPiece.save();
      const curUserDoc = await User.findById(req.user._id);
      curUserDoc.pieces.push(newPiece._id);
      await curUserDoc.save();
      res.redirect(`/profile/${req.user._id}`);
    } catch (err) {
      console.log(err);
      res.redirect(`/profile/${req.user._id}`);
    }
  } else { 
    res.redirect('/login');
  }
}

async function show(req, res) {
  try {
    const piece = await Piece.findById(req.params.pieceId);
    if (req.isAuthenticated()) {
      const curUserId = req.user._id
      const pieceOwner = req.params.userId 
      if (curUserId.toString() === pieceOwner.toString()) {
        res.render('piece/myPiece', { title: 'My Piece', piece });
      } else {
        res.render('piece/piece', { title: 'Piece', piece });
      }
    } else { 
      res.render('piece/piece', { title: 'Piece', piece });
    }
  } catch (err) {
    console.log(err);
    res.redirect(`/`);
  }
}