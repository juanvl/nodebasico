import User from '../models/User';

class UserController {
  async store(req, res) {
    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { id, name, email } = await User.create(req.body);

    return res.status(201).json({ id, name, email });
  }

  async update(req, res) {
    const { email, currentPassword } = req.body;
    const user = await User.findByPk(req.userId);

    if (email && email !== user.email) {
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    if (currentPassword && !(await user.checkPassword(currentPassword))) {
      return res.status(401).json({ error: 'Current password is invalid' });
    }

    const { id, name } = await user.update(req.body);
    return res.json({ id, name, email });
  }
}

export default new UserController();
