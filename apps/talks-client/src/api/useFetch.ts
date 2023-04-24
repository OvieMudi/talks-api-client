import axios from 'axios';
import { ReactiveApiRequestState } from '../interfaces/reactiveApiRequestState.interface';

export type RequestMethods = 'GET' | 'POST';

export const baseURL = '/api/v1';

export async function useFetch<T>(path: string, method: RequestMethods, reactiveState: ReactiveApiRequestState<T>) {
  const makeApiCall = async () => {
    try {
      reactiveState.isLoading = true;
      const result = await axios.request({
        url: path,
        method,
        baseURL,
      });

      reactiveState.data = result.data;

      return <T>result.data;
    } catch (err) {
      console.error('makeApiCall => err:', err);
      reactiveState.hasError = true;
      reactiveState.error = err;
      return null;
    } finally {
      reactiveState.isLoading = false;
    }
  };

  return makeApiCall();
}
