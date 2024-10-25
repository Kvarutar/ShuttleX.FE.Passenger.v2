export interface RemoteMessage {
  notification: {
    title: string;
    body: string;
  };
  data: {
    key: string;
    payload: { OrderId: string };
  };
}
