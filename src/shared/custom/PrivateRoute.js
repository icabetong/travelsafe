import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/Provider";

function PrivateRoute(props) {
  const { children } = props;

  const { user } = useAuth();
  return user ? children : <Navigate to="/signin"/>
}
export default PrivateRoute;