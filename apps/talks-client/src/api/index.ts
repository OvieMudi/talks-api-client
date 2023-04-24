import { ReactiveApiRequestState } from '../interfaces/reactiveApiRequestState.interface';
import { Talk } from '../interfaces/talk.interface';
import { User } from '../interfaces/user.interface';
import { useFetch } from './useFetch';

export async function fetchUserByEmail(email: string, reactiveState: ReactiveApiRequestState<User[]>) {
  return useFetch<User[]>(`/users/?email=${email}`, 'GET', reactiveState);
}

export async function fetchUserTalks(userId: string, reactiveState: ReactiveApiRequestState<Talk[]>) {
  return useFetch<Talk[]>(`/users/${userId}/talks`, 'GET', reactiveState);
}

export async function findUserAndPopulateRooms(
  email: string,
  userReactiveState: ReactiveApiRequestState<User[]>,
  userTalksReactiveState: ReactiveApiRequestState<Talk[]>
) {
  const user = await fetchUserByEmail(email, userReactiveState);

  await fetchUserTalks(user[0].id, userTalksReactiveState);
}
