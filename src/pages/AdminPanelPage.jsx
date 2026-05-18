import { useNavigate } from 'react-router-dom';
import { AuthView } from '../components/Auth.jsx';

const AdminPanelPage = () => {
  const navigate = useNavigate();
  return <AuthView onBack={() => navigate('/')} initialView="admin" />;
};

export default AdminPanelPage;
