import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useEffect } from "react";
import { deleteUser, getUserList } from "../actions/userActions";
import { useHistory } from "react-router-dom";
import Title from "../components/Title";

const UserListScreen = () => {
  const dispatch = useDispatch();

  const userList = useSelector(state => state.userList);
  const userInfo = useSelector(state => state.userLogin.userInfo);
  const userDelete = useSelector(state => state.userDelete);
  const { success: successDelete } = userDelete;

  const history = useHistory();
  const { users, loading, error } = userList;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(getUserList());
    } else {
      history.push("/");
    }
  }, [dispatch, history, userInfo, successDelete]);

  const deleteHandler = async userId => {
    if (window.confirm("Are you sure")) {
      dispatch(deleteUser(userId));
    }
  };

  return (
    <>
      <Title title="Store NotifyUsers" />
      <h1>Users</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped responsive hover className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <i className="fas fa-check" style={{ color: "green" }}></i>
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <Button className="btn-sm" variant="light">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => {
                      deleteHandler(user._id);
                    }}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default UserListScreen;
