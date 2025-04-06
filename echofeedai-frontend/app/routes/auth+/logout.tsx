import { action as LogoutAction } from "@/routes/action+/auth+/logout.action";
export const action = LogoutAction;
export const loader = () => {
  return null;
};
const Logout = () => {
  return <div>Logout</div>;
};

export default Logout;
