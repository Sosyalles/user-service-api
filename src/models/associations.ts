import User, { setupUserAssociations } from './User';
import UserDetail, { setupUserDetailAssociations } from './UserDetail';

// Setup associations
setupUserAssociations(UserDetail);
setupUserDetailAssociations(User);

export { User, UserDetail }; 