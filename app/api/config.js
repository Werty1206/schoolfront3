export const BASE_URL = 'http://localhost:5000'

export const endpoints = {
  auth: `${BASE_URL}/users/auth`,
  me: `${BASE_URL}/users/me`,
  assignments: `${BASE_URL}/assignments`,
  class: `${BASE_URL}/users/classmates`,
  works: `${BASE_URL}/assignments/my`,
  work_to_do: `${BASE_URL}/assignment/do`,
  create_solved_assignment: `${BASE_URL}/create/solved_assignment`,
  unchecked_assignments: `${BASE_URL}/assignments/unchecked`,
  my_created_assignments: `${BASE_URL}/assignments/me`,
  get_check_assignment: `${BASE_URL}/assignment/check`,
  post_check_assignment: `${BASE_URL}/assignment/checked`,
  create_user: `${BASE_URL}/users`,
  change_user: `${BASE_URL}/users/update`,
  create_teacher: `${BASE_URL}/teachers`
}