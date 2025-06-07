import ChartView from './components/ChartView.js';
import UserRegistrationForm from './components/UserRegistrationForm.js';
import UsersTableBody from './components/UsersTable/UsersTableBody.js';
import UserEditForm from './components/UserEditForm.js';
import Throw from './utils/Throw.js';

// Charts

/** @type {ChartView<number, number>} */
const userByAgeChart = new ChartView(/** @type {HTMLCanvasElement} */ (document.getElementById('proportion-users-by-age-chart'))
   || Throw.error('User by age chart canvas not found'));

userByAgeChart.render({
   title: 'Proporção de usuários por idade',
   type: 'bar',
   datasetOptions: {
      label: 'Idade',
      backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#F44336'],
      borderColor: ['#388E3C', '#1976D2', '#F57C00', '#D32F2F']
   }
});

/** @type {ChartView<'Ativo' | 'Inativo', number>} */
const activeByInactiveUsersChart = new ChartView(/** @type {HTMLCanvasElement} */ (document.getElementById('active-by-inactive-users-chart'))
   || Throw.error('Active by inactive users chart canvas not found'));

activeByInactiveUsersChart.render({
   title: 'Usuários ativos e inativos',
   type: 'pie',
   datasetOptions: {
      label: 'Usuários',
      backgroundColor: ['#4CAF50', '#F44336'],
      borderColor: ['#388E3C', '#D32F2F']
   }
});

/** @type {ChartView<string, number>} */
const subscriptionsByMonthChart = new ChartView(/** @type {HTMLCanvasElement} */ (document.getElementById('rate-of-subscription-per-month-chart'))
   || Throw.error('Subscriptions by month chart canvas not found'));

subscriptionsByMonthChart.render({
   title: 'Taxa de inscrição por mês',
   type: 'line',
   datasetOptions: {
      label: 'Inscrições',
      backgroundColor: ['#2196F3'],
      borderColor: ['#1976D2']
   }
});

// Interactive components

const userEditForm = new UserEditForm(/** @type {HTMLFormElement} */ (document.getElementById('edit-user-form'))
   || Throw.error('Edit user form not found'));

const usersTable = new UsersTableBody(/** @type {HTMLTableSectionElement} */ (document.querySelector('#users-table tbody'))
   || Throw.error('Users table body not found'));

const userRegistrationForm = new UserRegistrationForm(/** @type {HTMLFormElement} */ (document.getElementById('user-registration-form'))
   || Throw.error('User registration form not found'));

usersTable.onInsert.subscribe(userInserted => {
   userByAgeChart.update([userInserted.age, 1]);
   
   activeByInactiveUsersChart.update([userInserted.isActive ? 'Ativo' : 'Inativo', 1]);
   
   subscriptionsByMonthChart.update([userInserted.createdAt.toLocaleString('default', { month: 'long' }), 1]);
});

userRegistrationForm.onSubmit.subscribe((newUser) => {
   usersTable.append(newUser);
});

usersTable.onEdit.subscribe(user => userEditForm.load(user));

userEditForm.onSave.subscribe((userId, userUpdateDTO) => {
   usersTable.update(userId, userUpdateDTO);
});

usersTable.onUpdate.subscribe((userOldState, userNewState) => {
   if (userOldState.age !== userNewState.age)
      userByAgeChart.update(
         [userNewState.age, 1],
         [userOldState.age, -1]
      );

   if (userOldState.isActive !== userNewState.isActive)
      activeByInactiveUsersChart.update(
         [userNewState.isActive ? 'Ativo' : 'Inativo', 1],
         [userOldState.isActive ? 'Ativo' : 'Inativo', -1]
      );

   if (userOldState.createdAt.getMonth() !== userNewState.createdAt.getMonth())
      subscriptionsByMonthChart.update(
         [userNewState.createdAt.toLocaleString('default', { month: 'long' }), 1],
         [userOldState.createdAt.toLocaleString('default', { month: 'long' }), -1]
      );
});

usersTable.onDelete.subscribe(user => {
   userByAgeChart.update([user.age, -1]);
   activeByInactiveUsersChart.update([user.isActive ? 'Ativo' : 'Inativo', -1]);
   subscriptionsByMonthChart.update([user.createdAt.toLocaleString('default', { month: 'long' }), -1]);
});