import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

/* Страницы */
import AuthorizationPage from 'pages/AuthorizationPage/index';
import ResetPasPage from 'pages/ResetPasPage/index';
import ObjectPage from 'pages/ObjectsPage/';
import ViewImagesPage from 'pages/ViewImagesPage/index';
import TasksPage from 'pages/TasksPage/index';

export const useRoutes = (token) => {
  if (token) {
    return (
      <Switch>
        <Route path='/new_password' exact component={ResetPasPage}></Route>
        <Route path='/objects' exact component={ObjectPage}></Route>
        <Route path='/tasks' exact component={TasksPage}></Route>
        <Route path='/view' exact component={ViewImagesPage}></Route>
        <Redirect to='/objects'></Redirect>
      </Switch>
    );
  }
  return (
    <Switch>
      <Route path='/login' exact component={AuthorizationPage}></Route>
      <Redirect to='/login'></Redirect>
    </Switch>
  );
};
