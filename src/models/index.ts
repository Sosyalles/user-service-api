import User from './User';
import UserDetail from './UserDetail';

const models = {
  User,
  UserDetail
};

// Run associations if defined
if ((User as any).associate) {
  (User as any).associate(models);
}

if ((UserDetail as any).associate) {
  (UserDetail as any).associate(models);
}

export default models; 