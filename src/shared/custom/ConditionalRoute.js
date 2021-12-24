import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/Provider";

function ConditionalRoute(props) {
  const { children } = props;

  const { user, profile } = useAuth();
  return user && profile ? children : <Navigate to={props.to}/>
}
export default ConditionalRoute;