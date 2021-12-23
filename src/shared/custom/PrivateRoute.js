import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/Provider";

function PrivateRoute(props) {
  const { children, to } = props;

  const { user } = useAuth();
  return user ? children : <Navigate to={to}/>
}
export default PrivateRoute;