import { useNavigate } from 'react-router-dom';
import { AuthView } from '../components/Auth.jsx';

const MemberPanelPage = () => {
  const navigate = useNavigate();
  return <AuthView onBack={() => navigate('/')} initialView="member" />;
};

export default MemberPanelPage;
