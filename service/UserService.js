const { User } = require("../db/Connection");

const userService = {
  async getAllUser() {
    return await User.findAll();
  },

  async getUserById(user_id) {
    const user = await User.findOne({ where: { user_id } });
    if (user == null) {
      console.log("유저를 찾을 수 없습니다.");
    }
    console.log(user instanceof User);

    return user;
  },

  async createUser(user_id, access_token) {
    const [user, created] = await User.findOrCreate({
      where: { user_id },
      defaults: { access_token },
    });

    if (!created) {
      await user.update({ access_token });
    }

    return user;
  },

  async updateUser(user_id, access_token) {
    return await User.update({ access_token }, { where: { user_id } });
  },

  async deleteUser(user_id) {
    return await User.destroy({ where: { user_id } });
  },
};

module.exports = userService;
