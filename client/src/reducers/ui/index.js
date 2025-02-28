import { combineReducers } from 'redux';

import authenticateForm from './authenticate-form';
import userCreateForm from './user-create-form';
import projectCreateForm from './project-create-form';
import schedulerCreateForm from './scheduler-create-form';
import schedulerState from './scheduler-state';

export default combineReducers({
  authenticateForm,
  userCreateForm,
  projectCreateForm,
  schedulerCreateForm,
  schedulerState,
});
