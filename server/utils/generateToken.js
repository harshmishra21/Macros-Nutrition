import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'defaultjwtsecret', {
    expiresIn: '7d', // 7 days expiration matching frontend refresh requirements
  });
};

export default generateToken;
