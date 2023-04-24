import { Ref } from "vue";

export interface ReactiveApiRequestState<T> {
  data: T;
  error: any;
  isLoading: boolean;
  hasError: boolean;
}