export type ORIGIN = "email" | "password" | "topics" | "respond";

export type ActionResultSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

export type ActionResultError<T> = {
  success: false;
  origin: ORIGIN;
  message: string;
  data: T;
};

export type ActionResult<T> = ActionResultSuccess<T> | ActionResultError<T>;
