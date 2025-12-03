// index.js
const express = require('express');
const Joi = require('joi');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Joi schema (matches your frontend rules)
const schema = Joi.object({
  fullname: Joi.string().pattern(/^[A-Za-z\s]{3,80}$/).required()
    .messages({ 'string.pattern.base': 'Use only letters and spaces (3-80 chars).'}),
  email: Joi.string().email().required().messages({ 'string.email': 'Enter a valid email.' }),
  username: Joi.string().pattern(/^[A-Za-z0-9._-]{3,20}$/).required()
    .messages({ 'string.pattern.base': '3-20 chars: letters, numbers, . _ -' }),
  password: Joi.string().min(8).required()
    .messages({ 'string.min': 'Password must be at least 8 characters.' }),
  phone: Joi.string().pattern(/^\d{10}$/).allow('', null)
    .messages({ 'string.pattern.base': 'Phone must be 10 digits.' }),
  age: Joi.number().integer().min(13).max(120).optional()
    .messages({ 'number.base': 'Age must be a number.', 'number.min': 'Age must be >= 13', 'number.max': 'Age must be <= 120' }),
  terms: Joi.boolean().valid(true).required().messages({ 'any.only': 'You must accept terms.' })
});

app.post('/api/signup', (req, res) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    // return all messages in an array
    const errors = error.details.map(d => ({ field: d.path.join('.'), message: d.message }));
    return res.status(400).json({ ok: false, errors });
  }

  // Here you would create the user, hash password, save to DB, etc.
  return res.json({ ok: true, msg: 'User validated and (mock) created.' });
});

// quick root to check server
app.get('/', (req, res) => res.send('Server running'));

app.listen(PORT, () => console.log('Server running on :' + PORT));
