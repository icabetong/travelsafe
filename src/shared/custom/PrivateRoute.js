import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/Provider";

function PrivateRoute(props) {
  const { children } = props;

  const { status } = useAuth();
  switch(status) {
    case 'fetching':
      return <></>;
    case 'authenticated':
      return children;
    case 'empty':
      return <Navigate to={props.to}/>;
    default: return <Navigate to={props.to}/>;
  }
}
export default PrivateRoute;