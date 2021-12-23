import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/Provider";

function ConditionalRoute(props) {
  const { children } = props;

  const { user } = useAuth();
  return user ? children : <Navigate to={props.to}/>
}
export default ConditionalRoute;