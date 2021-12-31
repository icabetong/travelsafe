import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/Provider";

function ConditionalRoute(props) {
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
  // return loading ? <></> : user && profile ? children : <Navigate to={props.to}/>
}
export default ConditionalRoute;