import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/Provider";

function PrivateRoute(props) {
  const { children, to } = props;

  const auth = useAuth();
  return auth ? children : <Navigate to={to}/>
}
export default PrivateRoute;