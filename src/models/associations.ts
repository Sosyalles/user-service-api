import User, { setupUserAssociations } from './User';
import UserDetail from './UserDetail';

// Setup associations
setupUserAssociations(UserDetail);

export { User, UserDetail }; 