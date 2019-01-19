const express = require('express');
const router = express.Router();
const {getDecks} = require('../db/decks');

router.get('/decks', (req, res) => {
  const decks = getDecks(req.user.email);
  res.json({decks});
});

module.exports = router;
